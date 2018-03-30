namespace lib {

    export class AwaitVO {

        constructor() {

        }

        private _isReady: boolean = false;

        public get isReady(): boolean {
            return this._isReady;
        }

        public set isReady(val: boolean) {
            this._isReady = val;
            if (this._isReady) {
                let funcs = this._awaitReadyFunctions;
                this._awaitReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            } else {
                let funcs = this._awaitNotReadyFunctions;
                this._awaitNotReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
        }

        _awaitReadyFunctions: Function[] = [];
        _awaitNotReadyFunctions: Function[] = [];

        /**
         * 等待所有接口完成，或等待接口未完成
         * @param {boolean} flag
         * @returns {Promise<any>}
         */
        public async awaitReady(flag: boolean = true) {
            if (flag && this.isReady || !flag && !this.isReady) {
                return;
            } else {
                var __ = this;
                return new Promise(function (resolve: Function) {
                    if (flag) {
                        __._awaitReadyFunctions.push(resolve);
                    } else {
                        __._awaitNotReadyFunctions.push(resolve);
                    }
                });
            }
        }
    }
}