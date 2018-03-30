namespace lib {

    export class RouteClient extends SocketBase implements ISocketClient {

        private socket: WebSocketClient;

        constructor(route: RouteConfig) {
            super();
        }


        public get isClient(): boolean {
            return true;
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