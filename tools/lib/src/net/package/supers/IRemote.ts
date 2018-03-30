namespace lib {
    export interface IRemote {

        remoteId: string;

        onReceive(head: ResponseHead, msg: ByteArray): void;

        onBack(head: ZeroResponse): void;
    }
}