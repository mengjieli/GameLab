namespace lib {

    export class CallResult {

        private _errorCode: number;
        private _result: any;

        constructor(errorCode: number = 0, result: any = null) {
            this._errorCode = errorCode;
            this._result = result;
        }

        /**
         * ErrorCode 参见 lib.Error 或自定义的 error 类型说明
         * @returns {number}
         */
        get errorCode(): number {
            return this._errorCode;
        }

        /**
         * 调用返回结果
         * @returns {any}
         */
        get result(): any {
            return this._result;
        }
    }
}