namespace lib {

    /**
     * 服务器配对信息
     */
    export class ServerVO {

        private _socket: ISocket;

        constructor(socket: ISocket) {
            this._socket = socket;

            this.checkReadyState();
        }

        /**
         * 是否释放掉
         * @type {boolean}
         */
        $dispose: boolean = false;

        /**
         * 检测服务器是否 ready
         * @returns {Promise<void>}
         */
        private async checkReadyState() {
            let awaitName = "awaitReady";
            while (!this.$dispose) {
                //必须服务器已连上
                await this.awaitConnect();

                //连上后就开始检测 ready 状态
                //如果服务器 ready
                await StaticProxy.dependProxy.call(awaitName, [], new CallAwaitConditionVO(this._uuid, "", null, this.socket.isClient));
                if (this.$dispose) {
                    break;
                }
                this.isReady = true;
                //如果服务器 not ready
                await StaticProxy.dependProxy.call(awaitName, [false], new CallAwaitConditionVO(this._uuid, "", null, this.socket.isClient));
                if (this.$dispose) {
                    break;
                }
                this.isReady = false;
            }
            // console.log("退出 server vo!");
            this.dispose();
        }

        /**
         * 清除内存，如果是 ServerClient 则在链接关闭时调用此函数
         */
        public dispose(): void {

        }

        private _awaitConnectFunctions: Function[] = [];
        private _awaitDisconnectFunctions: Function[] = [];

        /**
         * 等待连接开启或断开
         * @returns {Promise<void>}
         */
        public async awaitConnect(flag: boolean = true): Promise<void> {
            if (flag && this.isConnect || !flag && !this.isConnect) {
                return;
            }
            var __ = this;
            return new Promise<void>(function (resolve) {
                if (flag) {
                    __._awaitConnectFunctions.push(resolve);
                } else {
                    __._awaitDisconnectFunctions.push(resolve);
                }
            });
        }

        /**
         * 获取 socket
         * @returns {ISocket}
         */
        public get socket(): ISocket {
            return this._socket;
        }

        private _uuid: string;
        /**
         * 服务器 uuid
         * @param {string} val
         */
        public set uuid(val: string) {
            this._uuid = val;
        }

        public get uuid(): string {
            return this._uuid;
        }

        private _connectionUUID: string;

        private _type: string;
        /**
         * 服务器类型
         * @returns {string}
         */
        public get type(): string {
            return this._type;
        }

        public set type(val: string) {
            this._type = val;
        }

        /**
         * 是否有对内的服务器
         * @returns {boolean}
         */
        public get hasServer(): boolean {
            return !!(this._serverIp && this._serverIp != "");
        }

        private _serverIp: string = "";
        /**
         * 对内开发的服务器 ip
         * @returns {string}
         */
        public get serverIp(): string {
            return this._serverIp;
        }

        public set serverIp(val: string) {
            this._serverIp = val;
        }

        private _serverPort: number;
        /**
         * 对内开放的服务器端口号
         * @returns {string}
         */
        public get serverPort(): number {
            return this._serverPort
        }

        public set serverPort(val: number) {
            this._serverPort = val;
        }

        private _linkType: string = "websocket";
        /**
         * 对内开放的服务器链接类型
         * @returns {string}
         */
        public get linkType(): string {
            return this._linkType;
        }

        public set linkType(val: string) {
            this._linkType = val;
        }

        private _isReady: boolean = false;
        /**
         * 服务器是否 ready
         * @returns {boolean}
         */
        public get isReady(): boolean {
            return this._isReady;
        }

        public set isReady(val: boolean) {
            if (this._isReady == val) {
                return;
            }
            this._isReady = val;
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

        private _awaitReadyFunctions: Function[] = [];
        private _awaitNotReadyFunctions: Function[] = [];

        /**
         * 等待服务器 ready
         * @param {boolean} flag
         * @returns {Promise<void>}
         */
        public awaitReady(flag: boolean) {
            var __ = this;
            return new Promise<void>(function (resolve) {
                if (flag) __._awaitReadyFunctions.push(resolve);
                else __._awaitNotReadyFunctions.push(resolve);
            });
        }

        private _isConnect: boolean = false;
        /**
         * 是否连上服务器
         * @returns {boolean}
         */
        public get isConnect(): boolean {
            return this._isConnect;
        }

        public set $isConnect(val: boolean) {
            if (this._isConnect == val) {
                return;
            }
            this._isConnect = val;
            if (val) {
                let funcs = this._awaitConnectFunctions;
                this._awaitConnectFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            } else {
                let funcs = this._awaitDisconnectFunctions;
                this._awaitDisconnectFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
        }

        public static INIT_SERVER_CLASS = ServerVO;
        public static INIT_CLIENT_CLASS = ServerVO;
    }
}