namespace lib {

    export class RegisterInterfaceRequest extends Request {

        public static CMD: number = 12;

        /**
         * 是否为反向注册
         */
        public reverseRegister: boolean;
        /**
         * 服务器 uuid
         */
        public uuid: string;
        /**
         * 服务器类型
         */
        public type: string;
        /**
         * 对内的服务器 ip
         */
        public serverIp: string;
        /**
         * 对内的服务器端口号
         */
        public serverPort: number;
        /**
         * 接口配置
         */
        public config: any;

        constructor(reverseRegister: boolean = false, uuid: string = "", type: string = "", serverIp: string = "", serverPort: number = 0, config: any = null) {
            super(RegisterInterfaceRequest.CMD);
            this.reverseRegister = reverseRegister;
            this.uuid = uuid;
            this.type = type;
            this.serverIp = serverIp;
            this.serverPort = serverPort;
            this.config = config;
        }

        public encode(bytes: ByteArray): void {
            bytes.writeBoolean(this.reverseRegister);
            bytes.writeUTF(this.uuid);
            bytes.writeUTF(this.type);
            bytes.writeUTF(this.serverIp);
            bytes.writeUInt(this.serverPort);
            bytes.writeUTF(JSON.stringify(this.config));
        }

        public decode(bytes: ByteArray): void {
            this.reverseRegister = bytes.readBoolean();
            this.uuid = bytes.readUTF();
            this.type = bytes.readUTF();
            this.serverIp = bytes.readUTF();
            this.serverPort = bytes.readUInt();
            this.config = JSON.parse(bytes.readUTF());
        }

        public get value() {
            return {
                head: this.head.value,
                reverseRegister: this.reverseRegister,
                uuid: this.uuid,
                type: this.type,
                serverIp: this.serverIp,
                serverPort: this.serverPort,
                config: this.config
            }
        }
    }
}