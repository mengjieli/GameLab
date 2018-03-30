namespace lib {

    export class CommandVO {

        private _name: string;

        private _commandClass: any;

        private _messageClass: any;

        constructor(name: string, commandClass: any, messageClass: any = null) {
            this._name = name;
            this._commandClass = commandClass;
            this._messageClass = messageClass;
        }

        public get name(): string {
            return this._name;
        }

        public get commandClass(): any {
            return this._commandClass;
        }

        public get messageClass(): any {
            return this._messageClass;
        }
    }
}