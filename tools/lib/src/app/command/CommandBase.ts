namespace lib {

    export abstract class CommandBase {

        private _socket: ISocket;
        private _startTime: number;
        private _head: IHead;
        private _bytes: ByteArray;
        private _message: IMessage;

        constructor(socket: ISocket, head: IHead, bytes: ByteArray, message: IMessage = null) {
            this._startTime = this.currentTime;
            this._socket = socket;
            this._head = head;
            try {
                this._bytes = bytes;
                this._message = message;
                this.execute();
            } catch (e) {
                console.log(e);
                this.fail(Error.EXECUTE_ERROR, e);
            }
        }

        /**
         * 处理消息
         */
        protected abstract execute(): void;

        /**
         * 消息处理成功
         */
        protected success(): void {
            var msg = new ZeroResponse(this.head.remoteId, this.currentTime - this.startTime, 0, this.head.cmd);
            msg.send(this.socket);
        }

        /**
         * 消息处理失败
         * @param {number} code
         */
        protected fail(code: number, message: string = ""): void {
            var msg = new ZeroResponse(this.head.remoteId, this.currentTime - this.startTime, code, this.head.cmd, message);
            msg.send(this.socket);
        }

        /**
         * 发送消息
         * @param {ByteArray} msg
         */
        protected send(msg: ByteArray): void {
            this.socket.send(msg);
        }


        public get currentTime(): number {
            return (new Date()).getTime();
        }

        public get startTime(): number {
            return this._startTime;
        }

        protected get socket(): ISocket {
            return this._socket;
        }

        protected get head(): IHead {
            return this._head;
        }

        public get bytes(): ByteArray {
            return this._bytes;
        }

        /**
         * 收到的协议对象
         * @returns {IMessage}
         */
        public get message(): IMessage {
            return this._message;
        }
    }
}