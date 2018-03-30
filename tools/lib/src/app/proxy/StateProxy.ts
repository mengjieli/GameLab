namespace lib {
    export class StateProxy {

        constructor() {
            this._checkDependReady();
        }

        async _checkDependReady() {
            while (true) {
                await StaticProxy.dependProxy.awaitReady();
                this.$checkReady();
                await StaticProxy.dependProxy.awaitReady(false);
                this.$checkReady();
            }
        }

        private awaits: AwaitVO[] = [];

        async _checkAwait(vo: AwaitVO) {
            while (true) {
                await vo.awaitReady();
                this.$checkReady();
                await vo.awaitReady(false);
                this.$checkReady();
            }
        }

        /**
         * 添加状态检查项
         * @param {lib.AwaitVO} vo
         */
        public addAwait(vo: AwaitVO): void {
            for (let i = 0; i < this.awaits.length; i++) {
                if (this.awaits[i] == vo) {
                    return;
                }
            }
            this.awaits.push(vo);
            this._checkAwait(vo);
            this.$checkReady();
        }

        /**
         * 删除状态检查项
         * @param {lib.AwaitVO} vo
         */
        public removeAwait(vo: AwaitVO): void {
            for (let i = 0; i < this.awaits.length; i++) {
                if (this.awaits[i] == vo) {
                    this.awaits.splice(i, 1);
                    this.$checkReady();
                    return;
                }
            }
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
         * 1. 检查 dependProxy ready 状态
         */
        $checkReady() {
            this._isReady = true;

            //检查 depend 是否 ready
            StaticProxy.dependProxy.$checkReady();
            if (!StaticProxy.dependProxy.$isReady) {
                this._isReady = false;
            }

            //检查等待项
            for (let i = 0; i < this.awaits.length; i++) {
                if (!this.awaits[i].isReady) {
                    this._isReady = false;
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