namespace lib {

    export class StaticProxy {

        /**
         * 本服务器相关的配置
         */
        public static serverConfig: ServerConfig;

        /**
         * 链接的服务器信息
         * @type {any[]}
         */
        public static serverProxy: ServerProxy;

        /**
         * 依赖信息
         * @type {DependProxy}
         */
        public static dependProxy: DependProxy;

        /**
         * command 管理对象
         * @type {CommandProxy}
         */
        public static commandProxy: CommandProxy;

        /**
         * 状态
         * @type {StateProxy}
         */
        public static stateProxy: StateProxy;


        static $init() {
            StaticProxy.serverProxy = new ServerProxy();
            StaticProxy.dependProxy = new DependProxy();
            StaticProxy.commandProxy = new CommandProxy();
            StaticProxy.stateProxy = new StateProxy();
        }
    }
}