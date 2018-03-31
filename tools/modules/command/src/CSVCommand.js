require("./../../../lib/lib")

class Main
{
    constructor()
    {
        this.createCSharp();
    }

    createCSharp()
    {
        var url =  "./../../../../Assets/Resources/config/";
        var output = "./../../../../Assets/scripts/model/vo/config/";

        var file = new lib.File(url);
        var list = file.getFileListWithEnd("csv");
        var all = this.getFileDesc();
        all += "using UnityEngine;\n";
        all += "\n";
        all += "public class ConfigDecode\n";
        all += "{\n";
        all += "\tpublic static void Decode()\n";
        all += "\t{\n";
        var all2 = "";
        for(var i = 0; i < list.length; i++)
        {
            var content = list[i].getContent();
            content = lib.StringUtils.replaceString(content,"\r","\n");
            content = lib.StringUtils.replaceString(content,"\n\n","\n");
            var line = content.split("\n")[0];
            line = lib.StringUtils.replaceString(line,"\n","");
            var heads = line.split(",");
            line = content.split("\n")[1];
            line = lib.StringUtils.replaceString(line,"\n","");
            var names = line.split(",");
            this.creatCSharpFile(list[i].name,heads,names);
            all += "\t\t" + list[i].name + "Config.DecodeTable(Resources.Load(\"config/" + list[i].name + "\") + \"\");\n"
            all2 += "\t\t" + list[i].name + "Config.DecodeTableItem();\n"
        }
        all += all2;
        all += "\t}\n";
        all += "}";
        (new lib.File(output + "ConfigDecode.cs").save(all));
    }

    getFileDesc()
    {
        var date = new Date();
        return "//Make By CSVCommand. Time " + date.getFullYear() + "." + (date.getMonth() + 1) + "." + (date.getDate()) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "\n";
    }

    //c#解析方式
    creatCSharpFile(name,heads,names)
    {
        var url = "./../../../../Assets/scripts/model/vo/config/";
        var date = new Date();
        var content = this.getFileDesc();
        content += "using System.Collections.Generic;\n";
        content += "using lib;\n";
        content += "\n";
        content += "public class " + name + "Config\n";
        content += "{\n";
        content += "\tprivate List<string> list;\n";
        var decode = "\tpublic void Decode(List<string> list)\n";
        decode += "\t{\n";
        decode += "\t\tthis.list = list;\n";
        decode += "\t\tfor(int i = 0; i < list.Count; i++)\n";
        decode += "\t\t{\n";
        var decodeItem = "\tpublic void DecodeConfigItem()\n";
        decodeItem += "\t{\n";
        decodeItem += "\t\tfor (int i = 0; i < list.Count; i++)\n";
        decodeItem += "\t\t{\n";
        var memebrs = [];
        for(var i = 0; i < heads.length; i++)
        {
            var member = new Member(i,heads[i],names[i],names[0]);
            memebrs.push(member);
            content += "\t" + member.getCSharpDefine() + "\n";
            if(member.type == TypeEnum.INT || member.type == TypeEnum.STRING || (member.type == TypeEnum.ARRAY && member.arrayType != ArrayEnum.CONFIG))
            {
                decode += "\t\t\tif(i == " + i + ")\n";
                decode += "\t\t\t{\n";
                decode += "\t\t\t\t" + member.getCSharpDecode("\t\t\t\t") + "\n";
                decode += "\t\t\t}\n";
            }
            else if(member.type == TypeEnum.CONFIG || (member.type == TypeEnum.ARRAY && member.arrayType == ArrayEnum.CONFIG))
            {
                decodeItem += "\t\t\tif (i == " + i + ")\n"
                decodeItem += "\t\t\t{\n";
                decodeItem += "\t\t\t\t" + member.getCSharpDecode("\t\t\t\t") + "\n";
                decodeItem += "\t\t\t}\n";
            }
        }
        decode += "\t\t}\n";
        decode += "\t}\n";
        decodeItem += "\t\t}\n";
        decodeItem += "\t\tlist = null;\n";
        decodeItem += "\t}\n";
        decodeItem += "\n";
        content += "\n";
        content += decode;
        content += "\n";

        content += decodeItem;
        content += "\n";

        content += "\tpublic static List<" + name + "Config> Configs = new List<" + name + "Config>();\n";
        content += "\n";

        content += "\tpublic static " + name + "Config GetConfig(" + memebrs[0].getCSharpType() + " key)\n";
        content += "\t{\n";
        content += "\t\tfor(int i = 0; i < Configs.Count; i++)\n";
        content += "\t\t{\n";
        content += "\t\t\tif(Configs[i].Id == key)\n";
        content += "\t\t\t{\n";
        content += "\t\t\t\treturn Configs[i];\n";
        content += "\t\t\t}\n";
        content += "\t\t}\n";
        content += "\t\treturn null;\n";
        content += "\t}\n";
        content += "\n";

        content += "\tpublic static void DecodeTable(string str)\n";
        content += "\t{\n";
        content += "\t\tstr = StringUtils.Replace(str, '\\r', '\\n');\n";
        content += "\t\tstr = StringUtils.Replace(str, \"\\n\\n\", '\\n');\n";
        content += "\t\tList<List<string>> list = CSV.Parse(str);\n";
        content += "\t\tfor(int i = 2,len = list.Count; i < len; i++)\n";
        content += "\t\t{\n";
        content += "\t\t\t" + name + "Config item = new " + name + "Config();\n";
        content += "\t\t\titem.Decode(list[i]);\n";
        content += "\t\t\tConfigs.Add(item);\n";
        content += "\t\t}\n";
        content += "\t}\n";
        content += "\n";

        content += "\tpublic static void DecodeTableItem()\n";
        content += "\t{\n";
        content += "\t\tfor(int i = 0,len = Configs.Count; i < len; i++)\n";
        content += "\t\t{\n";
        content += "\t\t\tConfigs[i].DecodeConfigItem();\n";
        content += "\t\t}\n";
        content += "\t}\n";
        content += "\n";

        content += "}";

        (new lib.File(url + name + "Config.cs")).save(content);
    }
}

