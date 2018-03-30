namespace lib {

    export class ServerConfig {
        /**
         * 服务器配置版本
         */
        private _version: string;

        /**
         * 服务器唯一标识
         */
        private _uuid: string;

        /**
         * 是否启动内部服务器
         */
        private _hasServer: boolean;

        /**
         * 是否通过路由服务器建立 虚拟 Server
         */
        private _route: RouteConfig;

        /**
         * 这个服务器本身是否为 route 服务器
         */
        private _isRoute: boolean;

        /**
         * 内部服务器的外部 ip 地址
         */
        private _serverIp: string = "";

        /**
         * 启动内部服务器的端口
         */
        private _serverPort: number;

        /**
         * 服务器的类型
         */
        private _type: string;

        /**
         * 接口
         */
        private _interfaces: InterfaceConfig[];

        /**
         * 依赖
         */
        private _depends: InterfaceConfig[];

        /**
         * 启动的客户端配置
         */
        private _clients: ClientConfig[];

        /**
         * 构造函数
         * @param config 服务器的配置文件，json 格式
         */
        constructor(config: any, uuid?: string) {
            this._uuid = uuid || Help.getuuid();
            this._interfaces = [];
            this._depends = [];
            this._clients = [];
            this._isRoute = false;
            var version = this._version = config.version || "1.0";
            if (config) {
                if (version == "1.0") {
                    this._type = config.type || "";
                    //读取启动服务器信息
                    if (config.server && config.server.port) {
                        this._hasServer = true;
                        this._serverIp = config.server.ip;
                        this._serverPort = config.server.port;
                    }
                    //读取服务器本身是否为 route
                    if (config.isRoute) {
                        this._isRoute = config.isRoute;
                    }
                    //读取客户端信息
                    if (config.clients) {
                        for (let i = 0; i < config.clients.length; i++) {
                            this._clients.push(new ClientConfig(config.clients[i]));
                        }
                    }
                    //读取接口信息
                    if (config.interfaces) {
                        for (let i = 0; i < config.interfaces.length; i++) {
                            this._interfaces.push(new InterfaceConfig(config.interfaces[i]));
                        }
                    }
                    //读取依赖信息
                    if (config.depends) {
                        for (let i = 0; i < config.depends.length; i++) {
                            this._depends.push(new InterfaceConfig(config.depends[i]));
                        }
                    }
                }
            }

            //添加初始化构接口配置
            InitServerInterface.addInitInterface(this);
        }

        /**
         * 获取服务器接口
         * @param {string} name
         * @returns {Interface}
         */
        public getInterface(name: string): InterfaceConfig {
            var list = this._interfaces;
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i].name == name) {
                    return list[i];
                }
            }
            return null;
        }

        /**
         * 获取接口配置列表数组
         * @returns {any}
         */
        public get interfaces(): InterfaceConfig[] {
            return this._interfaces;
        }

        /**
         * 获取接口配置列表数组
         * @returns {any}
         */
        public get interfacesConfig(): any[] {
            var res: InterfaceConfig[] = [];
            var list = this._interfaces;
            for (let i = 0, len = list.length; i < len; i++) {
                res.push(list[i].config);
            }
            return res;
        }

        /**
         * 获取依赖接口数组
         * @returns {Interface[]}
         */
        public get depends(): InterfaceConfig[] {
            return this._depends;
        }

        /**
         * 获取服务器的唯一标识
         * @returns {string}
         */
        public get uuid(): string {
            return this._uuid;
        }

        /**
         * 获取服务器的类型
         * @returns {string}
         */
        public get type(): string {
            return this._type;
        }

        public get version(): string {
            return this._version;
        }

        /**
         * 是否启动内部服务器
         * @returns {boolean}
         */
        public get hasServer(): boolean {
            return this._hasServer;
        }

        /**
         * 是否通过路由服务器建立 虚拟 Server
         * @returns {lib.RouteConfig}
         */
        public get route(): RouteConfig {
            return this._route;
        }

        /**
         * 表示服务器本身是否为 route 服务器
         * @returns {boolean}
         */
        public get isRoute(): boolean {
            return this._isRoute;
        }

        /**
         * 内部服务器的外部 ip 地址
         * @returns {string}
         */
        public get serverIp(): string {
            return this._serverIp;
        }

        /**
         * 内部服务器端口
         * @returns {number}
         */
        public get serverPort(): number {
            return this._serverPort;
        }

        public get clients(): ClientConfig[] {
            return this._clients;
        }
    }
}