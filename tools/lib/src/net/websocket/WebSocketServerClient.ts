namespace lib {

    export class WebSocketServerClient extends SocketBase implements ISocketServerClient {

        private _isConnect: boolean;
        private _isClosed: boolean;
        protected connection: any;
        protected type: string;

        /**
         * 构造函数
         * @param connection WebSocket 类库的 Connect 对象
         * @param {string} type 数据类型，是 utf-8 还是 binary
         */
        constructor(connection: any, type: string = "binary") {
            super();
            this.isClient = false;
            this.connection = connection;
            this._isConnect = true;
            this._isClosed = false;
            this.type = type;
            this.connection.on("error", this.onError.bind(this));
            this.connection.on("message", this.onReceive.bind(this));
            this.connection.on("close", this.onClose.bind(this));
            // console.log("connect!!!");
        }

        /**
         * 链接是否已关闭
         * @returns {boolean}
         */
        public get isClosed(): boolean {
            return this._isClosed;
        }

        /**
         * 是否连上
         * @returns {boolean}
         */
        public get isConnect(): boolean {
            return this._isConnect;
        }

        /**
         * 链接发生错误
         * @param e
         */
        protected onError(e: Error) {

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
         * 链接断开
         * @param {number} code
         * @param {string} desc
         */
        protected onClose(code: number, desc: string = ""): void {
            this._isClosed = true;
            this._isConnect = false;
            this.onAwaitClose(code);
        }

        /**
         * 发送数据
         * @param {ByteArray} bytes
         */
        public send(bytes: ByteArray) {
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

        /**
         * 关闭链接
         */
        public close(): void {
            if (!this.isClosed) {
                this.connection.close();
                this.onClose(0);
            }
        }
    }
}