namespace lib {

    var webSocket = require('websocket').server;
    var http = require('http');

    export class WebSocketServer implements ISocketServer {

        private _clientClass: any;
        private server: any;

        constructor(clientClazz: any = WebSocketServerClient) {
            this._clientClass = WebSocketServerClient;
        }

        public set clientClass(clientClass: any) {
            this._clientClass = clientClass;
        }

        public get clientClass(): any {
            return this._clientClass;
        }

        /**
         * 启动服务器
         * @param {number} port 服务器端口号
         */
        public start(port: number): void {
            var server = http.createServer(function (request: any, response: any) {
            });
            server.listen(port, function () {
                //console.log("Server on " + port);
            });
            this.server = new webSocket({
                // WebSocket server is tied to a HTTP server. WebSocket request is just
                // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
                httpServer: server
            });
            this.server.on('request', this.onConnectClient.bind(this));
        }

        protected onConnectClient(request: any): void {
            var connection = request.accept(null, request.origin);
            var client = new this._clientClass(connection);
            return client;
        }
    }
}