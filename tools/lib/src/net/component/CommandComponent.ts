namespace lib {

    interface CommandInterface {
        [index: string]: CommandVO
    }

    /**
     * @private
     */
    export class CommandComponent {

        private socket: ISocket;

        constructor(socket: ISocket) {
            this.socket = socket;

            this.$registerCommand(RegisterInterfaceRequest.CMD,
                StaticProxy.commandProxy.getCommand("RegisterInterfaceCommand"));

            this.$registerCommand(CallRequest.CMD);
        }

        private _cmds: CommandInterface = {};

        /**
         * 注册协议处理对象
         * @param {number} cmd
         * @param commandClazz
         */
        $registerCommand(cmd: number, commandVo: CommandVO = null): void {
            this._cmds[cmd] = commandVo;
            this.socket.add(cmd, this.onRegisterBack, this);
        }

        private onRegisterBack(head: IHead, bytes: ByteArray): void {
            // console.log("command back",head.cmd, head.remoteId);
            if (head.cmd == CallRequest.CMD) {
                let message: CallRequest = new CallRequest();
                message.head = head as RequestHead;
                message.decode(bytes);
                var inf = StaticProxy.serverConfig.getInterface(message.name);
                let commandVO = StaticProxy.commandProxy.getCommand(inf.command);
                new commandVO.commandClass(this.socket, head, bytes, message);
            } else {
                var info = this._cmds[head.cmd];
                if (info) {
                    let message;
                    if (info.messageClass) {
                        message = new info.messageClass();
                        message.head = head;
                        message.decode(bytes);
                    }
                    new info.commandClass(this.socket, head, bytes, message);
                }
            }
        }
    }
}