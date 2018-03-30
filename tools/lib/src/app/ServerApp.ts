namespace lib {

    export class ServerApp {

        private config: ServerConfig;

        /**
         * 构造函数
         * @param config 服务器配置文件
         * @param {boolean} startServer 是否启动内部服务器
         */
        constructor(nps: any = null, config: any = null) {
            //初始化数据代理
            StaticProxy.$init();

            //读取配置
            if (config) {
                this.config = new ServerConfig(config);
            } else {
                var file = new File("./server.json");
                if (file.existence) {
                    this.config = new ServerConfig(JSON.parse(file.getContent()));
                }
            }

            //存储配置
            StaticProxy.serverConfig = this.config;

            //初始化服务器自带的 Command
            InitServerInterface.$addInitCommand();

            //注册远程调用
            if (nps) {
                var infs = this.config.interfaces;
                for (let i = 0, len = infs.length; i < len; i++) {
                    if (infs[i].command && infs[i].command != "" && nps[infs[i].command]) {
                        StaticProxy.commandProxy.addCommand(new CommandVO(infs[i].command, nps[infs[i].command], CallRequest));
                    }
                }
            }

            setTimeout(this.start.bind(this), 0);
        }

        /**
         * 启动
         */
        private start(): void {
            //如果有内部服务器则启动
            if (this.config.hasServer) {
                var server = new InsideServer(this.config);
            }
            //如果有客户端，则自动启动客户端
            if (this.config.clients.length) {
                for (let i = 0; i < this.config.clients.length; i++) {
                    let cfg = this.config.clients[i];
                    let client = new InsideClient(cfg);
                }
            }

            this.awaitReady();
        }

        private async awaitReady() {
            try {
                StaticProxy.stateProxy.$checkReady();
                await StaticProxy.stateProxy.awaitReady();

                //服务器 ready
                this.getReady();
            } catch (e) {
                console.log(e);
            }
        }

        protected getReady() {

        }
    }
}