class Member
{

    constructor(index,str,name,keyName)
    {
        this.index = index;
        this.name = name;
        this.keyName = keyName;

        //1.int 2.string  3.Config  4.Array
        this.type = 0;

        //1.int  2.string  3.Config
        this.arrayType = 0;

        //1.int 2.string
        this.realType = 0;

        //表格名称
        this.configName = "";

        if(str[0] == "(")
        {
            this.configName = str.slice(1,str.indexOf(")"));
            str = str.slice(str.indexOf(")") + 1,str.length);
            this.type = TypeEnum.CONFIG;
        }
        if(str.slice(0,"Array".length) == "Array")
        {
            this.type = TypeEnum.ARRAY;
            str = str.slice("Array(".length,str.length-1);
            if(this.configName == "")
            {
                if(str == "int") this.arrayType = ArrayEnum.INT;
                if(str == "string") this.arrayType = ArrayEnum.STRING;
            }
            else
            {
                this.arrayType = ArrayEnum.CONFIG;
                if(str == "int") this.realType = RealEnum.INT;
                if(str == "string") this.realType = RealEnum.STRING;
            }
        }
        if(!this.type)
        {
            if(str == "int") this.realType = this.type = RealEnum.INT;
            if(str == "string") this.realType = this.type = RealEnum.STRING;
        }
    }


    getCSharpDefine()
    {
        var content =  "public " + this.getCSharpType() + " " + this.name;
        if(this.type == TypeEnum.ARRAY)
        {
            content += " = new " + this.getCSharpType() + "()";
        }
        content += ";";
        return content;
    }

    getCSharpType()
    {
        if(this.type == TypeEnum.INT)
        {
            return "int";
        }
        if(this.type == TypeEnum.STRING)
        {
            return "string";
        }
        if(this.type == TypeEnum.CONFIG)
        {
            return this.configName + "Config";
        }
        if(this.type == TypeEnum.ARRAY)
        {
            if(this.arrayType == ArrayEnum.INT)
            {
                return "List<int>";
            }
            if(this.arrayType == ArrayEnum.STRING)
            {
                return "List<string>";
            }
            if(this.arrayType == ArrayEnum.CONFIG)
            {
                return "List<" + this.configName + "Config>";
            }
        }
    }

    getCSharpDecode(before = "")
    {
        if(this.type == TypeEnum.INT)
        {
            return this.name += " = (int)StringUtils.ToNumber(list[" + this.index + "]);";
        }
        else if(this.type == TypeEnum.STRING)
        {
            return this.name += " = list[" + this.index + "];";
        }
        else if(this.type == TypeEnum.CONFIG)
        {
            var content = this.name + " = " + this.configName + "Config.GetConfig(" + this.keyName + ");";
            return content;
        }
        else if(this.type == TypeEnum.ARRAY)
        {
            var content = "List<string> itemList = StringUtils.Split(list[" + this.index + "],',');\n";
            content += before + "for(int n = 0; n < itemList.Count; n++)\n";
            content += before + "{\n";
            if(this.realType == RealEnum.INT)
            {
                content += before + "\tint item = (int)StringUtils.ToNumber(itemList[n]);\n";
            }
            else if(this.realType == RealEnum.STRING)
            {
                content += before + "\tint item = itemList[n];\n";
            }
            if(this.arrayType == ArrayEnum.INT || this.arrayType == ArrayEnum.STRING)
            {
                content += before + "\t" + this.name + ".Add(item);\n";
            }
            else if(this.arrayType == ArrayEnum.CONFIG)
            {
                content += before + "\t" + this.name + ".Add(" + this.configName + "Config.GetConfig(item));\n";
            }
            content += before + "}";
            return content;
        }
    }
}

class TypeEnum
{
}
TypeEnum.INT = 1;
TypeEnum.STRING = 2;
TypeEnum.CONFIG = 3;
TypeEnum.ARRAY = 4;

class ArrayEnum
{
}
ArrayEnum.INT = 1;
ArrayEnum.STRING = 2;
ArrayEnum.CONFIG = 3;

class RealEnum
{

}
RealEnum.INT = 1;
RealEnum.STRING = 2;

new Main();