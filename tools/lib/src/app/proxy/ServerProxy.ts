namespace lib {

    interface AwaitAddServerType {
        "type": string,
        "resolve": Function
    }

    export class ServerProxy {

        private servers: ServerVO[] = [];

        /**
         * 添加服务器信息
         * @param {ServerVO} server
         */
        public addServer(server: ServerVO): ServerVO {
            this.servers.push(server);
            return server;
        }

        /**
         * 移除服务器信息
         * @param {ServerVO} server
         */
        public removeServer(server: ServerVO): ServerVO {
            for (let i = 0, len = this.servers.length; i < len; i++) {
                if (this.servers[i] == server) {
                    this.servers.splice(i, 1);
                    break;
                }
            }
            server.$dispose = true;
            server.dispose();
            return server;
        }

        /**
         * 根据 socket 链接查询服务器信息
         * @param {ISocket} socket
         * @returns {ServerVO}
         */
        public getServerBySocket(socket: ISocket): ServerVO {
            for (let i = 0, len = this.servers.length; i < len; i++) {
                if (this.servers[i].socket == socket) {
                    return this.servers[i];
                }
            }
            return null;
        }

        /**
         * 根据 uuid 查询服务器信息
         * @param {string} uuid
         * @returns {any}
         */
        public getServerByUUID(uuid: string) {
            for (let i = 0, len = this.servers.length; i < len; i++) {
                if (this.servers[i].uuid == uuid) {
                    return this.servers[i];
                }
            }
            return null;
        }

        public getServerAt(index: number): ServerVO {
            return this.servers[index];
        }

        private _awaitAddServers: AwaitAddServerType[] = [];

        public onAwaitAddServer(serverType: string): Promise<ServerVO> {
            var __ = this;
            return new Promise<ServerVO>(function (resolve) {
                __._awaitAddServers.push({
                    type: serverType,
                    resolve: resolve
                });
            });
        }
    }
}