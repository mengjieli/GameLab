namespace lib {
    export class Help {

        /**
         *
         * 获取一个新的 uuid
         * @returns {string}
         */
        public static getuuid(): string {
            return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        /**
         * 程序等待
         * @param {number} time 等待时间，单位 毫秒
         * @returns {Promise<void>}
         */
        public static async sleep(time: number): Promise<void> {
            return new Promise<void>(function (resolve) {
                setTimeout(resolve, time);
            });
        }
    }
}