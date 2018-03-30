namespace lib {

    export interface IMessage {

        head: IHead;

        readonly value: any;

        setHead(head: IHead): void;

        send(net: ISocket): any;

        encode(bytes: ByteArray): void;

        decode(bytes: ByteArray): void;
    }
}