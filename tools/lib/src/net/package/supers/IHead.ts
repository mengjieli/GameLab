namespace lib {

    export interface IHead {

        /**
         * 消息头版本
         */
        headVersion: number;

        /**
         * 协议版本
         */
        version: number;

        /**
         * 协议号
         */
        cmd: number;

        /**
         * 远程调用 id
         */
        remoteId: string;

        readFrom(head: IHead): void;

        /**
         * 读取内容 object
         */
        readonly value: any;

        /**
         * 表示此包头是否为请求
         * @returns {boolean}
         */
        readonly isRequest:boolean;
    }
}