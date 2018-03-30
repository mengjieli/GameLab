namespace lib {

    export class Error {

        /**
         * 网络关闭
         * @type {number}
         */
        public static $SOCKET_CLOSED = -1;

        /**
         * command 执行出错
         * @type {number}
         */
        public static EXECUTE_ERROR = -2;
    }
}