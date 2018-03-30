namespace lib {

    export class DependProxy {

        private depends: DependVO[] = [];

        /**
         * 注册远程依赖，给模块内部调用
         * @param {Interface} intf
         */
        public add(depend: DependVO): void {
            this.depends.push(depend);
            var funcs = this._awaitDependFunctions;
            var list = funcs[depend.config.name];
            if (list) {
                var copy = list.concat();
                for (let i = 0; i < copy.length; i++) {
                    var condition = copy[i].condition;
                    if (copy[i].resolve && (!condition || condition.equal(depend))) {
                        copy[i].resolve();
                        copy[i].resolve = null;
                    }
                }
                for (let i = 0; i < list.length; i++) {
                    if (list[i].resolve == null) {
                        list.splice(i, 1);
                    }
                }
                if (list.length == 0) {
                    delete funcs[depend.config.name];
                }
            }
            this.$checkReady();
        }

        /**
         * 是否有某个依赖
         * @param {string} name
         * @returns {boolean}
         */
        public has(name: string): boolean {
            var dps = this.depends;
            for (let i = 0, len = dps.length; i < len; i++) {
                if (dps[i].config.name == name) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 把某个服务器的依赖全部去掉
         * @param {string} uuid
         */
        public removeServer(uuid: string): void {
            var dps = this.depends;
            for (let i = 0; i < dps.length; i++) {
                if (dps[i].server.uuid == uuid) {
                    dps.splice(i, 1);
                    i--;
                }
            }
            this.$checkReady();
        }

        /**
         * 调用远程接口，如果远程接口没有好，会选择继续等待，如果没有返回结果并且网络出错，会重新发送请求
         * @param {string} name 接口名称
         * @param {any[]} params 参数
         * @param {lib.ISocket} socket 指定的网络
         * @param {string} serverType 服务器类型
         * @returns {Promise<lib.CallResult>}
         */
        public async call(name: string, params: any[] = [], condition: CallAwaitConditionVO = new CallAwaitConditionVO()): Promise<CallResult> {
            var dps = this.depends;
            for (let i = 0, len = dps.length; i < dps.length; i++) {
                if (dps[i].config.name == name && condition.equal(dps[i])) {
                    var result = await dps[i].$call(params, condition.$remoteId);
                    //如果接口调用后没有返回，而是断开连接后统一返回 (参见 SocketBase 短线处理)，则继续等待接口 ok
                    if (result.errorCode == Error.$SOCKET_CLOSED) {
                        if (condition.await) {
                            return await StaticProxy.dependProxy.call(name, params, condition);
                        } else {
                            return result;
                        }
                    } else {
                        return result;
                    }
                }
            }
            //等待接口 ok
            await this.$awaitDependReady(name, condition);
            return this.call(name, params, condition);
        }

        /**
         *
         * 调用符合条件的所有远程接口，如果远程接口没有好，不会选择继续等待，并且没有任何返回值
         * @param {string} name
         * @param {any[]} params
         * @param {lib.CallAwaitConditionVO} condition
         */
        public notify(name: string, params: any[] = [], condition: CallAwaitConditionVO = null): void {
            var dps = this.depends;
            for (let i = 0, len = dps.length; i < dps.length; i++) {
                if (dps[i].config.name == name && (!condition || condition.equal(dps[i]))) {
                    dps[i].$call2(params);
                }
            }
        }

        $hasServerDepend(uuid: string): boolean {
            for (let i = 0; i < this.depends.length; i++) {
                if (this.depends[i].server.uuid == uuid) {
                    return true;
                }
            }
            return false;
        }

        private _awaitDependFunctions: any = {};

        /**
         * 等待某个接口准备 ok
         * @param {DependVO} depend
         * @returns {Promise<void>}
         */
        async $awaitDependReady(name: string, condition: CallAwaitConditionVO): Promise<void> {
            var __ = this;
            return new Promise<void>(function (resolve) {
                var funcs = __._awaitDependFunctions;
                if (!funcs[name]) {
                    funcs[name] = [];
                }
                funcs[name].push({"condition": condition, "resolve": resolve});
            });
        }

        _awaitReadyFunctions: Function[] = [];
        _awaitNotReadyFunctions: Function[] = [];

        /**
         * 等待所有接口完成，或等待接口未完成
         * @param {boolean} flag
         * @returns {Promise<any>}
         */
        public async awaitReady(flag: boolean = true) {
            if (flag && this.$isReady || !flag && !this.$isReady) {
                return;
            } else {
                var __ = this;
                return new Promise(function (resolve: Function) {
                    if (flag) {
                        __._awaitReadyFunctions.push(resolve);
                    } else {
                        __._awaitNotReadyFunctions.push(resolve);
                    }
                });
            }
        }

        _isReady: boolean = false;

        get $isReady(): boolean {
            return this._isReady;
        }

        /**
         * 检测服务器是否 ok
         * 1 检测依赖是否全部注册
         */
        $checkReady(): void {
            //检测依赖
            this._isReady = true;
            var dps = StaticProxy.serverConfig.depends;
            for (let d = 0, dlen = dps.length; d < dlen; d++) {
                if (!dps[d].necessary) continue;
                if (!this.has(dps[d].name)) {
                    this._isReady = false;
                    break;
                }
            }
            if (this._isReady) {
                let funcs = this._awaitReadyFunctions;
                this._awaitReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            } else {
                let funcs = this._awaitNotReadyFunctions;
                this._awaitNotReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
        }
    }
}