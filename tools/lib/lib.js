var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var lib;
(function (lib) {
    var fs = require("fs");
    var path = require("path");
    class File {
        constructor(url) {
            if (url.charAt(url.length - 1) == "/") {
                url = url.slice(0, url.length - 1);
            }
            this._url = url;
            if (this.existence) {
                this._name = this.url;
                if (this.url.split("/").length > 1) {
                    this._name = this.url.split("/")[this.url.split("/").length - 1];
                }
                this._end = "";
                if (!this.isDirection && this.name.split(".").length > 1) {
                    this._end = this.name.split(".")[this.name.split(".").length - 1];
                    this._name = this.name.slice(0, this.name.length - this._end.length);
                }
                if (this.isDirection) {
                    this._direction = this.url.slice(0, this.url.length - this.name.length);
                }
                else {
                    this._direction = this.url.slice(0, this.url.length - this._end.length - 1 - this.name.length);
                }
            }
        }
        save(content, url) {
            url = url || this.url;
            var format = typeof content == "string" ? "utf-8" : "binary";
            if (url.split("/").length > 1 || url.split(".").length == 1) {
                if (url.split(".").length == 1) {
                    var dir = new File(url.slice(0, url.length - url.split("/")[url.split("/").length - 1].length));
                    if (dir.existence == false || !dir.isDirection) {
                        File.mkdir(url);
                    }
                }
                else {
                    File.mkdir(url.slice(0, url.length - url.split("/")[url.split("/").length - 1].length));
                }
            }
            fs.writeFileSync(url, content, format);
        }
        getContent(format = "utf-8") {
            if (!this.existence) {
                return null;
            }
            return fs.readFileSync(this.url, format);
        }
        getFileListWithEnd(ends) {
            if (typeof ends == "string") {
                ends = [ends];
            }
            let files = [];
            if (!this.isDirection) {
                for (let i = 0; i < ends.length; i++) {
                    let end = ends[i];
                    if (end == "*" || end == this.end) {
                        files.push(this);
                    }
                }
            }
            else if (this.isDirection) {
                let list = fs.readdirSync(this.url);
                for (let i = 0; i < list.length; i++) {
                    let file = new File(this.url + "/" + list[i]);
                    files = files.concat(file.getFileListWithEnd(ends));
                }
            }
            return files;
        }
        getDirectionList() {
            var files = [];
            if (this.isDirection) {
                files.push(this);
                let list = fs.readdirSync(this.url);
                for (let i = 0; i < list.length; i++) {
                    let file = new File(this.url + "/" + list[i]);
                    files = files.concat(file.getDirectionList());
                }
            }
            return files;
        }
        delete() {
            if (this.existence == false) {
                return;
            }
            if (!this.isDirection) {
                fs.unlinkSync(this.url);
            }
            else if (this.isDirection) {
                let list = fs.readdirSync(this.url);
                for (let i = 0; i < list.length; i++) {
                    let file = new File(this.url + "/" + list[i]);
                    file.delete();
                }
                try {
                    fs.rmdirSync(this.url);
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        get url() {
            return this._url;
        }
        get name() {
            return this._name;
        }
        get end() {
            return this._end;
        }
        get existence() {
            return fs.existsSync(this._url);
        }
        get state() {
            return fs.statSync(this.url);
        }
        get isDirection() {
            return this.state.isDirectory();
        }
        get direction() {
            return this._direction;
        }
        static mkdir(dirPath, mode = null) {
            if (!fs.existsSync(dirPath)) {
                var pathtmp;
                dirPath.split(path.sep).forEach(function (dirname) {
                    if (dirname == "") {
                        pathtmp = "/";
                        return;
                    }
                    if (pathtmp) {
                        pathtmp = path.join(pathtmp, dirname);
                    }
                    else {
                        pathtmp = dirname;
                    }
                    if (!fs.existsSync(pathtmp)) {
                        if (!fs.mkdir(pathtmp, mode)) {
                            return false;
                        }
                    }
                });
            }
            return true;
        }
    }
    lib.File = File;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ByteArray {
        constructor() {
            this.bytes = [];
            this.position = 0;
            this.length = 0;
        }
        get length() {
            return this._length;
        }
        set length(val) {
            this._length = val;
        }
        get bytesAvailable() {
            return this._length - this.position;
        }
        get arrayData() {
            return this.bytes;
        }
        writeByte(val) {
            val = val & 0xFF;
            this.bytes.splice(this.position, 0, val);
            this.length += 1;
            this.position += 1;
        }
        writeBoolean(val) {
            this.bytes.splice(this.position, 0, val == true ? 1 : 0);
            this.length += 1;
            this.position += 1;
        }
        writeInt(val) {
            if (val >= 0) {
                val *= 2;
            }
            else {
                val = ~val;
                val *= 2;
                val++;
            }
            this.writeUInt(val);
        }
        writeUInt(val) {
            var flag = false;
            val = val < 0 ? -val : val;
            var val2 = 0;
            if (val >= 0x10000000) {
                val2 = val / 0x10000000;
                val = val & 0xFFFFFFF;
                flag = true;
            }
            if (flag || val >> 7) {
                this.bytes.splice(this.position, 0, 0x80 | val & 0x7F);
                this.position++;
                this.length++;
            }
            else {
                this.bytes.splice(this.position, 0, val & 0x7F);
                this.position++;
                this.length++;
            }
            if (flag || val >> 14) {
                this.bytes.splice(this.position, 0, 0x80 | (val >> 7) & 0x7F);
                this.position++;
                this.length++;
            }
            else if (val >> 7) {
                this.bytes.splice(this.position, 0, (val >> 7) & 0x7F);
                this.position++;
                this.length++;
            }
            if (flag || val >> 21) {
                this.bytes.splice(this.position, 0, 0x80 | (val >> 14) & 0x7F);
                this.position++;
                this.length++;
            }
            else if (val >> 14) {
                this.bytes.splice(this.position, 0, (val >> 14) & 0x7F);
                this.position++;
                this.length++;
            }
            if (flag || val >> 28) {
                this.bytes.splice(this.position, 0, 0x80 | (val >> 21) & 0x7F);
                this.position++;
                this.length++;
            }
            else if (val >> 21) {
                this.bytes.splice(this.position, 0, (val >> 21) & 0x7F);
                this.position++;
                this.length++;
            }
            if (flag) {
                this.writeUInt(Math.floor(val2));
            }
        }
        writeUTF(val) {
            var arr = lib.UTFChange.stringToBytes(val);
            this.writeUInt(arr.length);
            for (var i = 0; i < arr.length; i++) {
                this.bytes.splice(this.position, 0, arr[i]);
                this.position++;
            }
            this.length += arr.length;
        }
        writeUTFBytes(val, len) {
            var arr = lib.UTFChange.stringToBytes(val);
            for (var i = 0; i < len; i++) {
                if (i < arr.length)
                    this.bytes.splice(this.position, 0, arr[i]);
                else
                    this.bytes.splice(this.position, 0, 0);
                this.position++;
            }
            this.length += len;
        }
        writeByteArray(byteArray, start = 0, len = 0) {
            var copy = byteArray.bytes;
            for (var i = start; i < copy.length && i < start + len; i++) {
                this.bytes.splice(this.position, 0, copy[i]);
                this.position++;
            }
            this.length += len;
        }
        writeArray(array) {
            var bytes = this.bytes;
            for (var i = 0, len = array.length; i < len; i++) {
                bytes.push(array[i]);
            }
            this.length += this.bytes.length;
        }
        readByte() {
            this.position++;
            return this.bytes[this.position - 1];
        }
        readBoolean() {
            this.position++;
            return this.bytes[this.position - 1] ? true : false;
        }
        readUInt() {
            var bytes = this.bytes;
            var val = 0;
            var position = this.position;
            val += bytes[position] & 0x7F;
            if (bytes[position] >> 7) {
                position++;
                val += (bytes[position] & 0x7F) << 7;
                if (bytes[position] >> 7) {
                    position++;
                    val += (bytes[position] & 0x7F) << 14;
                    if (bytes[position] >> 7) {
                        position++;
                        val += (bytes[position] & 0x7F) << 21;
                        if (bytes[position] >> 7) {
                            position++;
                            val += ((bytes[position] & 0x7F) << 24) * 16;
                            if (bytes[position] >> 7) {
                                position++;
                                val += ((bytes[position] & 0x7F) << 24) * 0x800;
                                if (bytes[position] >> 7) {
                                    position++;
                                    val += (bytes[position] << 24) * 0x40000;
                                }
                            }
                        }
                    }
                }
            }
            position++;
            this.position = position;
            return val;
        }
        readInt() {
            var val = this.readUInt();
            if (val % 2 == 1) {
                val = Math.floor(val / 2);
                val = ~val;
            }
            else {
                val = Math.floor(val / 2);
            }
            return val;
        }
        readUTF() {
            var len = this.readUInt();
            var val = lib.UTFChange.bytesToString(this.bytes.slice(this.position, this.position + len));
            this.position += len;
            return val;
        }
        readUTFBytes(len) {
            var val = lib.UTFChange.bytesToString(this.bytes.slice(this.position, this.position + len));
            this.position += len;
            return val;
        }
        toString() {
            return JSON.stringify(this.bytes);
        }
    }
    lib.ByteArray = ByteArray;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class UTFChange {
        static bytesToString(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] < 0)
                    arr[i] += 256;
            }
            var res = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == 0)
                    continue;
                if ((arr[i] & 128) == 0)
                    res.push(arr[i]);
                else if ((arr[i] & 64) == 0)
                    res.push(arr[i] % 128);
                else if ((arr[i] & 32) == 0) {
                    res.push((arr[i] % 32) * 64 + (arr[i + 1] % 64));
                    i++;
                }
                else if ((arr[i] & 16) == 0) {
                    res.push((arr[i] % 16) * 64 * 64 + (arr[i + 1] % 64) * 64 + (arr[i + 2] % 64));
                    i++;
                    i++;
                }
                else if ((arr[i] & 8) == 0) {
                    res.push((arr[i] % 8) * 64 * 64 * 64 + (arr[i + 1] % 64) * 64 * 64 + (arr[i + 2] % 64) * 64 + (arr[i + 2] % 64));
                    i++;
                    i++;
                    i++;
                }
                else {
                }
            }
            var str = "";
            for (i = 0; i < res.length; i++) {
                str += String.fromCharCode(res[i]);
            }
            return str;
        }
        static stringToBytes(str) {
            var res = [];
            var num;
            for (var i = 0; i < str.length; i++) {
                num = str.charCodeAt(i);
                if (num < 128) {
                    res.push(num);
                }
                else if (num < 2048) {
                    res.push(~~(num / 64) + 128 + 64);
                    res.push((num % 64) + 128);
                }
                else if (num < 65536) {
                    res.push(~~(num / 4096) + 128 + 64 + 32);
                    res.push(~~((num % 4096) / 64) + 128);
                    res.push((num % 64) + 128);
                }
                else {
                    res.push(~~(num / 262144) + 128 + 64 + 32 + 16);
                    res.push(~~((num % 262144) / 4096) + 128);
                    res.push(~~((num % 4096) / 64) + 128);
                    res.push((num % 64) + 128);
                }
            }
            return res;
        }
    }
    lib.UTFChange = UTFChange;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class Help {
        static getuuid() {
            return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        static sleep(time) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(function (resolve) {
                    setTimeout(resolve, time);
                });
            });
        }
    }
    lib.Help = Help;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class Error {
    }
    Error.$SOCKET_CLOSED = -1;
    Error.EXECUTE_ERROR = -2;
    lib.Error = Error;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RequestHead {
        constructor(cmd = 0, uuid = "") {
            this.version = 1;
            this.headVersion = RequestHead.VERSION;
            this._cmd = cmd;
            this.$uuid = uuid;
        }
        decode(bytes) {
            this.version = bytes.readUInt();
            this._cmd = bytes.readUInt();
            this.$uuid = bytes.readUTF();
        }
        encode(bytes) {
            bytes.writeUInt(this.headVersion);
            bytes.writeUInt(this.version);
            bytes.writeUInt(this._cmd);
            bytes.writeUTF(this.$uuid);
        }
        readFrom(head) {
            this.headVersion = head.headVersion;
            this.version = head.version;
            this._cmd = head.cmd;
            this.$uuid = head.$uuid;
        }
        get cmd() {
            return this._cmd;
        }
        get remoteId() {
            return this.$uuid;
        }
        get isRequest() {
            return true;
        }
        get value() {
            return {
                "headVersion": this.headVersion,
                "version": this.version,
                "cmd": this.cmd,
                "uuid": this.$uuid
            };
        }
    }
    RequestHead.VERSION = 1;
    lib.RequestHead = RequestHead;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ResponseHead {
        constructor(cmd = 0, uuid = "", processTime = 0) {
            this.version = 1;
            this.headVersion = ResponseHead.VERSION;
            this._cmd = cmd;
            this.$uuid = uuid;
            this._processTime = processTime;
        }
        decode(bytes) {
            this.version = bytes.readUInt();
            this._cmd = bytes.readUInt();
            this.$uuid = bytes.readUTF();
            this._processTime = bytes.readUInt();
        }
        encode(bytes) {
            bytes.writeUInt(this.headVersion);
            bytes.writeUInt(this.version);
            bytes.writeUInt(this._cmd);
            bytes.writeUTF(this.$uuid);
            bytes.writeUInt(this._processTime);
        }
        readFrom(head) {
            this.headVersion = head.headVersion;
            this.version = head.version;
            this._cmd = head.cmd;
            this.$uuid = head.remoteId;
            this._processTime = head.processTime;
        }
        get cmd() {
            return this._cmd;
        }
        get remoteId() {
            return this.$uuid;
        }
        get processTime() {
            return this._processTime;
        }
        get isRequest() {
            return false;
        }
        get value() {
            return {
                "headVersion": this.headVersion,
                "version": this.version,
                "cmd": this.cmd,
                "remoteId": this.remoteId,
                "processTime": this.processTime
            };
        }
    }
    ResponseHead.VERSION = 2;
    lib.ResponseHead = ResponseHead;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class Request extends lib.ByteArray {
        constructor(cmd = -1) {
            super();
            if (cmd != -1) {
                this.head = new lib.RequestHead(cmd, lib.Help.getuuid());
            }
        }
        setHead(head) {
            if (this.head) {
                this.head.readFrom(head);
            }
            else {
                this.head = head;
            }
        }
        send(net) {
            this.head.encode(this);
            this.encode(this);
            net.addRemote(this);
            net.send(this);
            var __ = this;
            return new Promise(function (resolve) {
                __.resolve = resolve;
            }.bind(this));
        }
        encode(bytes) {
        }
        decode(bytes) {
        }
        onReceive(head, bytes) {
        }
        onBack(head) {
            var func = this.resolve;
            this.resolve = null;
            func(head);
        }
        get remoteId() {
            return this.head.remoteId;
        }
        get value() {
            return {
                head: this.head.value
            };
        }
    }
    lib.Request = Request;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class Response extends lib.ByteArray {
        constructor(cmd = -1, uuid = "", processTime = 0) {
            super();
            if (cmd != -1) {
                this.head = new lib.ResponseHead(cmd, uuid, processTime);
            }
        }
        setHead(head) {
            if (this.head) {
                this.head.readFrom(head);
            }
            else {
                this.head = head;
            }
        }
        send(net) {
            this.head.encode(this);
            this.encode(this);
            net.send(this);
        }
        encode(bytes) {
        }
        decode(bytes) {
        }
        get value() {
            return {
                head: this.head.value
            };
        }
    }
    lib.Response = Response;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ZeroResponse extends lib.Response {
        constructor(uuid = "", processTime = 0, errorCode = 0, requestCmd = 0, message = "") {
            super(0, uuid, processTime);
            this.message = "";
            this.errorCode = errorCode;
            this.requestCmd = requestCmd;
            this.message = message;
        }
        encode(bytes) {
            bytes.writeInt(this.errorCode);
            bytes.writeUInt(this.requestCmd);
            bytes.writeUTF(this.message);
        }
        decode(bytes) {
            this.errorCode = bytes.readInt();
            this.requestCmd = bytes.readUInt();
            this.message = bytes.readUTF();
        }
        get value() {
            return {
                head: this.head.value,
                errorCode: this.errorCode,
                requestCmd: this.requestCmd,
                message: this.message
            };
        }
    }
    lib.ZeroResponse = ZeroResponse;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class SocketBase {
        constructor() {
            this.remotes = {};
            this.backs = {};
            this.zbacks = {};
            this.isClient = false;
            this.awaitCloseFunctions = [];
            this.awaitConnectFunctions = [];
        }
        addRemote(remote) {
            this.remotes[remote.remoteId] = remote;
        }
        onReceive(message) {
        }
        add(cmd, back, thisObj) {
            if (this.backs[cmd] == null) {
                this.backs[cmd] = [];
            }
            this.backs[cmd].push({ func: back, thisObj: thisObj, id: SocketBase.id++ });
        }
        addOnce(cmd, back, thisObj) {
            if (this.backs[cmd] == null) {
                this.backs[cmd] = [];
            }
            this.backs[cmd].push({ func: back, thisObj: thisObj, once: true, id: SocketBase.id++ });
        }
        remove(cmd, back, thisObj) {
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
        addZero(cmd, back, thisObj) {
            if (this.zbacks[cmd] == null) {
                this.zbacks[cmd] = [];
            }
            this.zbacks[cmd].push({ func: back, thisObj: thisObj, id: SocketBase.id++ });
        }
        removeZero(cmd, back, thisObj) {
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
        addZeroOnce(cmd, back, thisObj) {
            if (this.zbacks[cmd] == null) {
                this.zbacks[cmd] = [];
            }
            this.zbacks[cmd].push({ func: back, thisObj: thisObj, once: true, id: SocketBase.id++ });
        }
        dispatchMessage(bytes) {
            var pos;
            var head = SocketBase.readHead(bytes);
            var buffers = lib.SocketBuffer.getMessage(head.remoteId);
            if (head.isRequest && buffers) {
                for (let i = 0; i < buffers.length; i++) {
                    var bhead = SocketBase.readHead(buffers[i]);
                    this.send(buffers[i]);
                }
                lib.SocketBuffer.removeMessage(head.remoteId);
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
                var remote = this.remotes[remoteId];
                if (cmd == 0) {
                    let zp = new lib.ZeroResponse();
                    zp.head = head;
                    zp.decode(bytes);
                    remote.onBack(zp);
                    delete this.remotes[remoteId];
                }
                else {
                    remote.onReceive(head, bytes);
                }
            }
            else if (cmd == 0) {
                let zp = new lib.ZeroResponse();
                zp.head = head;
                zp.decode(bytes);
                var backCmd = zp.requestCmd;
                var zbackList = this.zbacks[backCmd];
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
            }
            else {
                pos = bytes.position;
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
            }
        }
        send(bytes) {
        }
        awaitClose() {
            var __ = this;
            return new Promise(function (resolve) {
                __.awaitCloseFunctions.push(resolve);
            });
        }
        onAwaitClose(code) {
            for (var key in this.remotes) {
                this.remotes[key].onBack(new lib.ZeroResponse("", 0, lib.Error.$SOCKET_CLOSED, 0));
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
        awaitConnect() {
            var __ = this;
            return new Promise(function (resolve) {
                __.awaitConnectFunctions.push(resolve);
            });
        }
        connectComplete() {
            if (this.awaitConnectFunctions) {
                var funcs = this.awaitConnectFunctions.concat();
                while (funcs.length) {
                    var func = funcs.shift();
                    func();
                }
            }
        }
        close() {
        }
        get isConnect() {
            return false;
        }
        static readHead(bytes) {
            bytes.position = 0;
            let headVersion = bytes.readUInt();
            let head;
            if (headVersion % 2) {
                head = new lib.RequestHead();
                head.headVersion = headVersion;
                head.decode(bytes);
            }
            else {
                head = new lib.ResponseHead();
                head.headVersion = headVersion;
                head.decode(bytes);
            }
            return head;
        }
    }
    SocketBase.id = 1;
    lib.SocketBase = SocketBase;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class SocketBuffer {
        static addMessage(remoteId, bytes) {
            if (!SocketBuffer.buffers[remoteId]) {
                SocketBuffer.buffers[remoteId] = [];
            }
            SocketBuffer.buffers[remoteId].push(bytes);
        }
        static getMessage(remoteId) {
            return SocketBuffer.buffers[remoteId];
        }
        static removeMessage(remoteId) {
            delete SocketBuffer.buffers[remoteId];
        }
    }
    SocketBuffer.buffers = [];
    lib.SocketBuffer = SocketBuffer;
})(lib || (lib = {}));
var lib;
(function (lib) {
    var webSocket = require('websocket').server;
    var http = require('http');
    class WebSocketServer {
        constructor(clientClazz = lib.WebSocketServerClient) {
            this._clientClass = lib.WebSocketServerClient;
        }
        set clientClass(clientClass) {
            this._clientClass = clientClass;
        }
        get clientClass() {
            return this._clientClass;
        }
        start(port) {
            var server = http.createServer(function (request, response) {
            });
            server.listen(port, function () {
            });
            this.server = new webSocket({
                httpServer: server
            });
            this.server.on('request', this.onConnectClient.bind(this));
        }
        onConnectClient(request) {
            var connection = request.accept(null, request.origin);
            var client = new this._clientClass(connection);
            return client;
        }
    }
    lib.WebSocketServer = WebSocketServer;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class WebSocketServerClient extends lib.SocketBase {
        constructor(connection, type = "binary") {
            super();
            this.isClient = false;
            this.connection = connection;
            this._isConnect = true;
            this._isClosed = false;
            this.type = type;
            this.connection.on("error", this.onError.bind(this));
            this.connection.on("message", this.onReceive.bind(this));
            this.connection.on("close", this.onClose.bind(this));
        }
        get isClosed() {
            return this._isClosed;
        }
        get isConnect() {
            return this._isConnect;
        }
        onError(e) {
        }
        onReceive(message) {
            var data;
            if (this.type == "utf8") {
                data = JSON.parse(message.utf8Data);
            }
            else if (this.type == "binary") {
                data = message.binaryData;
            }
            var bytes = new lib.ByteArray();
            bytes.writeArray(data);
            this.dispatchMessage(bytes);
        }
        onClose(code, desc = "") {
            this._isClosed = true;
            this._isConnect = false;
            this.onAwaitClose(code);
        }
        send(bytes) {
            if (!this._isConnect) {
                var head = lib.SocketBase.readHead(bytes);
                if (!head.isRequest) {
                    lib.SocketBuffer.addMessage(head.remoteId, bytes);
                }
                return;
            }
            if (this.type == "binary") {
                this.connection.sendBytes(new Buffer(bytes.arrayData));
            }
            else {
                this.connection.sendUTF(bytes.toString());
            }
        }
        close() {
            if (!this.isClosed) {
                this.connection.close();
                this.onClose(0);
            }
        }
    }
    lib.WebSocketServerClient = WebSocketServerClient;
})(lib || (lib = {}));
var lib;
(function (lib) {
    var WSClient = require("websocket").client;
    class WebSocketClient extends lib.SocketBase {
        constructor(type = "binary") {
            super();
            this._isConnect = false;
            this._isClosed = true;
            this.autoLinkServer = true;
            this.connectSleep = 100;
            this.isClient = true;
            this._type = type;
            this._autoLink();
        }
        _autoLink() {
            return __awaiter(this, void 0, void 0, function* () {
                while (this.autoLinkServer) {
                    yield this.awaitConnect();
                    yield this.awaitClose();
                    if (this.autoLinkServer) {
                        this.connect(this.serverIp, this.serverPort);
                    }
                }
            });
        }
        get type() {
            return this._type;
        }
        get isConnect() {
            return this._isConnect;
        }
        get isClosed() {
            return this._isClosed;
        }
        connect(ip, port) {
            this.serverIp = ip;
            this.serverPort = port;
            this.client = new WSClient();
            this.client.on("connectFailed", this.onConnectError.bind(this));
            this.client.on("connect", this.onConnect.bind(this));
            this.client.connect("ws://" + ip + ":" + port + "/");
            this._isConnect = false;
            this._isClosed = true;
        }
        awaitConnect(ip = "", port = 0) {
            if (port) {
                this.connect(ip, port);
            }
            return super.awaitConnect();
        }
        onConnect(connection) {
            this.connection = connection;
            connection.on("error", this.onError.bind(this));
            connection.on("close", this.onClose.bind(this));
            connection.on("message", this.onReceive.bind(this));
            this._isConnect = true;
            this._isClosed = false;
            this.connectComplete();
        }
        onConnectError(e) {
            let __ = this;
            setTimeout(function () {
                __.connect(__.serverIp, __.serverPort);
            }, this.connectSleep);
        }
        onError(e) {
        }
        onClose(code, desc = "") {
            this._isConnect = false;
            this._isClosed = true;
            this.connection = null;
            this.onAwaitClose(code);
        }
        onReceive(message) {
            var data;
            if (this.type == "utf8") {
                data = JSON.parse(message.utf8Data);
            }
            else if (this.type == "binary") {
                data = message.binaryData;
            }
            var bytes = new lib.ByteArray();
            bytes.writeArray(data);
            this.dispatchMessage(bytes);
        }
        send(bytes) {
            if (!this._isConnect) {
                var head = lib.SocketBase.readHead(bytes);
                if (!head.isRequest) {
                    lib.SocketBuffer.addMessage(head.remoteId, bytes);
                }
                return;
            }
            if (this.type == "binary") {
                this.connection.sendBytes(new Buffer(bytes.arrayData));
            }
            else {
                this.connection.sendUTF(bytes.toString());
            }
        }
        close() {
            if (this.connection && !this._isClosed) {
                this.connection.close();
                this.onClose(0);
            }
        }
    }
    lib.WebSocketClient = WebSocketClient;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CommandBase {
        constructor(socket, head, bytes, message = null) {
            this._startTime = this.currentTime;
            this._socket = socket;
            this._head = head;
            try {
                this._bytes = bytes;
                this._message = message;
                this.execute();
            }
            catch (e) {
                console.log(e);
                this.fail(lib.Error.EXECUTE_ERROR, e);
            }
        }
        success() {
            var msg = new lib.ZeroResponse(this.head.remoteId, this.currentTime - this.startTime, 0, this.head.cmd);
            msg.send(this.socket);
        }
        fail(code, message = "") {
            var msg = new lib.ZeroResponse(this.head.remoteId, this.currentTime - this.startTime, code, this.head.cmd, message);
            msg.send(this.socket);
        }
        send(msg) {
            this.socket.send(msg);
        }
        get currentTime() {
            return (new Date()).getTime();
        }
        get startTime() {
            return this._startTime;
        }
        get socket() {
            return this._socket;
        }
        get head() {
            return this._head;
        }
        get bytes() {
            return this._bytes;
        }
        get message() {
            return this._message;
        }
    }
    lib.CommandBase = CommandBase;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RegisterInterfaceCommand extends lib.CommandBase {
        execute() {
            var message = this.message;
            var list = message.config;
            if (lib.StaticProxy.dependProxy.$hasServerDepend(message.uuid)) {
                this.success();
                return;
            }
            var serverVO = lib.StaticProxy.serverProxy.getServerBySocket(this.socket);
            serverVO.uuid = message.uuid;
            serverVO.type = message.type;
            serverVO.serverIp = message.serverIp;
            serverVO.serverPort = message.serverPort;
            for (let i = 0; i < list.length; i++) {
                lib.StaticProxy.dependProxy.add(new lib.DependVO(new lib.InterfaceConfig(list[i]), serverVO));
            }
            if (!message.reverseRegister) {
                var cfg = lib.StaticProxy.serverConfig;
                var msg = new lib.RegisterInterfaceRequest(true, cfg.uuid, cfg.type, lib.StaticProxy.serverConfig.serverIp, lib.StaticProxy.serverConfig.serverPort, cfg.interfacesConfig);
                msg.send(this.socket);
            }
            this.success();
        }
    }
    lib.RegisterInterfaceCommand = RegisterInterfaceCommand;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CallCommand extends lib.CommandBase {
        responseResult(data) {
            var response = new lib.CallResponse(this.head.remoteId, this.currentTime - this.startTime, data);
            response.send(this.socket);
        }
    }
    lib.CallCommand = CallCommand;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class AwaitReadyCommand extends lib.CallCommand {
        execute() {
            return __awaiter(this, void 0, void 0, function* () {
                var bool = this.message.params.length ? this.message.params[0] : true;
                yield lib.StaticProxy.stateProxy.awaitReady(bool);
                this.success();
            });
        }
    }
    lib.AwaitReadyCommand = AwaitReadyCommand;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CallResult {
        constructor(errorCode = 0, result = null) {
            this._errorCode = errorCode;
            this._result = result;
        }
        get errorCode() {
            return this._errorCode;
        }
        get result() {
            return this._result;
        }
    }
    lib.CallResult = CallResult;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ServerApp {
        constructor(nps = null, config = null) {
            lib.StaticProxy.$init();
            if (config) {
                this.config = new lib.ServerConfig(config);
            }
            else {
                var file = new lib.File("./server.json");
                if (file.existence) {
                    this.config = new lib.ServerConfig(JSON.parse(file.getContent()));
                }
            }
            lib.StaticProxy.serverConfig = this.config;
            lib.InitServerInterface.$addInitCommand();
            if (nps) {
                var infs = this.config.interfaces;
                for (let i = 0, len = infs.length; i < len; i++) {
                    if (infs[i].command && infs[i].command != "" && nps[infs[i].command]) {
                        lib.StaticProxy.commandProxy.addCommand(new lib.CommandVO(infs[i].command, nps[infs[i].command], lib.CallRequest));
                    }
                }
            }
            setTimeout(this.start.bind(this), 0);
        }
        start() {
            if (this.config.hasServer) {
                var server = new lib.InsideServer(this.config);
            }
            if (this.config.clients.length) {
                for (let i = 0; i < this.config.clients.length; i++) {
                    let cfg = this.config.clients[i];
                    let client = new lib.InsideClient(cfg);
                }
            }
            this.awaitReady();
        }
        awaitReady() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    lib.StaticProxy.stateProxy.$checkReady();
                    yield lib.StaticProxy.stateProxy.awaitReady();
                    this.getReady();
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
        getReady() {
        }
    }
    lib.ServerApp = ServerApp;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RouteApp extends lib.ServerApp {
    }
    lib.RouteApp = RouteApp;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class Param {
        constructor(config = null) {
            if (config) {
                var version = this._version = config.version || "1.0";
                if (version == "1.0") {
                    this._type = lib.ParamType.getType(config.type);
                }
            }
            else {
                this._version = "1.0";
                this._type = "void";
            }
        }
        get version() {
            return this._version;
        }
        get type() {
            return this._type;
        }
        get config() {
            return {
                "version": this._version,
                "type": this._type
            };
        }
    }
    lib.Param = Param;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ParamType {
        static getType(type) {
            if (type == "int") {
                return ParamType.INT;
            }
            if (type == "uint") {
                return ParamType.UINT;
            }
            if (type == "string") {
                return ParamType.STRING;
            }
            if (type == "boolean") {
                return ParamType.BOOLEAN;
            }
            if (type == "void") {
                return ParamType.VOID;
            }
            if (type == "*") {
                return ParamType.NONE;
            }
            return ParamType.UNKONW;
        }
    }
    ParamType.INT = "int";
    ParamType.UINT = "uint";
    ParamType.STRING = "string";
    ParamType.BOOLEAN = "boolean";
    ParamType.VOID = "void";
    ParamType.NONE = "*";
    ParamType.UNKONW = "";
    lib.ParamType = ParamType;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class InitServerInterface {
        static addInitInterface(config) {
            let list = config.interfaces;
            var configs = InitServerInterface.initConfig;
            for (let i = 0; i < configs.length; i++) {
                list.push(new lib.InterfaceConfig(configs[i]));
            }
        }
        static $addInitCommand() {
            var configs = InitServerInterface.initConfig;
            for (let i = 0; i < configs.length; i++) {
                var commandName = configs[i].command;
                lib.StaticProxy.commandProxy.$createInsideCallCommandVO(commandName);
            }
        }
    }
    InitServerInterface.initConfig = [
        {
            "name": "awaitReady",
            "return": {
                "type": "boolean"
            },
            "command": "AwaitReadyCommand"
        }
    ];
    lib.InitServerInterface = InitServerInterface;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class InterfaceConfig {
        constructor(config) {
            this._version = "1.0";
            this._params = [];
            this._retrun = null;
            if (config) {
                var version = this._version = config.version || "1.0";
                if (version == "1.0") {
                    this._name = config.name;
                    this._command = config.command || "";
                    this._necessary = config.necessary != null ? config.necessary : true;
                    var params = config.params;
                    if (params) {
                        for (let i = 0; i < params.length; i++) {
                            this._params.push(new lib.Param(params[i]));
                        }
                    }
                    if (config.return) {
                        this._retrun = new lib.Param(config.return);
                    }
                    else {
                        this._retrun = new lib.Param();
                    }
                }
            }
        }
        get config() {
            var params = [];
            for (let i = 0; i < this._params.length; i++) {
                params.push(this._params[i].config);
            }
            return {
                "name": this._name,
                "version": this._version,
                "params": params,
                "return": this._retrun.config
            };
        }
        get necessary() {
            return this._necessary;
        }
        get command() {
            return this._command;
        }
        get name() {
            return this._name;
        }
    }
    lib.InterfaceConfig = InterfaceConfig;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ServerConfig {
        constructor(config, uuid) {
            this._serverIp = "";
            this._uuid = uuid || lib.Help.getuuid();
            this._interfaces = [];
            this._depends = [];
            this._clients = [];
            this._isRoute = false;
            var version = this._version = config.version || "1.0";
            if (config) {
                if (version == "1.0") {
                    this._type = config.type || "";
                    if (config.server && config.server.port) {
                        this._hasServer = true;
                        this._serverIp = config.server.ip;
                        this._serverPort = config.server.port;
                    }
                    if (config.isRoute) {
                        this._isRoute = config.isRoute;
                    }
                    if (config.clients) {
                        for (let i = 0; i < config.clients.length; i++) {
                            this._clients.push(new lib.ClientConfig(config.clients[i]));
                        }
                    }
                    if (config.interfaces) {
                        for (let i = 0; i < config.interfaces.length; i++) {
                            this._interfaces.push(new lib.InterfaceConfig(config.interfaces[i]));
                        }
                    }
                    if (config.depends) {
                        for (let i = 0; i < config.depends.length; i++) {
                            this._depends.push(new lib.InterfaceConfig(config.depends[i]));
                        }
                    }
                }
            }
            lib.InitServerInterface.addInitInterface(this);
        }
        getInterface(name) {
            var list = this._interfaces;
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i].name == name) {
                    return list[i];
                }
            }
            return null;
        }
        get interfaces() {
            return this._interfaces;
        }
        get interfacesConfig() {
            var res = [];
            var list = this._interfaces;
            for (let i = 0, len = list.length; i < len; i++) {
                res.push(list[i].config);
            }
            return res;
        }
        get depends() {
            return this._depends;
        }
        get uuid() {
            return this._uuid;
        }
        get type() {
            return this._type;
        }
        get version() {
            return this._version;
        }
        get hasServer() {
            return this._hasServer;
        }
        get route() {
            return this._route;
        }
        get isRoute() {
            return this._isRoute;
        }
        get serverIp() {
            return this._serverIp;
        }
        get serverPort() {
            return this._serverPort;
        }
        get clients() {
            return this._clients;
        }
    }
    lib.ServerConfig = ServerConfig;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ClientConfig {
        constructor(config) {
            this._connectSleep = 100;
            this._config = config;
            if (config) {
                var version = this._version = config.version || "1.0";
                if (version == "1.0") {
                    this._type = config.type;
                    this._ip = config.ip;
                    this._port = config.port;
                    this._connectSleep = config.connectSleep;
                    if (config.route) {
                        this._route = new lib.RouteConfig(config.route.ip, config.route.port);
                    }
                }
            }
            else {
                this._version = "1.0";
            }
        }
        get version() {
            return this._version;
        }
        get type() {
            return this._type;
        }
        get route() {
            return this._route;
        }
        get ip() {
            return this._ip;
        }
        get port() {
            return this._port;
        }
        get connectSleep() {
            return this._connectSleep;
        }
    }
    lib.ClientConfig = ClientConfig;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RouteConfig {
        constructor(ip, port) {
            this._ip = ip;
            this._port = port;
        }
        get ip() {
            return this._ip;
        }
        get port() {
            return this._port;
        }
    }
    lib.RouteConfig = RouteConfig;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CommandComponent {
        constructor(socket) {
            this._cmds = {};
            this.socket = socket;
            this.$registerCommand(lib.RegisterInterfaceRequest.CMD, lib.StaticProxy.commandProxy.getCommand("RegisterInterfaceCommand"));
            this.$registerCommand(lib.CallRequest.CMD);
        }
        $registerCommand(cmd, commandVo = null) {
            this._cmds[cmd] = commandVo;
            this.socket.add(cmd, this.onRegisterBack, this);
        }
        onRegisterBack(head, bytes) {
            if (head.cmd == lib.CallRequest.CMD) {
                let message = new lib.CallRequest();
                message.head = head;
                message.decode(bytes);
                var inf = lib.StaticProxy.serverConfig.getInterface(message.name);
                let commandVO = lib.StaticProxy.commandProxy.getCommand(inf.command);
                new commandVO.commandClass(this.socket, head, bytes, message);
            }
            else {
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
    lib.CommandComponent = CommandComponent;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CallRequest extends lib.Request {
        constructor(name = "", params = []) {
            super(CallRequest.CMD);
            this.name = name;
            this.params = params;
        }
        decode(bytes) {
            this.name = bytes.readUTF();
            this.params = JSON.parse(bytes.readUTF());
        }
        encode(bytes) {
            bytes.writeUTF(this.name);
            bytes.writeUTF(JSON.stringify(this.params));
        }
        onReceive(head, bytes) {
            if (head.cmd == lib.CallResponse.CMD) {
                this.response = new lib.CallResponse();
                this.response.head = head;
                this.response.decode(bytes);
            }
        }
    }
    CallRequest.CMD = 10;
    lib.CallRequest = CallRequest;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CallResponse extends lib.Response {
        constructor(uuid = "", processTime = 0, data = null) {
            super(CallResponse.CMD, uuid, processTime);
            this.data = data;
        }
        encode(bytes) {
            bytes.writeUTF(JSON.stringify(this.data));
        }
        decode(bytes) {
            this.data = JSON.parse(bytes.readUTF());
        }
        get value() {
            return {
                head: this.head,
                data: this.data
            };
        }
    }
    CallResponse.CMD = 11;
    lib.CallResponse = CallResponse;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RegisterInterfaceRequest extends lib.Request {
        constructor(reverseRegister = false, uuid = "", type = "", serverIp = "", serverPort = 0, config = null) {
            super(RegisterInterfaceRequest.CMD);
            this.reverseRegister = reverseRegister;
            this.uuid = uuid;
            this.type = type;
            this.serverIp = serverIp;
            this.serverPort = serverPort;
            this.config = config;
        }
        encode(bytes) {
            bytes.writeBoolean(this.reverseRegister);
            bytes.writeUTF(this.uuid);
            bytes.writeUTF(this.type);
            bytes.writeUTF(this.serverIp);
            bytes.writeUInt(this.serverPort);
            bytes.writeUTF(JSON.stringify(this.config));
        }
        decode(bytes) {
            this.reverseRegister = bytes.readBoolean();
            this.uuid = bytes.readUTF();
            this.type = bytes.readUTF();
            this.serverIp = bytes.readUTF();
            this.serverPort = bytes.readUInt();
            this.config = JSON.parse(bytes.readUTF());
        }
        get value() {
            return {
                head: this.head.value,
                reverseRegister: this.reverseRegister,
                uuid: this.uuid,
                type: this.type,
                serverIp: this.serverIp,
                serverPort: this.serverPort,
                config: this.config
            };
        }
    }
    RegisterInterfaceRequest.CMD = 12;
    lib.RegisterInterfaceRequest = RegisterInterfaceRequest;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RegisterServerRequest extends lib.Request {
        constructor(uuid, type) {
            super(RegisterServerRequest.CMD);
        }
        encode(bytes) {
            bytes.writeUTF(this.uuid);
            bytes.writeUTF(this.type);
        }
        decode(bytes) {
            this.uuid = bytes.readUTF();
            this.type = bytes.readUTF();
        }
    }
    RegisterServerRequest.CMD = 14;
    lib.RegisterServerRequest = RegisterServerRequest;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class AwaitVO {
        constructor() {
            this._isReady = false;
            this._awaitReadyFunctions = [];
            this._awaitNotReadyFunctions = [];
        }
        get isReady() {
            return this._isReady;
        }
        set isReady(val) {
            this._isReady = val;
            if (this._isReady) {
                let funcs = this._awaitReadyFunctions;
                this._awaitReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
            else {
                let funcs = this._awaitNotReadyFunctions;
                this._awaitNotReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
        }
        awaitReady(flag = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (flag && this.isReady || !flag && !this.isReady) {
                    return;
                }
                else {
                    var __ = this;
                    return new Promise(function (resolve) {
                        if (flag) {
                            __._awaitReadyFunctions.push(resolve);
                        }
                        else {
                            __._awaitNotReadyFunctions.push(resolve);
                        }
                    });
                }
            });
        }
    }
    lib.AwaitVO = AwaitVO;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CommandVO {
        constructor(name, commandClass, messageClass = null) {
            this._name = name;
            this._commandClass = commandClass;
            this._messageClass = messageClass;
        }
        get name() {
            return this._name;
        }
        get commandClass() {
            return this._commandClass;
        }
        get messageClass() {
            return this._messageClass;
        }
    }
    lib.CommandVO = CommandVO;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ServerVO {
        constructor(socket) {
            this.$dispose = false;
            this._awaitConnectFunctions = [];
            this._awaitDisconnectFunctions = [];
            this._serverIp = "";
            this._linkType = "websocket";
            this._isReady = false;
            this._awaitReadyFunctions = [];
            this._awaitNotReadyFunctions = [];
            this._isConnect = false;
            this._socket = socket;
            this.checkReadyState();
        }
        checkReadyState() {
            return __awaiter(this, void 0, void 0, function* () {
                let awaitName = "awaitReady";
                while (!this.$dispose) {
                    yield this.awaitConnect();
                    yield lib.StaticProxy.dependProxy.call(awaitName, [], new lib.CallAwaitConditionVO(this._uuid, "", null, this.socket.isClient));
                    if (this.$dispose) {
                        break;
                    }
                    this.isReady = true;
                    yield lib.StaticProxy.dependProxy.call(awaitName, [false], new lib.CallAwaitConditionVO(this._uuid, "", null, this.socket.isClient));
                    if (this.$dispose) {
                        break;
                    }
                    this.isReady = false;
                }
                this.dispose();
            });
        }
        dispose() {
        }
        awaitConnect(flag = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (flag && this.isConnect || !flag && !this.isConnect) {
                    return;
                }
                var __ = this;
                return new Promise(function (resolve) {
                    if (flag) {
                        __._awaitConnectFunctions.push(resolve);
                    }
                    else {
                        __._awaitDisconnectFunctions.push(resolve);
                    }
                });
            });
        }
        get socket() {
            return this._socket;
        }
        set uuid(val) {
            this._uuid = val;
        }
        get uuid() {
            return this._uuid;
        }
        get type() {
            return this._type;
        }
        set type(val) {
            this._type = val;
        }
        get hasServer() {
            return !!(this._serverIp && this._serverIp != "");
        }
        get serverIp() {
            return this._serverIp;
        }
        set serverIp(val) {
            this._serverIp = val;
        }
        get serverPort() {
            return this._serverPort;
        }
        set serverPort(val) {
            this._serverPort = val;
        }
        get linkType() {
            return this._linkType;
        }
        set linkType(val) {
            this._linkType = val;
        }
        get isReady() {
            return this._isReady;
        }
        set isReady(val) {
            if (this._isReady == val) {
                return;
            }
            this._isReady = val;
            if (this._isReady) {
                let funcs = this._awaitReadyFunctions;
                this._awaitReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
            else {
                let funcs = this._awaitNotReadyFunctions;
                this._awaitNotReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
        }
        awaitReady(flag) {
            var __ = this;
            return new Promise(function (resolve) {
                if (flag)
                    __._awaitReadyFunctions.push(resolve);
                else
                    __._awaitNotReadyFunctions.push(resolve);
            });
        }
        get isConnect() {
            return this._isConnect;
        }
        set $isConnect(val) {
            if (this._isConnect == val) {
                return;
            }
            this._isConnect = val;
            if (val) {
                let funcs = this._awaitConnectFunctions;
                this._awaitConnectFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
            else {
                let funcs = this._awaitDisconnectFunctions;
                this._awaitDisconnectFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
        }
    }
    ServerVO.INIT_SERVER_CLASS = ServerVO;
    ServerVO.INIT_CLIENT_CLASS = ServerVO;
    lib.ServerVO = ServerVO;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class DependVO {
        constructor(config, server) {
            this._config = config;
            this._server = server;
        }
        get config() {
            return this._config;
        }
        get server() {
            return this._server;
        }
        $call(params, remoteId = "") {
            return __awaiter(this, void 0, void 0, function* () {
                var client = this.server.socket;
                var msg = new lib.CallRequest(this._config.name, params);
                if (remoteId != "") {
                    msg.head.$uuid = remoteId;
                }
                var result = yield msg.send(this._server.socket);
                return new lib.CallResult(result.errorCode, msg.response ? msg.response.data : null);
            });
        }
        $call2(params) {
            var client = this.server.socket;
            var msg = new lib.CallRequest(this._config.name, params);
            msg.send(this._server.socket);
        }
    }
    lib.DependVO = DependVO;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CallAwaitConditionVO {
        constructor(uuid = "", serverType = "", judge = null, await = true) {
            this.uuid = "";
            this.serverType = "";
            this.$await = true;
            this.uuid = uuid;
            this.serverType = serverType;
            this.judge = judge;
            this.$await = await;
        }
        get await() {
            return this.$await;
        }
        equal(depend) {
            return !!((this.uuid == "" || this.uuid == depend.server.uuid) &&
                (this.serverType == "" || this.serverType == depend.server.type) &&
                (!this.judge || this.judge(this, depend)));
        }
        get $remoteId() {
            if (!this._remoteId) {
                this._remoteId = lib.Help.getuuid();
            }
            return this._remoteId;
        }
    }
    lib.CallAwaitConditionVO = CallAwaitConditionVO;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class CommandProxy {
        constructor() {
            this.$commands = [
                new lib.CommandVO("RegisterInterfaceCommand", lib.RegisterInterfaceCommand, lib.RegisterInterfaceRequest)
            ];
        }
        $createInsideCallCommandVO(commandName) {
            var pkg = lib;
            if (pkg[commandName]) {
                var vo = new lib.CommandVO(commandName, pkg[commandName]);
                this.addCommand(vo);
                return vo;
            }
            return null;
        }
        addCommand(command) {
            this.$commands.push(command);
        }
        getCommand(name) {
            var cmds = this.$commands;
            for (let i = 0, len = cmds.length; i < len; i++) {
                if (cmds[i].name == name) {
                    return cmds[i];
                }
            }
            return null;
        }
    }
    lib.CommandProxy = CommandProxy;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class ServerProxy {
        constructor() {
            this.servers = [];
            this._awaitAddServers = [];
        }
        addServer(server) {
            this.servers.push(server);
            return server;
        }
        removeServer(server) {
            for (let i = 0, len = this.servers.length; i < len; i++) {
                if (this.servers[i] == server) {
                    this.servers.splice(i, 1);
                    break;
                }
            }
            server.$dispose = true;
            server.dispose();
            return server;
        }
        getServerBySocket(socket) {
            for (let i = 0, len = this.servers.length; i < len; i++) {
                if (this.servers[i].socket == socket) {
                    return this.servers[i];
                }
            }
            return null;
        }
        getServerByUUID(uuid) {
            for (let i = 0, len = this.servers.length; i < len; i++) {
                if (this.servers[i].uuid == uuid) {
                    return this.servers[i];
                }
            }
            return null;
        }
        getServerAt(index) {
            return this.servers[index];
        }
        onAwaitAddServer(serverType) {
            var __ = this;
            return new Promise(function (resolve) {
                __._awaitAddServers.push({
                    type: serverType,
                    resolve: resolve
                });
            });
        }
    }
    lib.ServerProxy = ServerProxy;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class DependProxy {
        constructor() {
            this.depends = [];
            this._awaitDependFunctions = {};
            this._awaitReadyFunctions = [];
            this._awaitNotReadyFunctions = [];
            this._isReady = false;
        }
        add(depend) {
            this.depends.push(depend);
            var funcs = this._awaitDependFunctions;
            var list = funcs[depend.config.name];
            if (list) {
                var copy = list.concat();
                for (let i = 0; i < copy.length; i++) {
                    var condition = copy[i].condition;
                    if (copy[i].resolve && (!condition || condition.equal(depend))) {
                        copy[i].resolve();
                        copy[i].resolve = null;
                    }
                }
                for (let i = 0; i < list.length; i++) {
                    if (list[i].resolve == null) {
                        list.splice(i, 1);
                    }
                }
                if (list.length == 0) {
                    delete funcs[depend.config.name];
                }
            }
            this.$checkReady();
        }
        has(name) {
            var dps = this.depends;
            for (let i = 0, len = dps.length; i < len; i++) {
                if (dps[i].config.name == name) {
                    return true;
                }
            }
            return false;
        }
        removeServer(uuid) {
            var dps = this.depends;
            for (let i = 0; i < dps.length; i++) {
                if (dps[i].server.uuid == uuid) {
                    dps.splice(i, 1);
                    i--;
                }
            }
            this.$checkReady();
        }
        call(name, params = [], condition = new lib.CallAwaitConditionVO()) {
            return __awaiter(this, void 0, void 0, function* () {
                var dps = this.depends;
                for (let i = 0, len = dps.length; i < dps.length; i++) {
                    if (dps[i].config.name == name && condition.equal(dps[i])) {
                        var result = yield dps[i].$call(params, condition.$remoteId);
                        if (result.errorCode == lib.Error.$SOCKET_CLOSED) {
                            if (condition.await) {
                                return yield lib.StaticProxy.dependProxy.call(name, params, condition);
                            }
                            else {
                                return result;
                            }
                        }
                        else {
                            return result;
                        }
                    }
                }
                yield this.$awaitDependReady(name, condition);
                return this.call(name, params, condition);
            });
        }
        notify(name, params = [], condition = null) {
            var dps = this.depends;
            for (let i = 0, len = dps.length; i < dps.length; i++) {
                if (dps[i].config.name == name && (!condition || condition.equal(dps[i]))) {
                    dps[i].$call2(params);
                }
            }
        }
        $hasServerDepend(uuid) {
            for (let i = 0; i < this.depends.length; i++) {
                if (this.depends[i].server.uuid == uuid) {
                    return true;
                }
            }
            return false;
        }
        $awaitDependReady(name, condition) {
            return __awaiter(this, void 0, void 0, function* () {
                var __ = this;
                return new Promise(function (resolve) {
                    var funcs = __._awaitDependFunctions;
                    if (!funcs[name]) {
                        funcs[name] = [];
                    }
                    funcs[name].push({ "condition": condition, "resolve": resolve });
                });
            });
        }
        awaitReady(flag = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (flag && this.$isReady || !flag && !this.$isReady) {
                    return;
                }
                else {
                    var __ = this;
                    return new Promise(function (resolve) {
                        if (flag) {
                            __._awaitReadyFunctions.push(resolve);
                        }
                        else {
                            __._awaitNotReadyFunctions.push(resolve);
                        }
                    });
                }
            });
        }
        get $isReady() {
            return this._isReady;
        }
        $checkReady() {
            this._isReady = true;
            var dps = lib.StaticProxy.serverConfig.depends;
            for (let d = 0, dlen = dps.length; d < dlen; d++) {
                if (!dps[d].necessary)
                    continue;
                if (!this.has(dps[d].name)) {
                    this._isReady = false;
                    break;
                }
            }
            if (this._isReady) {
                let funcs = this._awaitReadyFunctions;
                this._awaitReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
            else {
                let funcs = this._awaitNotReadyFunctions;
                this._awaitNotReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
        }
    }
    lib.DependProxy = DependProxy;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class StateProxy {
        constructor() {
            this.awaits = [];
            this._awaitReadyFunctions = [];
            this._awaitNotReadyFunctions = [];
            this._isReady = false;
            this._checkDependReady();
        }
        _checkDependReady() {
            return __awaiter(this, void 0, void 0, function* () {
                while (true) {
                    yield lib.StaticProxy.dependProxy.awaitReady();
                    this.$checkReady();
                    yield lib.StaticProxy.dependProxy.awaitReady(false);
                    this.$checkReady();
                }
            });
        }
        _checkAwait(vo) {
            return __awaiter(this, void 0, void 0, function* () {
                while (true) {
                    yield vo.awaitReady();
                    this.$checkReady();
                    yield vo.awaitReady(false);
                    this.$checkReady();
                }
            });
        }
        addAwait(vo) {
            for (let i = 0; i < this.awaits.length; i++) {
                if (this.awaits[i] == vo) {
                    return;
                }
            }
            this.awaits.push(vo);
            this._checkAwait(vo);
            this.$checkReady();
        }
        removeAwait(vo) {
            for (let i = 0; i < this.awaits.length; i++) {
                if (this.awaits[i] == vo) {
                    this.awaits.splice(i, 1);
                    this.$checkReady();
                    return;
                }
            }
        }
        awaitReady(flag = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (flag && this.$isReady || !flag && !this.$isReady) {
                    return;
                }
                else {
                    var __ = this;
                    return new Promise(function (resolve) {
                        if (flag) {
                            __._awaitReadyFunctions.push(resolve);
                        }
                        else {
                            __._awaitNotReadyFunctions.push(resolve);
                        }
                    });
                }
            });
        }
        get $isReady() {
            return this._isReady;
        }
        $checkReady() {
            this._isReady = true;
            lib.StaticProxy.dependProxy.$checkReady();
            if (!lib.StaticProxy.dependProxy.$isReady) {
                this._isReady = false;
            }
            for (let i = 0; i < this.awaits.length; i++) {
                if (!this.awaits[i].isReady) {
                    this._isReady = false;
                }
            }
            if (this._isReady) {
                let funcs = this._awaitReadyFunctions;
                this._awaitReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
            else {
                let funcs = this._awaitNotReadyFunctions;
                this._awaitNotReadyFunctions = [];
                while (funcs.length) {
                    funcs.shift()();
                }
            }
        }
    }
    lib.StateProxy = StateProxy;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class StaticProxy {
        static $init() {
            StaticProxy.serverProxy = new lib.ServerProxy();
            StaticProxy.dependProxy = new lib.DependProxy();
            StaticProxy.commandProxy = new lib.CommandProxy();
            StaticProxy.stateProxy = new lib.StateProxy();
        }
    }
    lib.StaticProxy = StaticProxy;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RouteConnection {
        constructor(server, client) {
            this._server = server;
            this._client = client;
            RouteConnection.connections.push(this);
        }
        get server() {
            return this._server;
        }
        get client() {
            return this._client;
        }
        dispose() {
            this._server = null;
            this._client = null;
            let list = RouteConnection.connections;
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i] == this) {
                    list.splice(i, 1);
                    break;
                }
            }
        }
        static getConnection(socket) {
            let list = RouteConnection.connections;
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i].server.socket == socket || list[i].client.socket == socket) {
                    return list[i];
                }
            }
            return null;
        }
    }
    RouteConnection.connections = [];
    lib.RouteConnection = RouteConnection;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RouteStation {
        constructor() {
            this._clientClass = lib.RouteServerClient;
        }
        get clientClass() {
            return this._clientClass;
        }
        set clientClass(val) {
            this._clientClass = val;
        }
        start(port) {
            this.socket = new lib.WebSocketServer(this._clientClass);
            this.socket.start(port);
        }
    }
    lib.RouteStation = RouteStation;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RouteServer {
        constructor() {
        }
        start(port) {
        }
    }
    lib.RouteServer = RouteServer;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RouteServerClient {
    }
    lib.RouteServerClient = RouteServerClient;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class RouteClient extends lib.SocketBase {
        constructor(route) {
            super();
        }
        get isClient() {
            return true;
        }
        get isConnect() {
            return this.socket.isConnect;
        }
        send(bytes) {
            this.socket.send(bytes);
        }
        addRemote(remote) {
            this.socket.addRemote(remote);
        }
        awaitClose() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.socket.awaitClose();
            });
        }
        close() {
            this.socket.close();
        }
        onReceive(message) {
            this.socket.onReceive(message);
        }
        add(cmd, back, thisObj) {
            this.socket.add(cmd, back, thisObj);
        }
        addOnce(cmd, back, thisObj) {
            this.socket.addOnce(cmd, back, thisObj);
        }
        remove(cmd, back, thisObj) {
            this.socket.remove(cmd, back, thisObj);
        }
        addZero(cmd, back, thisObj) {
            this.socket.addZero(cmd, back, thisObj);
        }
        removeZero(cmd, back, thisObj) {
            this.socket.removeZero(cmd, back, thisObj);
        }
        addZeroOnce(cmd, back, thisObj) {
            this.socket.addZeroOnce(cmd, back, thisObj);
        }
    }
    lib.RouteClient = RouteClient;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class InsideServer {
        constructor(config) {
            this.config = config;
            if (config.isRoute) {
                this.socket = new lib.RouteStation();
            }
            else if (config.route) {
                this.socket = new lib.RouteServer();
            }
            else {
                this.socket = new lib.WebSocketServer();
            }
            this.socket.clientClass = lib.InsideServerClient;
            this.socket.start(this.config.serverPort);
        }
    }
    lib.InsideServer = InsideServer;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class InsideServerClient extends lib.WebSocketServerClient {
        constructor(connection) {
            super(connection);
            this.$uuid = "";
            this.server = new lib.ServerVO.INIT_SERVER_CLASS(this);
            this.server.$isConnect = true;
            lib.StaticProxy.serverProxy.addServer(this.server);
            this.interfaceComponent = new lib.CommandComponent(this);
            this.initNet();
        }
        get uuid() {
            return this.$uuid;
        }
        initNet() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.awaitClose();
                this.server.$isConnect = false;
                lib.StaticProxy.dependProxy.removeServer(this.server.uuid);
                lib.StaticProxy.serverProxy.removeServer(this.server);
            });
        }
    }
    lib.InsideServerClient = InsideServerClient;
})(lib || (lib = {}));
var lib;
(function (lib) {
    class InsideClient {
        constructor(config) {
            this.config = config;
            if (config.route) {
            }
            else {
                this.socket = new lib.WebSocketClient();
            }
            this.server = new lib.ServerVO.INIT_CLIENT_CLASS(this);
            lib.StaticProxy.serverProxy.addServer(this.server);
            this.interfaceComponent = new lib.CommandComponent(this);
            this.initNet();
        }
        initNet() {
            return __awaiter(this, void 0, void 0, function* () {
                this.socket.connect(this.config.ip, this.config.port);
                while (true) {
                    yield this.socket.awaitConnect();
                    this.server.$isConnect = true;
                    var cfg = lib.StaticProxy.serverConfig;
                    var msg = new lib.RegisterInterfaceRequest(false, cfg.uuid, cfg.type, lib.StaticProxy.serverConfig.serverIp, lib.StaticProxy.serverConfig.serverPort, cfg.interfacesConfig);
                    msg.send(this);
                    yield this.awaitClose();
                    this.server.$isConnect = false;
                    if (lib.StaticProxy.serverProxy.getServerBySocket(this)) {
                        lib.StaticProxy.dependProxy.removeServer(lib.StaticProxy.serverProxy.getServerBySocket(this).uuid);
                    }
                }
            });
        }
        get isClient() {
            return this.socket.isClient;
        }
        get isConnect() {
            return this.socket.isConnect;
        }
        send(bytes) {
            this.socket.send(bytes);
        }
        addRemote(remote) {
            this.socket.addRemote(remote);
        }
        awaitClose() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.socket.awaitClose();
            });
        }
        close() {
            this.socket.close();
        }
        onReceive(message) {
            this.socket.onReceive(message);
        }
        add(cmd, back, thisObj) {
            this.socket.add(cmd, back, thisObj);
        }
        addOnce(cmd, back, thisObj) {
            this.socket.addOnce(cmd, back, thisObj);
        }
        remove(cmd, back, thisObj) {
            this.socket.remove(cmd, back, thisObj);
        }
        addZero(cmd, back, thisObj) {
            this.socket.addZero(cmd, back, thisObj);
        }
        removeZero(cmd, back, thisObj) {
            this.socket.removeZero(cmd, back, thisObj);
        }
        addZeroOnce(cmd, back, thisObj) {
            this.socket.addZeroOnce(cmd, back, thisObj);
        }
    }
    lib.InsideClient = InsideClient;
})(lib || (lib = {}));
global.lib = lib;
