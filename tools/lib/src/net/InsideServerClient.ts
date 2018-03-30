namespace lib {

    export class InsideServerClient extends WebSocketServerClient {

        private interfaceComponent: CommandComponent;

        private server: ServerVO;

        $uuid: string = "";

        constructor(connection: any) {
            super(connection);

            // console.log("新的内部服务器!", ServerVO.INIT_CLASS);
            //注册网络服务器信息
            this.server = new ServerVO.INIT_SERVER_CLASS(this);
            this.server.$isConnect = true;
            StaticProxy.serverProxy.addServer(this.server);

            //初始化 Command 相关的内容
            this.interfaceComponent = new CommandComponent(this);

            //初始化网络相关内容
            this.initNet();
        }

        public get uuid(): string {
            return this.$uuid;
        }

        /**
         * 初始化网络相关内容
         * @returns {Promise<void>}
         */
        private async initNet(): Promise<void> {

            //等待网络关闭时处理
            await this.awaitClose();

            //修改连接信息
            this.server.$isConnect = false;

            // console.log("去掉依赖啊!!!!!");

            //去掉此网络提供的依赖
            StaticProxy.dependProxy.removeServer(this.server.uuid);

            //去掉 Server 信息
            StaticProxy.serverProxy.removeServer(this.server);
        }
    }
}