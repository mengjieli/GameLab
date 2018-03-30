namespace lib {

    export class RouteConnection {

        private _server: ServerVO;
        private _client: ServerVO;

        constructor(server: ServerVO, client: ServerVO) {
            this._server = server;
            this._client = client;
            RouteConnection.connections.push(this);
        }

        public get server(): ServerVO {
            return this._server;
        }

        public get client(): ServerVO {
            return this._client;
        }

        public dispose() {
            this._server = null;
            this._client = null;
            let list = RouteConnection.connections;
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i] == this) {
                    list.splice(i, 1);
                    break;
                }
            }
        }

        private static connections: RouteConnection[] = [];

        public static getConnection(socket: ISocket): RouteConnection {
            let list = RouteConnection.connections;
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i].server.socket == socket || list[i].client.socket == socket) {
                    return list[i];
                }
            }
            return null;
        }
    }
}