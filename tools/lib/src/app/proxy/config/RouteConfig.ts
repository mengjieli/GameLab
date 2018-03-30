namespace lib {

    export class RouteConfig {

        private _ip: string;
        private _port: number;

        constructor(ip: string, port: number) {
            this._ip = ip;
            this._port = port;
        }

        get ip(): string {
            return this._ip;
        }

        get port(): number {
            return this._port;
        }

    }

}