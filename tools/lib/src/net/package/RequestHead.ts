namespace lib {

    export class RequestHead implements IHead {

        /**
         * 包头版本，如果是基数，则为客户端发送给服务端的包，否则为服务端返回的包
         * @type {number}
         */
        public static VERSION: number = 1;

        /**
         * 包头版本号
         */
        public headVersion: number;
        /**
         * 协议版本号
         */
        public version: number = 1;
        /**
         * 协议号
         */
        protected _cmd: number;
        /**
         * 请求 uuid
         */
        $uuid: string;

        constructor(cmd: number = 0, uuid: string = "") {
            this.headVersion = RequestHead.VERSION;
            this._cmd = cmd;
            this.$uuid = uuid;
        }

        public decode(bytes: ByteArray): void {
            this.version = bytes.readUInt();
            this._cmd = bytes.readUInt();
            this.$uuid = bytes.readUTF();
        }

        public encode(bytes: ByteArray): void {
            bytes.writeUInt(this.headVersion);
            bytes.writeUInt(this.version);
            bytes.writeUInt(this._cmd);
            bytes.writeUTF(this.$uuid);
        }

        /**
         * 读取另外一个 head 的内容
         * @param {ResponseHead} head
         */
        public readFrom(head: RequestHead): void {
            this.headVersion = head.headVersion;
            this.version = head.version;
            this._cmd = head.cmd;
            this.$uuid = head.$uuid;
        }

        /**
         * 协议号
         * @returns {number}
         */
        public get cmd(): number {
            return this._cmd;
        }

        /**
         * 远程调用 id
         * @returns {string}
         */
        public get remoteId(): string {
            return this.$uuid;
        }

        /**
         * 表示此包头是否为请求
         * @returns {boolean}
         */
        public get isRequest():boolean {
            return true;
        }

        public get value() {
            return {
                "headVersion": this.headVersion,
                "version": this.version,
                "cmd": this.cmd,
                "uuid": this.$uuid
            }
        }
    }
}