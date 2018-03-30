namespace lib {
    export class ParamType {

        public static INT: string = "int";

        public static UINT: string = "uint";

        public static STRING: string = "string";

        public static BOOLEAN: string = "boolean";

        public static VOID: string = "void";

        public static NONE: string = "*";

        public static UNKONW: string = "";

        public static getType(type: string): string {
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
}