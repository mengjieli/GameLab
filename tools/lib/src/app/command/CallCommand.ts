namespace lib {

    /**
     * 远程接口处理类
     */
    export abstract class CallCommand extends CommandBase {

        /**
         * 返回回调结果
         * @param data
         */
        protected responseResult(data?: any) {
            var response = new CallResponse(this.head.remoteId, this.currentTime - this.startTime, data);
            response.send(this.socket);
        }
    }
}