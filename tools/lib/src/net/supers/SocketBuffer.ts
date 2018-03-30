namespace lib {

    /**
     * 消息缓存，没发送出去的消息缓存起来，避免二次调用
     * @private
     */
    export class SocketBuffer {

        private static buffers: any = [];

        public static addMessage(remoteId: string, bytes: ByteArray): void {
            if (!SocketBuffer.buffers[remoteId]) {
                SocketBuffer.buffers[remoteId] = [];
            }
            SocketBuffer.buffers[remoteId].push(bytes);
        }

        public static getMessage(remoteId: string): ByteArray[] {
            return SocketBuffer.buffers[remoteId];
        }

        public static removeMessage(remoteId: string): void {
            delete SocketBuffer.buffers[remoteId];
        }
    }
}