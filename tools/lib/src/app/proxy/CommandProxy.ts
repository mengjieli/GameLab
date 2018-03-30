namespace lib {

    export class CommandProxy {

        $commands: CommandVO[] = [
            new CommandVO("RegisterInterfaceCommand", RegisterInterfaceCommand, RegisterInterfaceRequest)
        ];

        /**
         * 根据 Command 类，创建一个通用的 CommandVO
         * @param {string} commandName
         * @returns {any}
         */
        public $createInsideCallCommandVO(commandName: string): CommandVO {
            var pkg: any = lib;
            if (pkg[commandName]) {
                var vo = new CommandVO(commandName, pkg[commandName]);
                this.addCommand(vo);
                return vo;
            }
            return null;
        }


        /**
         * 注册 command 信息
         * @param {string} name
         * @param commandClass
         * @param messageClass
         */
        public addCommand(command: CommandVO): void {
            this.$commands.push(command);
        }

        /**
         * 获取 command 信息
         * @param {string} name
         * @returns {any}
         */
        public getCommand(name: string): CommandVO {
            var cmds = this.$commands;
            for (let i = 0, len = cmds.length; i < len; i++) {
                if (cmds[i].name == name) {
                    return cmds[i];
                }
            }
            return null;
        }
    }
}