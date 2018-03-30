namespace lib {

    export class RouteStation implements ISocketServer {

        private socket: WebSocketServer;

        public _clientClass: any;

        constructor() {
            this._clientClass = RouteServerClient;
        }

        public get clientClass(): any {
            return this._clientClass;
        }

        public set clientClass(val: any) {
            this._clientClass = val;
        }

        public start(port: number): void {
            this.socket = new WebSocketServer(this._clientClass);
            this.socket.start(port);
        }
    }

}