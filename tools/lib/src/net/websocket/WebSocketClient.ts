namespace lib {

    var WSClient = require("websocket").client;

    export class WebSocketClient extends SocketBase implements ISocketClient {

        private client: any;
        private connection: any;
        private _isConnect: boolean = false;
        private _isClosed: boolean = true;
        private _type: string;

        protected serverIp: string;
        protected serverPort: number;


        /**
         * 没有连上和断开是否自动链接服务器
         * @type {boolean}
         */
        public autoLinkServer: boolean = true;
        /**
         * 断开链接后相隔多久自动链接服务器
         * @type {number}
         */
        public connectSleep: number = 100;

        constructor(type: string = "binary") {
            super();
            this.isClient = true;
            this._type = type;

            this._autoLink();
        }

        private async _autoLink() {
            while (this.autoLinkServer) {
                //等待链接上服务器
                await this.awaitConnect();

                //等待网络断开
                await this.awaitClose();

                if (this.autoLinkServer) {
                    //自动连接
                    this.connect(this.serverIp, this.serverPort);
                }
            }
        }

        /**
         * 消息类型，有 binary 和 utf8 之分
         * @returns {string}
         */
        public get type(): string {
            return this._type;
        }

        /**
         * 是否连上服务器
         * @returns {boolean}
         */
        public get isConnect(): boolean {
            return this._isConnect;
        }

        /**
         * 链接是否已关闭
         * @returns {boolean}
         */
        public get isClosed(): boolean {
            return this._isClosed;
        }

        /**
         * 链接服务器
         * @param {string} ip 服务器 IP 地址
         * @param {number} port 服务器端口号
         */
        public connect(ip: string, port: number): void {
            this.serverIp = ip;
            this.serverPort = port;

            //链接服务器
            this.client = new WSClient();
            this.client.on("connectFailed", this.onConnectError.bind(this));
            this.client.on("connect", this.onConnect.bind(this));
            this.client.connect("ws://" + ip + ":" + port + "/");

            this._isConnect = false;
            this._isClosed = true;
        }

        public awaitConnect(ip: string = "", port: number = 0): Promise<number> {
            if (port) {
                this.connect(ip, port);
            }
            return super.awaitConnect();
        }

        protected onConnect(connection: any): void {
            this.connection = connection;
            connection.on("error", this.onError.bind(this));
            connection.on("close", this.onClose.bind(this));
            connection.on("message", this.onReceive.bind(this));
            this._isConnect = true;
            this._isClosed = false;
            this.connectComplete();
        }

        protected onConnectError(e: Error): void {
            let __ = this;
            setTimeout(function () {
                __.connect(__.serverIp, __.serverPort);
            }, this.connectSleep);
        }

        protected onError(e: Error): void {

        }

        /**
         * 结束链接
         * @param {number} code
         * @param {string} desc
         */
        protected onClose(code: number, desc: string = ""): void {
            this._isConnect = false;
            this._isClosed = true;
            this.connection = null;
            this.onAwaitClose(code);
        }

        /**
         * 收到消息
         * @param message
         */
        public onReceive(message: any): void {
            var data;
            if (this.type == "utf8") {
                data = JSON.parse(message.utf8Data);
            }
            else if (this.type == "binary") {
                data = message.binaryData;
            }
            var bytes = new ByteArray();
            bytes.writeArray(data);
            this.dispatchMessage(bytes);
        }

        /**
         * 发送数据
         * @param {ByteArray} bytes 需要发送的二进制数据
         */
        public send(bytes: ByteArray): void {
            if (!this._isConnect) {
                var head = SocketBase.readHead(bytes);
                if (!head.isRequest) { //如果是返回，则保存起来
                    SocketBuffer.addMessage(head.remoteId, bytes);
                    // console.log("save buffer:",head.headVersion,head.cmd,head.remoteId,bytes.length);
                }
                // console.log("send fail:",head.headVersion,head.cmd,head.remoteId,bytes.length);
                return;
            }
            // var head = SocketBase.readHead(bytes);
            // console.log("send ok:",head.headVersion,head.cmd,head.remoteId,bytes.length);
            if (this.type == "binary") {
                this.connection.sendBytes(new Buffer(bytes.arrayData));
            } else {
                this.connection.sendUTF(bytes.toString());
            }
        }

        public close(): void {
            if (this.connection && !this._isClosed) {
                this.connection.close();
                this.onClose(0);
            }
        }
    }
}