namespace lib {

    var fs = require("fs");
    var path = require("path");

    export class File {

        //文件或文件夹 url
        private _url: string;
        //所属文件夹 url
        private _direction: string;
        //文件或文件夹名称
        private _name: string;
        //文件后缀名
        private _end: string;

        constructor(url: string) {
            if (url.charAt(url.length - 1) == "/") {
                url = url.slice(0, url.length - 1);
            }
            this._url = url;
            //如果文件或文件夹存在
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
                } else {
                    this._direction = this.url.slice(0, this.url.length - this._end.length - 1 - this.name.length);
                }
            }
        }

        /**
         * 保存文件内容
         * @param {string | Buffer} content
         * @param {string} url
         */
        public save(content: string | Buffer, url: string): void {
            url = url || this.url;
            var format = typeof content == "string" ? "utf-8" : "binary";
            if (url.split("/").length > 1 || url.split(".").length == 1) {
                if (url.split(".").length == 1) {
                    var dir = new File(url.slice(0, url.length - url.split("/")[url.split("/").length - 1].length));
                    if (dir.existence == false || !dir.isDirection) {
                        File.mkdir(url);
                    }
                } else {
                    File.mkdir(url.slice(0, url.length - url.split("/")[url.split("/").length - 1].length));
                }
            }
            fs.writeFileSync(url, content, format);
        }

        /**
         * 读取文件内容
         * @param {string} format 读取的格式
         * @returns {any}
         */
        public getContent(format: string = "utf-8"): any {
            if (!this.existence) {
                return null;
            }
            return fs.readFileSync(this.url, format);
        }

        /**
         * 读取某一后缀名或某些后缀名的文件列表
         * @param {string | string[]} ends 后缀名或后缀名列表
         * @returns {File[]} 文件列表
         */
        public getFileListWithEnd(ends: string | string[]): File[] {
            if (typeof ends == "string") {
                ends = [ends];
            }
            let files: File[] = [];
            if (!this.isDirection) {
                for (let i = 0; i < ends.length; i++) {
                    let end = ends[i];
                    if (end == "*" || end == this.end) {
                        files.push(this);
                    }
                }
            } else if (this.isDirection) {
                let list = fs.readdirSync(this.url);
                for (let i = 0; i < list.length; i++) {
                    let file = new File(this.url + "/" + list[i]);
                    files = files.concat(file.getFileListWithEnd(ends));
                }
            }
            return files;
        }

        /**
         * 获取文件夹列表，如果自身是文件夹则包涵自身
         * @returns {File[]}
         */
        public getDirectionList(): File[] {
            var files: File[] = [];
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

        /**
         * 删除文件或文件夹
         */
        public delete() {
            if (this.existence == false) {
                return;
            }
            if (!this.isDirection) {
                fs.unlinkSync(this.url);
            } else if (this.isDirection) {
                let list = fs.readdirSync(this.url);
                for (let i = 0; i < list.length; i++) {
                    let file = new File(this.url + "/" + list[i]);
                    file.delete();
                }
                try {
                    fs.rmdirSync(this.url);
                } catch (e) {
                    console.log(e);
                }
            }
        }


        public get url(): string {
            return this._url;
        }

        public get name(): string {
            return this._name;
        }

        public get end(): string {
            return this._end;
        }

        public get existence(): boolean {
            return fs.existsSync(this._url);
        }

        public get state(): any {
            return fs.statSync(this.url);
        }

        public get isDirection(): boolean {
            return this.state.isDirectory();
        }

        public get direction(): string {
            return this._direction;
        }

        public static mkdir(dirPath: string, mode: string = null) {
            if (!fs.existsSync(dirPath)) {
                var pathtmp: string;
                dirPath.split(path.sep).forEach(function (dirname) {
                    if (dirname == "") {
                        pathtmp = "/"
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
}