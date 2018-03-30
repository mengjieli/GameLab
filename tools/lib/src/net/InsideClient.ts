namespace lib {

    export class InsideClient implements ISocket {

        private socket: ISocketClient;

        private config: ClientConfig;

        private interfaceComponent: CommandComponent;

        public server: ServerVO;

        constructor(config: ClientConfig) {
            this.config = config;

            if (config.route) {
                // this.socket = new RouteClient(config.route);
            } else {
                this.socket = new WebSocketClient();
            }
            // this.socket.connectSleep = config.connectSleep;

            //添加全局 Server 信息
            this.server = new ServerVO.INIT_CLIENT_CLASS(this);
            StaticProxy.serverProxy.addServer(this.server);

            //初始化 Command 相关的内容
            this.interfaceComponent = new CommandComponent(this);

            //初始化网络相关内容
            this.initNet();
        }

        /**
         * 初始化网络相关内容
         */
        private async initNet(): Promise<void> {
            //连接服务器
            this.socket.connect(this.config.ip, this.config.port);
            //循环检测
            while (true) {
                //等待链接上服务器
                await this.socket.awaitConnect();
                //修改连接信息
                this.server.$isConnect = true;

                //注册接口，提供接口
                var cfg = StaticProxy.serverConfig;
                var msg = new RegisterInterfaceRequest(false, cfg.uuid, cfg.type, StaticProxy.serverConfig.serverIp,
                    StaticProxy.serverConfig.serverPort, cfg.interfacesConfig);
                msg.send(this);

                //等待网络断开
                await this.awaitClose();

                //修改连接信息
                this.server.$isConnect = false;

                //去掉此网络提供的依赖
                if (StaticProxy.serverProxy.getServerBySocket(this)) {
                    StaticProxy.dependProxy.removeServer(StaticProxy.serverProxy.getServerBySocket(this).uuid);
                }
            }
        }

        public get isClient(): boolean {
            return this.socket.isClient;
        }

        public get isConnect(): boolean {
            return this.socket.isConnect;
        }

        public send(bytes: ByteArray): void {
            this.socket.send(bytes);
        }

        public addRemote(remote: IRemote): void {
            this.socket.addRemote(remote);
        }

        public async awaitClose(): Promise<number> {
            return this.socket.awaitClose();
        }

        public close(): void {
            this.socket.close();
        }

        public onReceive(message: any): void {
            this.socket.onReceive(message);
        }

        public add(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void {
            this.socket.add(cmd, back, thisObj);
        }

        public addOnce(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void {
            this.socket.addOnce(cmd, back, thisObj);
        }

        public remove(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void {
            this.socket.remove(cmd, back, thisObj);
        }

        public addZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void {
            this.socket.addZero(cmd, back, thisObj);
        }

        public removeZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void {
            this.socket.removeZero(cmd, back, thisObj);
        }

        public addZeroOnce(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void {
            this.socket.addZeroOnce(cmd, back, thisObj);
        }
    }
}