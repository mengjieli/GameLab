namespace lib {

    export class RegisterServerRequest extends Request {

        public static CMD: number = 14;

        public uuid: string;
        public type: string;

        constructor(uuid: string, type: string) {
            super(RegisterServerRequest.CMD);
        }

        public encode(bytes: ByteArray): void {
            bytes.writeUTF(this.uuid);
            bytes.writeUTF(this.type);
        }

        public decode(bytes: ByteArray): void {
            this.uuid = bytes.readUTF();
            this.type = bytes.readUTF();
        }
    }
}