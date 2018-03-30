namespace lib {

    export class CallResponse extends Response {

        public static CMD = 11;

        public data: any;

        constructor(uuid: string = "", processTime: number = 0, data: any = null) {
            super(CallResponse.CMD, uuid, processTime);
            this.data = data;
        }

        /**
         * 编码
         * @param {bk.VByteArray} bytes
         */
        public encode(bytes: ByteArray): void {
            bytes.writeUTF(JSON.stringify(this.data));
        }

        public decode(bytes: ByteArray): void {
            this.data = JSON.parse(bytes.readUTF());
        }

        public get value() {
            return {
                head: this.head,
                data: this.data
            }
        }
    }
}