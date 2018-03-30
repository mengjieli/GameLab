namespace lib {

    export class ZeroResponse extends Response {

        /**
         * 错误码
         */
        public errorCode: number;

        /**
         * 请求的协议号
         */
        public requestCmd: number;

        /**
         * 错误信息
         * @type {string}
         */
        public message: string = "";

        constructor(uuid: string = "", processTime: number = 0, errorCode: number = 0, requestCmd: number = 0, message: string = "") {
            super(0, uuid, processTime);
            this.errorCode = errorCode;
            this.requestCmd = requestCmd;
            this.message = message;
        }

        public encode(bytes: ByteArray): void {
            bytes.writeInt(this.errorCode)
            bytes.writeUInt(this.requestCmd);
            bytes.writeUTF(this.message);
        }

        public decode(bytes: ByteArray): void {
            this.errorCode = bytes.readInt();
            this.requestCmd = bytes.readUInt();
            this.message = bytes.readUTF();
        }

        public get value() {
            return {
                head: this.head.value,
                errorCode: this.errorCode,
                requestCmd: this.requestCmd,
                message: this.message
            }
        }
    }
}