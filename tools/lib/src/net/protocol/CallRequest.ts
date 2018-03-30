namespace lib {

    export class CallRequest extends Request {

        public static CMD = 10;

        /**
         * 调用的接口名称
         */
        public name: string;

        /**
         * 调用参数
         */
        public params: any[];

        public response: CallResponse;

        constructor(name = "", params: any[] = []) {
            super(CallRequest.CMD);
            this.name = name;
            this.params = params;
        }

        public decode(bytes: ByteArray): void {
            this.name = bytes.readUTF();
            this.params = JSON.parse(bytes.readUTF());
        }

        public encode(bytes: ByteArray): void {
            bytes.writeUTF(this.name);
            bytes.writeUTF(JSON.stringify(this.params));
        }

        public onReceive(head: ResponseHead, bytes: ByteArray): void {
            if (head.cmd == CallResponse.CMD) {
                this.response = new CallResponse();
                this.response.head = head;
                this.response.decode(bytes);
            }
        }
    }
}