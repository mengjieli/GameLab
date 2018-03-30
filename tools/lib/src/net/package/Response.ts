namespace lib {

    export class Response extends ByteArray implements IMessage {

        public head: ResponseHead;

        constructor(cmd: number = -1, uuid: string = "", processTime: number = 0) {
            super();
            if (cmd != -1) {
                this.head = new ResponseHead(cmd, uuid, processTime);
            }
        }

        /**
         * 设置 head 内容
         * @param {ResponseHead} head
         */
        public setHead(head: ResponseHead): void {
            if (this.head) {
                this.head.readFrom(head);
            } else {
                this.head = head;
            }
        }

        public send(net: ISocket): void {
            //写消息头
            this.head.encode(this);
            //写消息体
            this.encode(this);
            //发送消息
            net.send(this);
        }

        /**
         * 编码
         * @param {bk.VByteArray} bytes
         */
        public encode(bytes: ByteArray): void {

        }


        /**
         * 消息解码
         * @param {ByteArray} bytes
         */
        public decode(bytes: ByteArray): void {

        }

        public get value(): any {
            return {
                head: this.head.value
            }
        }
    }
}