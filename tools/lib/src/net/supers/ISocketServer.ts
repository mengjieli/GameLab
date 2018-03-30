namespace lib {

    export interface ISocketServer {

        clientClass: any;

        start(port: number): void;
    }
}