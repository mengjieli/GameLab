namespace lib {

    export class InitServerInterface {

        private static initConfig: any[] = [
            {
                "name": "awaitReady",
                "return": {
                    "type": "boolean"
                },
                "command": "AwaitReadyCommand"
            }
        ];

        /**
         * 初始化接口配置
         * @param {ServerConfig} config
         */
        public static addInitInterface(config: ServerConfig) {
            let list = config.interfaces;
            var configs = InitServerInterface.initConfig;
            for (let i = 0; i < configs.length; i++) {
                list.push(new InterfaceConfig(configs[i]));
            }
        }

        /**
         * 初始化接口 Command
         * @param {CommandComponent} component
         */
        public static $addInitCommand() {
            var configs = InitServerInterface.initConfig;
            for (let i = 0; i < configs.length; i++) {
                var commandName = configs[i].command;
                StaticProxy.commandProxy.$createInsideCallCommandVO(commandName);
            }
        }
    }
}