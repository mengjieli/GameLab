namespace lib {

    /**
     * 等待依赖信息判断条件
     * 里面的内容都是可选项
     * 如果判断条件都相等，则表示此依赖已经准备好了，会自动调用 dependProxy.call
     */
    export class CallAwaitConditionVO {

        constructor(uuid: string = "", serverType: string = "", judge: (condition: CallAwaitConditionVO, depend: DependVO) => boolean = null, await: boolean = true) {
            this.uuid = uuid;
            this.serverType = serverType;
            this.judge = judge;
            this.$await = await;
        }

        /**
         * 服务器的 uuid
         * @type {null}
         */
        public uuid: string = "";

        /**
         * 服务器类型
         * @type {string}
         */
        public serverType: string = "";

        /**
         * 特定的判断函数
         */
        public judge: (condition: CallAwaitConditionVO, depend: DependVO) => boolean;

        /**
         * 表示此次接口调用在网络关闭时是否继续等待
         */
        $await: boolean = true;

        /**
         * 表示此次接口调用在网络关闭时是否继续等待
         * @returns {boolean}
         */
        public get await(): boolean {
            return this.$await;
        }

        /**
         * 判断条件是否满足
         * @param {lib.DependVO} depend
         * @returns {boolean}
         */
        public equal(depend: DependVO): boolean {
            return !!(
                (this.uuid == "" || this.uuid == depend.server.uuid) &&
                (this.serverType == "" || this.serverType == depend.server.type) &&
                (!this.judge || this.judge(this, depend))
            );
        }

        private _remoteId: string;

        get $remoteId(): string {
            if (!this._remoteId) {
                this._remoteId = Help.getuuid();
            }
            return this._remoteId;
        }

    }
}