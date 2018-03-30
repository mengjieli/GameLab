namespace lib {

    export class InterfaceConfig {

        private _version: string = "1.0";
        private _name: string;
        private _command: string;
        private _necessary: boolean;
        private _params: Param[];
        private _retrun: Param;

        constructor(config: any) {

            //开始解析配置
            this._params = [];
            this._retrun = null;
            if (config) {
                //如果是没有版本，则按照 1.0 解析
                var version = this._version = config.version || "1.0";
                if (version == "1.0") {
                    this._name = config.name;
                    this._command = config.command || "";
                    this._necessary = config.necessary != null ? config.necessary : true;
                    var params = config.params;
                    if (params) {
                        for (let i = 0; i < params.length; i++) {
                            this._params.push(new Param(params[i]));
                        }
                    }
                    if (config.return) {
                        this._retrun = new Param(config.return);
                    } else {
                        this._retrun = new Param();
                    }
                }
            }
        }

        public get config(): any {
            var params = [];
            for (let i = 0; i < this._params.length; i++) {
                params.push(this._params[i].config);
            }
            return {
                "name": this._name,
                "version": this._version,
                "params": params,
                "return": this._retrun.config
            };
        }

        /**
         * 表示依赖是否必须
         * @returns {boolean}
         */
        public get necessary(): boolean {
            return this._necessary;
        }

        /**
         * 执行的 command
         * @returns {string}
         */
        public get command(): string {
            return this._command;
        }

        /**
         * 接口名称
         * @returns {string}
         */
        public get name(): string {
            return this._name;
        }
    }
}