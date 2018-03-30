namespace lib {

    export class DependVO {

        private _config: InterfaceConfig;
        private _server: ServerVO;

        constructor(config: InterfaceConfig, server: ServerVO) {
            this._config = config;
            this._server = server;
        }

        /**
         * 获取依赖配置
         * @returns {InterfaceConfig}
         */
        public get config(): InterfaceConfig {
            return this._config;
        }

        /**
         * 获取接口相关的服务器信息
         * @returns {ServerVO}
         */
        public get server(): ServerVO {
            return this._server;
        }

        /**
         * 调用远程接口
         * @param {any[]} params
         * @returns {Promise<lib.CallResult>}
         */
        async $call(params: any[], remoteId: string = ""): Promise<CallResult> {
            var client: InsideClient = this.server.socket as InsideClient;
            var msg = new CallRequest(this._config.name, params);
            if (remoteId != "") {
                msg.head.$uuid = remoteId;
            }
            // console.log(this.config.name,remoteId,params);
            var result = await msg.send(this._server.socket);
            return new CallResult(result.errorCode, msg.response ? msg.response.data : null);
        }

        $call2(params: any[]): void {
            var client: InsideClient = this.server.socket as InsideClient;
            var msg = new CallRequest(this._config.name, params);
            msg.send(this._server.socket);
        }
    }
}