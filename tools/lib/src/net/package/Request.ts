namespace lib {

    export class Request extends ByteArray implements IMessage, IRemote {

        public head: RequestHead;

        private resolve: Function;

        constructor(cmd: number = -1) {
            super();

            if (cmd != -1) {
                this.head = new RequestHead(cmd, Help.getuuid());
            }
        }

        /**
         * 设置 head 内容
         * @param {RequestHead} head
         */
        public setHead(head: RequestHead): void {
            if (this.head) {
                this.head.readFrom(head);
            } else {
                this.head = head;
            }
        }

        /**
         * 发送本条请求
         * @param {ISocket} net
         * @returns {Promise<ZeroPackage>}
         */
        public send(net: ISocket): Promise<ZeroResponse> {
            this.head.encode(this);
            this.encode(this);
            net.addRemote(this);
            net.send(this);
            var __ = this;
            return new Promise<ZeroResponse>(function (resolve: Function) {
                __.resolve = resolve;
            }.bind(this));
        }

        /**
         * 消息编码
         * @param {ByteArray} bytes
         */
        public encode(bytes: ByteArray): void {
        }

        /**
         * 消息解码
         * @param {ByteArray} bytes
         */
        public decode(bytes: ByteArray): void {

        }

        public onReceive(head: ResponseHead, bytes: ByteArray): void {
        }

        public onBack(head: ZeroResponse): void {
            var func = this.resolve;
            this.resolve = null;
            func(head);
        }

        public get remoteId(): string {
            return this.head.remoteId;
        }

        public get value(): any {
            return {
                head: this.head.value
            }
        }
    }
}