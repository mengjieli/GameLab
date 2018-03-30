namespace lib {

    export class ClientConfig {

        private _version: string;
        private _config: any;
        private _type: string;
        private _route: RouteConfig;
        private _ip: string;
        private _port: number;
        private _connectSleep: number = 100;

        constructor(config: any) {
            this._config = config;
            if (config) {
                var version = this._version = config.version || "1.0";
                if (version == "1.0") {
                    this._type = config.type;
                    this._ip = config.ip;
                    this._port = config.port;
                    this._connectSleep = config.connectSleep;
                    if (config.route) {
                        this._route = new RouteConfig(config.route.ip, config.route.port);
                    }
                }
            } else {
                this._version = "1.0";
            }
        }

        /**
         * 配置版本
         * @returns {string}
         */
        public get version(): string {
            return this._version;
        }

        /**
         * 获取服务端类型
         * @returns {string}
         */
        public get type(): string {
            return this._type;
        }

        /**
         * 获取路由服务器信息信息，如果有路由服务器，则与其他 Server 相连不会直接连接，而是通过路由相连
         * @returns {string}
         */
        public get route(): RouteConfig {
            return this._route;
        }

        /**
         * 获取 ip
         * @returns {string}
         */
        public get ip(): string {
            return this._ip;
        }

        /**
         * 获取端口
         * @returns {number}
         */
        public get port(): number {
            return this._port;
        }

        /**
         * 如果与服务器断开链接，等待多久重试链接
         * @returns {number}
         */
        public get connectSleep(): number {
            return this._connectSleep;
        }
    }
}