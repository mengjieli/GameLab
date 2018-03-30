declare namespace lib {
    class File {
        private _url;
        private _direction;
        private _name;
        private _end;
        constructor(url: string);
        save(content: string | Buffer, url: string): void;
        getContent(format?: string): any;
        getFileListWithEnd(ends: string | string[]): File[];
        getDirectionList(): File[];
        delete(): void;
        readonly url: string;
        readonly name: string;
        readonly end: string;
        readonly existence: boolean;
        readonly state: any;
        readonly isDirection: boolean;
        readonly direction: string;
        static mkdir(dirPath: string, mode?: string): boolean;
    }
}
declare namespace lib {
    class ByteArray {
        private bytes;
        position: number;
        private _length;
        constructor();
        length: number;
        readonly bytesAvailable: number;
        readonly arrayData: number[];
        writeByte(val: number): void;
        writeBoolean(val: boolean): void;
        writeInt(val: number): void;
        writeUInt(val: number): void;
        writeUTF(val: string): void;
        writeUTFBytes(val: string, len: number): void;
        writeByteArray(byteArray: ByteArray, start?: number, len?: number): void;
        writeArray(array: number[]): void;
        readByte(): number;
        readBoolean(): boolean;
        readUInt(): number;
        readInt(): number;
        readUTF(): string;
        readUTFBytes(len: number): string;
        toString(): string;
    }
}
declare namespace lib {
    class UTFChange {
        static bytesToString(arr: number[]): string;
        static stringToBytes(str: string): number[];
    }
}
declare namespace lib {
    class Help {
        static getuuid(): string;
        static sleep(time: number): Promise<void>;
    }
}
declare namespace lib {
    class Error {
        static $SOCKET_CLOSED: number;
        static EXECUTE_ERROR: number;
    }
}
declare namespace lib {
    interface IHead {
        headVersion: number;
        version: number;
        cmd: number;
        remoteId: string;
        readFrom(head: IHead): void;
        readonly value: any;
        readonly isRequest: boolean;
    }
}
declare namespace lib {
    interface IMessage {
        head: IHead;
        readonly value: any;
        setHead(head: IHead): void;
        send(net: ISocket): any;
        encode(bytes: ByteArray): void;
        decode(bytes: ByteArray): void;
    }
}
declare namespace lib {
    interface IRemote {
        remoteId: string;
        onReceive(head: ResponseHead, msg: ByteArray): void;
        onBack(head: ZeroResponse): void;
    }
}
declare namespace lib {
    class RequestHead implements IHead {
        static VERSION: number;
        headVersion: number;
        version: number;
        protected _cmd: number;
        $uuid: string;
        constructor(cmd?: number, uuid?: string);
        decode(bytes: ByteArray): void;
        encode(bytes: ByteArray): void;
        readFrom(head: RequestHead): void;
        readonly cmd: number;
        readonly remoteId: string;
        readonly isRequest: boolean;
        readonly value: {
            "headVersion": number;
            "version": number;
            "cmd": number;
            "uuid": string;
        };
    }
}
declare namespace lib {
    class ResponseHead implements IHead {
        static VERSION: number;
        headVersion: number;
        version: number;
        protected _cmd: number;
        protected $uuid: string;
        private _processTime;
        constructor(cmd?: number, uuid?: string, processTime?: number);
        decode(bytes: ByteArray): void;
        encode(bytes: ByteArray): void;
        readFrom(head: ResponseHead): void;
        readonly cmd: number;
        readonly remoteId: string;
        readonly processTime: number;
        readonly isRequest: boolean;
        readonly value: {
            "headVersion": number;
            "version": number;
            "cmd": number;
            "remoteId": string;
            "processTime": number;
        };
    }
}
declare namespace lib {
    class Request extends ByteArray implements IMessage, IRemote {
        head: RequestHead;
        private resolve;
        constructor(cmd?: number);
        setHead(head: RequestHead): void;
        send(net: ISocket): Promise<ZeroResponse>;
        encode(bytes: ByteArray): void;
        decode(bytes: ByteArray): void;
        onReceive(head: ResponseHead, bytes: ByteArray): void;
        onBack(head: ZeroResponse): void;
        readonly remoteId: string;
        readonly value: any;
    }
}
declare namespace lib {
    class Response extends ByteArray implements IMessage {
        head: ResponseHead;
        constructor(cmd?: number, uuid?: string, processTime?: number);
        setHead(head: ResponseHead): void;
        send(net: ISocket): void;
        encode(bytes: ByteArray): void;
        decode(bytes: ByteArray): void;
        readonly value: any;
    }
}
declare namespace lib {
    class ZeroResponse extends Response {
        errorCode: number;
        requestCmd: number;
        message: string;
        constructor(uuid?: string, processTime?: number, errorCode?: number, requestCmd?: number, message?: string);
        encode(bytes: ByteArray): void;
        decode(bytes: ByteArray): void;
        readonly value: {
            head: {
                "headVersion": number;
                "version": number;
                "cmd": number;
                "remoteId": string;
                "processTime": number;
            };
            errorCode: number;
            requestCmd: number;
            message: string;
        };
    }
}
declare namespace lib {
    interface ISocket {
        readonly isClient: boolean;
        readonly isConnect: boolean;
        send(bytes: ByteArray): void;
        addRemote(remote: IRemote): void;
        awaitClose(): Promise<number>;
        close(): void;
        onReceive(message: any): void;
        add(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        addOnce(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        remove(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        addZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        removeZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        addZeroOnce(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
    }
}
declare namespace lib {
    class SocketBase implements ISocket {
        static id: number;
        private remotes;
        private backs;
        private zbacks;
        isClient: boolean;
        addRemote(remote: IRemote): void;
        onReceive(message: any): void;
        add(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        addOnce(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        remove(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        addZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        removeZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        addZeroOnce(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        protected dispatchMessage(bytes: ByteArray): void;
        send(bytes: ByteArray): void;
        private awaitCloseFunctions;
        awaitClose(): Promise<number>;
        protected onAwaitClose(code: number): void;
        private awaitConnectFunctions;
        awaitConnect(): Promise<number>;
        protected connectComplete(): void;
        close(): void;
        readonly isConnect: boolean;
        static readHead(bytes: ByteArray): IHead;
    }
}
declare namespace lib {
    class SocketBuffer {
        private static buffers;
        static addMessage(remoteId: string, bytes: ByteArray): void;
        static getMessage(remoteId: string): ByteArray[];
        static removeMessage(remoteId: string): void;
    }
}
declare namespace lib {
    interface ISocketClient extends ISocket {
        connect(ip: string, port: number): void;
        awaitConnect(ip?: string, port?: number): Promise<number>;
    }
}
declare namespace lib {
    interface ISocketServer {
        clientClass: any;
        start(port: number): void;
    }
}
declare namespace lib {
    interface ISocketServerClient extends ISocket {
    }
}
declare namespace lib {
    class WebSocketServer implements ISocketServer {
        private _clientClass;
        private server;
        constructor(clientClazz?: any);
        clientClass: any;
        start(port: number): void;
        protected onConnectClient(request: any): void;
    }
}
declare namespace lib {
    class WebSocketServerClient extends SocketBase implements ISocketServerClient {
        private _isConnect;
        private _isClosed;
        protected connection: any;
        protected type: string;
        constructor(connection: any, type?: string);
        readonly isClosed: boolean;
        readonly isConnect: boolean;
        protected onError(e: Error): void;
        onReceive(message: any): void;
        protected onClose(code: number, desc?: string): void;
        send(bytes: ByteArray): void;
        close(): void;
    }
}
declare namespace lib {
    class WebSocketClient extends SocketBase implements ISocketClient {
        private client;
        private connection;
        private _isConnect;
        private _isClosed;
        private _type;
        protected serverIp: string;
        protected serverPort: number;
        autoLinkServer: boolean;
        connectSleep: number;
        constructor(type?: string);
        private _autoLink();
        readonly type: string;
        readonly isConnect: boolean;
        readonly isClosed: boolean;
        connect(ip: string, port: number): void;
        awaitConnect(ip?: string, port?: number): Promise<number>;
        protected onConnect(connection: any): void;
        protected onConnectError(e: Error): void;
        protected onError(e: Error): void;
        protected onClose(code: number, desc?: string): void;
        onReceive(message: any): void;
        send(bytes: ByteArray): void;
        close(): void;
    }
}
declare namespace lib {
    abstract class CommandBase {
        private _socket;
        private _startTime;
        private _head;
        private _bytes;
        private _message;
        constructor(socket: ISocket, head: IHead, bytes: ByteArray, message?: IMessage);
        protected abstract execute(): void;
        protected success(): void;
        protected fail(code: number, message?: string): void;
        protected send(msg: ByteArray): void;
        readonly currentTime: number;
        readonly startTime: number;
        protected readonly socket: ISocket;
        protected readonly head: IHead;
        readonly bytes: ByteArray;
        readonly message: IMessage;
    }
}
declare namespace lib {
    class RegisterInterfaceCommand extends CommandBase {
        execute(): void;
    }
}
declare namespace lib {
    abstract class CallCommand extends CommandBase {
        protected responseResult(data?: any): void;
    }
}
declare namespace lib {
    class AwaitReadyCommand extends CallCommand {
        execute(): Promise<void>;
    }
}
declare namespace lib {
    class CallResult {
        private _errorCode;
        private _result;
        constructor(errorCode?: number, result?: any);
        readonly errorCode: number;
        readonly result: any;
    }
}
declare namespace lib {
    class ServerApp {
        private config;
        constructor(nps?: any, config?: any);
        private start();
        private awaitReady();
        protected getReady(): void;
    }
}
declare namespace lib {
    class RouteApp extends ServerApp {
    }
}
declare namespace lib {
    class Param {
        private _version;
        private _type;
        constructor(config?: any);
        readonly version: string;
        readonly type: string;
        readonly config: any;
    }
}
declare namespace lib {
    class ParamType {
        static INT: string;
        static UINT: string;
        static STRING: string;
        static BOOLEAN: string;
        static VOID: string;
        static NONE: string;
        static UNKONW: string;
        static getType(type: string): string;
    }
}
declare namespace lib {
    class InitServerInterface {
        private static initConfig;
        static addInitInterface(config: ServerConfig): void;
        static $addInitCommand(): void;
    }
}
declare namespace lib {
    class InterfaceConfig {
        private _version;
        private _name;
        private _command;
        private _necessary;
        private _params;
        private _retrun;
        constructor(config: any);
        readonly config: any;
        readonly necessary: boolean;
        readonly command: string;
        readonly name: string;
    }
}
declare namespace lib {
    class ServerConfig {
        private _version;
        private _uuid;
        private _hasServer;
        private _route;
        private _isRoute;
        private _serverIp;
        private _serverPort;
        private _type;
        private _interfaces;
        private _depends;
        private _clients;
        constructor(config: any, uuid?: string);
        getInterface(name: string): InterfaceConfig;
        readonly interfaces: InterfaceConfig[];
        readonly interfacesConfig: any[];
        readonly depends: InterfaceConfig[];
        readonly uuid: string;
        readonly type: string;
        readonly version: string;
        readonly hasServer: boolean;
        readonly route: RouteConfig;
        readonly isRoute: boolean;
        readonly serverIp: string;
        readonly serverPort: number;
        readonly clients: ClientConfig[];
    }
}
declare namespace lib {
    class ClientConfig {
        private _version;
        private _config;
        private _type;
        private _route;
        private _ip;
        private _port;
        private _connectSleep;
        constructor(config: any);
        readonly version: string;
        readonly type: string;
        readonly route: RouteConfig;
        readonly ip: string;
        readonly port: number;
        readonly connectSleep: number;
    }
}
declare namespace lib {
    class RouteConfig {
        private _ip;
        private _port;
        constructor(ip: string, port: number);
        readonly ip: string;
        readonly port: number;
    }
}
declare namespace lib {
    class CommandComponent {
        private socket;
        constructor(socket: ISocket);
        private _cmds;
        $registerCommand(cmd: number, commandVo?: CommandVO): void;
        private onRegisterBack(head, bytes);
    }
}
declare namespace lib {
    class CallRequest extends Request {
        static CMD: number;
        name: string;
        params: any[];
        response: CallResponse;
        constructor(name?: string, params?: any[]);
        decode(bytes: ByteArray): void;
        encode(bytes: ByteArray): void;
        onReceive(head: ResponseHead, bytes: ByteArray): void;
    }
}
declare namespace lib {
    class CallResponse extends Response {
        static CMD: number;
        data: any;
        constructor(uuid?: string, processTime?: number, data?: any);
        encode(bytes: ByteArray): void;
        decode(bytes: ByteArray): void;
        readonly value: {
            head: ResponseHead;
            data: any;
        };
    }
}
declare namespace lib {
    class RegisterInterfaceRequest extends Request {
        static CMD: number;
        reverseRegister: boolean;
        uuid: string;
        type: string;
        serverIp: string;
        serverPort: number;
        config: any;
        constructor(reverseRegister?: boolean, uuid?: string, type?: string, serverIp?: string, serverPort?: number, config?: any);
        encode(bytes: ByteArray): void;
        decode(bytes: ByteArray): void;
        readonly value: {
            head: {
                "headVersion": number;
                "version": number;
                "cmd": number;
                "uuid": string;
            };
            reverseRegister: boolean;
            uuid: string;
            type: string;
            serverIp: string;
            serverPort: number;
            config: any;
        };
    }
}
declare namespace lib {
    class RegisterServerRequest extends Request {
        static CMD: number;
        uuid: string;
        type: string;
        constructor(uuid: string, type: string);
        encode(bytes: ByteArray): void;
        decode(bytes: ByteArray): void;
    }
}
declare namespace lib {
    class AwaitVO {
        constructor();
        private _isReady;
        isReady: boolean;
        _awaitReadyFunctions: Function[];
        _awaitNotReadyFunctions: Function[];
        awaitReady(flag?: boolean): Promise<{}>;
    }
}
declare namespace lib {
    class CommandVO {
        private _name;
        private _commandClass;
        private _messageClass;
        constructor(name: string, commandClass: any, messageClass?: any);
        readonly name: string;
        readonly commandClass: any;
        readonly messageClass: any;
    }
}
declare namespace lib {
    class ServerVO {
        private _socket;
        constructor(socket: ISocket);
        $dispose: boolean;
        private checkReadyState();
        dispose(): void;
        private _awaitConnectFunctions;
        private _awaitDisconnectFunctions;
        awaitConnect(flag?: boolean): Promise<void>;
        readonly socket: ISocket;
        private _uuid;
        uuid: string;
        private _connectionUUID;
        private _type;
        type: string;
        readonly hasServer: boolean;
        private _serverIp;
        serverIp: string;
        private _serverPort;
        serverPort: number;
        private _linkType;
        linkType: string;
        private _isReady;
        isReady: boolean;
        private _awaitReadyFunctions;
        private _awaitNotReadyFunctions;
        awaitReady(flag: boolean): Promise<void>;
        private _isConnect;
        readonly isConnect: boolean;
        $isConnect: boolean;
        static INIT_SERVER_CLASS: typeof ServerVO;
        static INIT_CLIENT_CLASS: typeof ServerVO;
    }
}
declare namespace lib {
    class DependVO {
        private _config;
        private _server;
        constructor(config: InterfaceConfig, server: ServerVO);
        readonly config: InterfaceConfig;
        readonly server: ServerVO;
        $call(params: any[], remoteId?: string): Promise<CallResult>;
        $call2(params: any[]): void;
    }
}
declare namespace lib {
    class CallAwaitConditionVO {
        constructor(uuid?: string, serverType?: string, judge?: (condition: CallAwaitConditionVO, depend: DependVO) => boolean, await?: boolean);
        uuid: string;
        serverType: string;
        judge: (condition: CallAwaitConditionVO, depend: DependVO) => boolean;
        $await: boolean;
        readonly await: boolean;
        equal(depend: DependVO): boolean;
        private _remoteId;
        readonly $remoteId: string;
    }
}
declare namespace lib {
    class CommandProxy {
        $commands: CommandVO[];
        $createInsideCallCommandVO(commandName: string): CommandVO;
        addCommand(command: CommandVO): void;
        getCommand(name: string): CommandVO;
    }
}
declare namespace lib {
    class ServerProxy {
        private servers;
        addServer(server: ServerVO): ServerVO;
        removeServer(server: ServerVO): ServerVO;
        getServerBySocket(socket: ISocket): ServerVO;
        getServerByUUID(uuid: string): ServerVO;
        getServerAt(index: number): ServerVO;
        private _awaitAddServers;
        onAwaitAddServer(serverType: string): Promise<ServerVO>;
    }
}
declare namespace lib {
    class DependProxy {
        private depends;
        add(depend: DependVO): void;
        has(name: string): boolean;
        removeServer(uuid: string): void;
        call(name: string, params?: any[], condition?: CallAwaitConditionVO): Promise<CallResult>;
        notify(name: string, params?: any[], condition?: CallAwaitConditionVO): void;
        $hasServerDepend(uuid: string): boolean;
        private _awaitDependFunctions;
        $awaitDependReady(name: string, condition: CallAwaitConditionVO): Promise<void>;
        _awaitReadyFunctions: Function[];
        _awaitNotReadyFunctions: Function[];
        awaitReady(flag?: boolean): Promise<{}>;
        _isReady: boolean;
        readonly $isReady: boolean;
        $checkReady(): void;
    }
}
declare namespace lib {
    class StateProxy {
        constructor();
        _checkDependReady(): Promise<void>;
        private awaits;
        _checkAwait(vo: AwaitVO): Promise<void>;
        addAwait(vo: AwaitVO): void;
        removeAwait(vo: AwaitVO): void;
        _awaitReadyFunctions: Function[];
        _awaitNotReadyFunctions: Function[];
        awaitReady(flag?: boolean): Promise<{}>;
        _isReady: boolean;
        readonly $isReady: boolean;
        $checkReady(): void;
    }
}
declare namespace lib {
    class StaticProxy {
        static serverConfig: ServerConfig;
        static serverProxy: ServerProxy;
        static dependProxy: DependProxy;
        static commandProxy: CommandProxy;
        static stateProxy: StateProxy;
        static $init(): void;
    }
}
declare namespace lib {
    class RouteConnection {
        private _server;
        private _client;
        constructor(server: ServerVO, client: ServerVO);
        readonly server: ServerVO;
        readonly client: ServerVO;
        dispose(): void;
        private static connections;
        static getConnection(socket: ISocket): RouteConnection;
    }
}
declare namespace lib {
    class RouteStation implements ISocketServer {
        private socket;
        _clientClass: any;
        constructor();
        clientClass: any;
        start(port: number): void;
    }
}
declare namespace lib {
    class RouteServer implements ISocketServer {
        private socket;
        clientClass: any;
        constructor();
        start(port: number): void;
    }
}
declare namespace lib {
    class RouteServerClient implements ISocketServerClient {
    }
}
declare namespace lib {
    class RouteClient extends SocketBase implements ISocketClient {
        private socket;
        constructor(route: RouteConfig);
        readonly isClient: boolean;
        readonly isConnect: boolean;
        send(bytes: ByteArray): void;
        addRemote(remote: IRemote): void;
        awaitClose(): Promise<number>;
        close(): void;
        onReceive(message: any): void;
        add(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        addOnce(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        remove(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        addZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        removeZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        addZeroOnce(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
    }
}
declare namespace lib {
    class InsideServer {
        private socket;
        private config;
        constructor(config: ServerConfig);
    }
}
declare namespace lib {
    class InsideServerClient extends WebSocketServerClient {
        private interfaceComponent;
        private server;
        $uuid: string;
        constructor(connection: any);
        readonly uuid: string;
        private initNet();
    }
}
declare namespace lib {
    class InsideClient implements ISocket {
        private socket;
        private config;
        private interfaceComponent;
        server: ServerVO;
        constructor(config: ClientConfig);
        private initNet();
        readonly isClient: boolean;
        readonly isConnect: boolean;
        send(bytes: ByteArray): void;
        addRemote(remote: IRemote): void;
        awaitClose(): Promise<number>;
        close(): void;
        onReceive(message: any): void;
        add(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        addOnce(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        remove(cmd: number, back: (head: IHead, bytes: ByteArray) => void, thisObj: any): void;
        addZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        removeZero(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
        addZeroOnce(cmd: number, back: (head: ZeroResponse) => void, thisObj: any): void;
    }
}
declare namespace lib {
}
