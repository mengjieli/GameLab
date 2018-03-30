namespace lib {

    export class InsideServer {

        private socket: ISocketServer;

        private config: ServerConfig;

        constructor(config: ServerConfig) {

            this.config = config;

            if (config.isRoute) {
                this.socket = new RouteStation();
            } else if (config.route) {
                this.socket = new RouteServer();
            } else {
                this.socket = new WebSocketServer();
            }
            this.socket.clientClass = InsideServerClient;
            this.socket.start(this.config.serverPort);
        }
    }
}