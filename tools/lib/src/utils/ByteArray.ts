namespace lib {

    export class ByteArray {

        //字节数组
        private bytes: number[];
        //读写指针的位置
        public position: number;
        //字节数
        private _length: number;

        /**
         * 构造函数
         */
        constructor() {
            this.bytes = [];
            this.position = 0;
            this.length = 0;
        }

        /**
         * 字节长度
         * @returns {number}
         */
        public get length(): number {
            return this._length;
        }

        public set length(val: number) {
            this._length = val;
        }

        /**
         * 剩余字节数
         * @returns {number}
         */
        public get bytesAvailable(): number {
            return this._length - this.position;
        }

        /**
         * 获取字节数组
         * @returns {number[]}
         */
        public get arrayData(): number[] {
            return this.bytes;
        }

        /**
         * 写一个字节
         * @param {number} val
         */
        public writeByte(val: number): void {
            val = val & 0xFF;
            this.bytes.splice(this.position, 0, val);
            this.length += 1;
            this.position += 1;
        }

        /**
         * 写一个 boolean 类型
         * @param {boolean} val
         */
        public writeBoolean(val: boolean): void {
            this.bytes.splice(this.position, 0, val == true ? 1 : 0);
            this.length += 1;
            this.position += 1;
        }

        /**
         * 写一个 Int
         * @param {number} val
         */
        public writeInt(val: number): void {
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

        /**
         * 写一个 UInt
         * @param {number} val
         */
        public writeUInt(val: number): void {
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

        /**
         * 写一个 utf-8 字符串，前面带长度
         * @param {string} val 要写入的字符串
         */
        public writeUTF(val: string): void {
            var arr = UTFChange.stringToBytes(val);
            this.writeUInt(arr.length);
            for (var i = 0; i < arr.length; i++) {
                this.bytes.splice(this.position, 0, arr[i]);
                this.position++;
            }
            this.length += arr.length;
        }

        /**
         * 写一个 utf 字符串的内容，不带长度
         * @param {string} val 要写入的字符串
         * @param {number} len 要写入的字符串长度
         */
        public writeUTFBytes(val: string, len: number): void {
            var arr = UTFChange.stringToBytes(val);
            for (var i = 0; i < len; i++) {
                if (i < arr.length)
                    this.bytes.splice(this.position, 0, arr[i]);
                else
                    this.bytes.splice(this.position, 0, 0);
                this.position++;
            }
            this.length += len;
        }

        /**
         * 写入一个 ByteArray 的部分内容
         * @param {ByteArray} byteArray 要写入的 ByteArray 对象
         * @param {number} start 从写入对象的哪里开始读取
         * @param {number} len 要写入的长度
         */
        public writeByteArray(byteArray: ByteArray, start: number = 0, len: number = 0): void {
            var copy = byteArray.bytes;
            for (var i = start; i < copy.length && i < start + len; i++) {
                this.bytes.splice(this.position, 0, copy[i]);
                this.position++;
            }
            this.length += len;
        }

        /**
         * 把整个数组内容写进来
         * @param {number[]} array
         */
        public writeArray(array: number[]): void {
            var bytes = this.bytes;
            for (var i = 0, len = array.length; i < len; i++) {
                bytes.push(array[i]);
            }
            this.length += this.bytes.length;
        }

        /**
         * 读取一个字节
         * @returns {number}
         */
        public readByte(): number {
            this.position++;
            return this.bytes[this.position - 1];
        }

        /**
         * 读取一个 bool 对象
         * @returns {boolean}
         */
        public readBoolean(): boolean {
            this.position++;
            return this.bytes[this.position - 1] ? true : false;
        }

        /**
         * 读取一个 UInt
         * @returns {number}
         */
        public readUInt(): number {
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

        /**
         * 读取一个 Int
         * @returns {number}
         */
        public readInt(): number {
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

        /**
         * 读取一个 utf-8 字符串
         * @returns {string}
         */
        public readUTF(): string {
            var len = this.readUInt();
            var val = UTFChange.bytesToString(this.bytes.slice(this.position, this.position + len));
            this.position += len;
            return val;
        }

        /**
         * 读取自定长度的 utf-8 字符串
         * @param {number} len
         * @returns {string}
         */
        public readUTFBytes(len: number): string {
            var val = UTFChange.bytesToString(this.bytes.slice(this.position, this.position + len));
            this.position += len;
            return val;
        }

        /**
         * 把内容转换成字符串
         * @returns {string}
         */
        public toString(): string {
            return JSON.stringify(this.bytes);
        }
    }
}