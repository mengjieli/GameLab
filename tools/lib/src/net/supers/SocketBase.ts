namespace lib {

    export class SocketBase implements ISocket {

        public static id: number = 1;

        private remotes: any = {};
        private backs: any = {};
        private zbacks: any = {};

        public isClient: boolean = false;

        /**
         * 添加远程回调
         * @param {IRemote} remote 远程回调对象
         */
        public addRemote(remote: IRemote): void {
            this.remotes[remote.remoteId] = remote;
            // console.log("添加 remote?", remote.remoteId);
        }

        public onReceive(message: any): void {
        }

        public add(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void {
            if (this.backs[cmd] == null) {
                this.backs[cmd] = [];
            }
            this.backs[cmd].push({func: back, thisObj: thisObj, id: SocketBase.id++});
        }

        public addOnce(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void {
            if (this.backs[cmd] == null) {
                this.backs[cmd] = [];
            }
            this.backs[cmd].push({func: back, thisObj: thisObj, once: true, id: SocketBase.id++});
        }

        public remove(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void {
            var list = this.backs[cmd];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].func == back && list[i].thisObj == thisObj) {
                        list.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        public addZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void {
            if (this.zbacks[cmd] == null) {
                this.zbacks[cmd] = [];
            }
            this.zbacks[cmd].push({func: back, thisObj: thisObj, id: SocketBase.id++});
        }

        public removeZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void {
            var list = this.zbacks[cmd];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].func == back && list[i].thisObj == thisObj) {
                        list.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        public addZeroOnce(cmd: number, back: (head: ZeroResponse) => void, thisObj: any) {
            if (this.zbacks[cmd] == null) {
                this.zbacks[cmd] = [];
            }
            this.zbacks[cmd].push({func: back, thisObj: thisObj, once: true, id: SocketBase.id++});
        }

        /**
         * 分发消息
         * @param {ByteArray} bytes
         */
        protected dispatchMessage(bytes: ByteArray): void {
            var pos;
            var head: IHead = SocketBase.readHead(bytes);
            // console.log("[receive]", head.headVersion, head.cmd, head.remoteId, bytes.length);
            var buffers = SocketBuffer.getMessage(head.remoteId);
            if (head.isRequest && buffers) { //如果请求相同，则直接返回无需通过上层
                // console.log("同样的请求", head.remoteId);
                for (let i = 0; i < buffers.length; i++) {
                    var bhead = SocketBase.readHead(buffers[i]);
                    // console.log("同样的请求返回", bhead.cmd, bhead.remoteId, bytes.length);
                    this.send(buffers[i]);
                }
                SocketBuffer.removeMessage(head.remoteId);
                return;
            }
            var cmd = head.cmd;
            var removeList;
            var a;
            var i;
            var f;
            var backList;
            var remoteId = head.remoteId;
            if (remoteId != "" && this.remotes[remoteId]) {
                var remote: IRemote = this.remotes[remoteId];
                // console.log("[receive] [remote] ", head.remoteId, remote ? true : false);
                if (cmd == 0) {
                    let zp = new ZeroResponse();
                    zp.head = head as ResponseHead;
                    zp.decode(bytes);
                    remote.onBack(zp);
                    delete this.remotes[remoteId];
                } else {
                    remote.onReceive(head as ResponseHead, bytes);
                }
            } else if (cmd == 0) {
                let zp = new ZeroResponse();
                zp.head = head as ResponseHead;
                zp.decode(bytes);
                var backCmd = zp.requestCmd;
                var zbackList = this.zbacks[backCmd];
                // console.log("[receive] [zero] ", head.remoteId, zbackList ? true : false);
                if (zbackList) {
                    removeList = [];
                    a = zbackList.concat();
                    for (i = 0; i < a.length; i++) {
                        a[i].func.call(a[i].thisObj, zp);
                        if (a[i].once) {
                            removeList.push(a[i].id);
                        }
                    }
                    for (i = 0; i < removeList.length; i++) {
                        for (f = 0; f < this.zbacks[backCmd].length; f++) {
                            if (this.zbacks[backCmd][f].id == removeList[i]) {
                                this.zbacks[backCmd].splice(f, 1);
                                break;
                            }
                        }
                    }
                }
                backList = this.backs[cmd];
                if (backList) {
                    removeList = [];
                    a = backList.concat();
                    for (i = 0; i < a.length; i++) {
                        bytes.position = pos;
                        a[i].func.call(a[i].thisObj, head, bytes);
                        if (a[i].once) {
                            removeList.push(a[i].id);
                        }
                    }
                    for (i = 0; i < removeList.length; i++) {
                        for (f = 0; f < this.backs[cmd].length; f++) {
                            if (this.backs[cmd][f].id == removeList[i]) {
                                this.backs[cmd].splice(f, 1);
                                break;
                            }
                        }
                    }
                }
            } else {
                pos = bytes.position;
                backList = this.backs[cmd];
                // console.log("[receive] [other] ", head.remoteId, backList ? true : false);
                if (backList) {
                    removeList = [];
                    a = backList.concat();
                    for (i = 0; i < a.length; i++) {
                        bytes.position = pos;
                        a[i].func.call(a[i].thisObj, head, bytes);
                        if (a[i].once) {
                            removeList.push(a[i].id);
                        }
                    }
                    for (i = 0; i < removeList.length; i++) {
                        for (f = 0; f < this.backs[cmd].length; f++) {
                            if (this.backs[cmd][f].id == removeList[i]) {
                                this.backs[cmd].splice(f, 1);
                                break;
                            }
                        }
                    }
                }
            }
            // console.log("[receive end]",head.remoteId);
        }

        public send(bytes: ByteArray): void {
        }

        private awaitCloseFunctions: Function[] = [];

        /**
         * 等待断开链接
         * @returns {Promise<number>}
         */
        public awaitClose(): Promise<number> {
            var __ = this;
            return new Promise<number>(function (resolve: Function) {
                __.awaitCloseFunctions.push(resolve);
            });
        }

        protected onAwaitClose(code: number): void {
            // console.log("删除所有 remote!!!");
            for (var key in this.remotes) {
                // console.log("删除 remote...", key);
                this.remotes[key].onBack(new ZeroResponse("", 0, Error.$SOCKET_CLOSED, 0));
            }
            this.remotes = {};
            if (this.awaitCloseFunctions) {
                var funcs = this.awaitCloseFunctions.concat();
                this.awaitCloseFunctions = [];
                while (funcs.length) {
                    funcs.shift()(code);
                }
            }
        }

        private awaitConnectFunctions: Function[] = [];

        /**
         * 等待服务器链接
         */
        public awaitConnect(): Promise<number> {
            var __ = this;
            return new Promise<number>(function (resolve: Function) {
                __.awaitConnectFunctions.push(resolve);
            });
        }

        protected connectComplete() {
            if (this.awaitConnectFunctions) {
                var funcs = this.awaitConnectFunctions.concat();
                while (funcs.length) {
                    var func = funcs.shift();
                    func();
                }
            }
        }

        public close(): void {

        }

        public get isConnect(): boolean {
            return false;
        }

        /**
         * 获取协议头部信息
         * @param {lib.ByteArray} bytes
         * @returns {lib.IHead}
         */
        public static readHead(bytes: ByteArray): IHead {
            bytes.position = 0;
            let headVersion = bytes.readUInt();
            let head: RequestHead | ResponseHead;
            if (headVersion % 2) {
                head = new RequestHead();
                head.headVersion = headVersion;
                head.decode(bytes);
            } else {
                head = new ResponseHead();
                head.headVersion = headVersion;
                head.decode(bytes);
            }
            return head;
        }
    }
}