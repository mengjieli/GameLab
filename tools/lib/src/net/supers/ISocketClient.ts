namespace lib {

    export interface ISocketClient extends ISocket {

        connect(ip: string, port: number): void;

        awaitConnect(ip?: string, port?: number): Promise<number>;
    }
}