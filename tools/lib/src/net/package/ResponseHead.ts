namespace lib {

    export class ResponseHead implements IHead {

        public static VERSION = 2;

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
         * 远程调用 id
         */
        protected $uuid: string;
        /**
         * 程序处理时间
         */
        private _processTime: number;

        constructor(cmd: number = 0, uuid: string = "", processTime: number = 0) {
            this.headVersion = ResponseHead.VERSION;
            this._cmd = cmd;
            this.$uuid = uuid;
            this._processTime = processTime;
        }

        public decode(bytes: ByteArray): void {
            this.version = bytes.readUInt();
            this._cmd = bytes.readUInt();
            this.$uuid = bytes.readUTF();
            this._processTime = bytes.readUInt();
        }

        public encode(bytes: ByteArray): void {
            bytes.writeUInt(this.headVersion);
            bytes.writeUInt(this.version);
            bytes.writeUInt(this._cmd);
            bytes.writeUTF(this.$uuid);
            bytes.writeUInt(this._processTime);
        }

        /**
         * 读取另外一个 head 的内容
         * @param {ResponseHead} head
         */
        public readFrom(head: ResponseHead): void {
            this.headVersion = head.headVersion;
            this.version = head.version;
            this._cmd = head.cmd;
            this.$uuid = head.remoteId;
            this._processTime = head.processTime;
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
         * 程序处理耗时，毫秒
         * @returns {number}
         */
        public get processTime(): number {
            return this._processTime;
        }

        /**
         * 表示此包头是否为请求
         * @returns {boolean}
         */
        public get isRequest():boolean {
            return false;
        }

        public get value() {
            return {
                "headVersion": this.headVersion,
                "version": this.version,
                "cmd": this.cmd,
                "remoteId": this.remoteId,
                "processTime": this.processTime
            }
        }
    }
}