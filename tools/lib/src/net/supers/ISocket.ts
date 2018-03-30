namespace lib {

    export interface ISocket {

        /**
         * 表示这个链接是不是客户端
         */
        readonly isClient: boolean;

        readonly isConnect: boolean;

        send(bytes: ByteArray): void;

        addRemote(remote: IRemote): void;

        awaitClose(): Promise<number>;

        close(): void;

        onReceive(message: any): void;

        add(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;

        addOnce(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;

        remove(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;

        addZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;

        removeZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;

        addZeroOnce(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
    }
}