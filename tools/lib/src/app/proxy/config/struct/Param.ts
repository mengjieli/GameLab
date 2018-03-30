namespace lib {
    export class Param {

        /**
         * 配置文件版本
         */
        private _version: string;

        /**
         * 类型
         */
        private _type: string;

        /**
         * 构造函数
         * @param config 配置文件
         */
        constructor(config: any = null) {
            if (config) {
                var version = this._version = config.version || "1.0";
                if (version == "1.0") {
                    this._type = ParamType.getType(config.type);
                }
            } else {
                this._version = "1.0";
                this._type = "void";
            }
        }

        public get version(): string {
            return this._version;
        }

        /**
         * 参数类型
         * @returns {string}
         */
        public get type(): string {
            return this._type;
        }

        public get config(): any {
            return {
                "version": this._version,
                "type": this._type
            }
        }
    }
}