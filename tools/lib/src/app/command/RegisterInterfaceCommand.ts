namespace lib {

    export class RegisterInterfaceCommand extends CommandBase {

        execute(): void {
            var message = this.message as RegisterInterfaceRequest;
            var list = message.config;

            //如果重复注册，则返回
            if (StaticProxy.dependProxy.$hasServerDepend(message.uuid)) {
                this.success();
                return;
            }

            /**
             * 写入服务器完整信息
             * @type {ServerVO}
             */
            var serverVO = StaticProxy.serverProxy.getServerBySocket(this.socket);
            serverVO.uuid = message.uuid;
            serverVO.type = message.type;
            serverVO.serverIp = message.serverIp;
            serverVO.serverPort = message.serverPort;

            //添加服务器的提供的依赖
            for (let i = 0; i < list.length; i++) {
                StaticProxy.dependProxy.add(new DependVO(new InterfaceConfig(list[i]), serverVO));
            }

            //反向注册接口信息
            if (!message.reverseRegister) {
                var cfg = StaticProxy.serverConfig;
                var msg = new RegisterInterfaceRequest(true, cfg.uuid, cfg.type, StaticProxy.serverConfig.serverIp,
                    StaticProxy.serverConfig.serverPort, cfg.interfacesConfig);
                msg.send(this.socket);
            }

            this.success();
        }
    }
}