using System;
using System.Collections;
using System.Collections.Generic;

namespace lib
{
    public class XMLElement
    {
        public List<XMLNameSpace> Namesapces;
        public List<XMLAttribute> Attributes;
        public List<XMLElement> List;
        public string Name;
        public string Value;

        public XMLElement()
        {
            Namesapces = new List<XMLNameSpace>();
            Attributes = new List<XMLAttribute>();
            List = new List<XMLElement>();
            Value = "";
        }

        public XMLNameSpace getNameSapce(string name)
        {
            for (int i = 0; i < Namesapces.Count; i++)
            {
                if ((Namesapces[i] as XMLNameSpace).Name == name)
                {
                    return Namesapces[i] as XMLNameSpace;
                }
            }
            return null;
        }

        public XMLElement getElementByAttribute(string atrName, string value)
        {
            for (int i = 0; i < List.Count; i++)
            {
                for (int a = 0; a < List[i].Attributes.Count; a++)
                {
                    if (List[i].Attributes[a].Name == atrName && List[i].Attributes[a].Value == value)
                    {
                        return List[i];
                    }
                }
            }
            return null;
        }

        private void ParseString(string content)
        {
            int delStart = -1;
            for (int i = 0; i < content.Length; i++)
            {
                if (content[i] == "\r"[0] || content[i] == "\n"[0])
                {
                    content = StringUtils.Slice(content, 0, i) + StringUtils.Slice(content, i + 1, content.Length);
                    i--;
                }
                if (delStart == -1 && StringUtils.Slice(content, i, i + 4) == "<!--")
                {
                    delStart = i;
                }
                if (delStart != -1 && StringUtils.Slice(content, i, i + 3) == "-->")
                {
                    content = StringUtils.Slice(content, 0, delStart) + StringUtils.Slice(content, i + 1, content.Length);
                    i = i - (i - delStart + 1);
                    delStart = -1;
                }
            }
            readInfo(content);
        }

        private int readInfo(string content, int startIndex = 0)
        {
            int leftSign = -1;
            int len = content.Length;
            string c;
            int i,j;
            //第一步，寻找name
            for (i = startIndex; i < len; i++)
            {
                c = StringUtils.Slice(content, i, i + 1);
                if (c == "<")
                {
                    //找名字的开始
                    for (j = i + 1; j < len; j++)
                    {
                        c = StringUtils.CharToString(content[j]);
                        if (c != " " && c != "\t")
                        {
                            i = j;
                            break;
                        }
                    }
                    //找名字的结尾
                    for (j = i + 1; j < len; j++)
                    {
                        c = StringUtils.CharToString(content[j]);
                        if (c == " " || c == "\t" || c == "/" || c == ">")
                        {

                            this.Name = StringUtils.Slice(content, i, j);

                            i = j;
                            break;

                        }
                    }
                    break;
                }
            }

            //第二步，找属性
            bool end = false;
            XMLAttribute attribute = null;
            XMLNameSpace nameSpace = null;
            for (; i < len; i++)
            {
                c = StringUtils.CharToString(content[i]);
                if (c == "/")
                {
                    end = true;
                }
                else if (c == ">")
                {
                    i++;
                    break;
                }
                else if (c == " " || c == "\t")
                {

                }
                else
                {
                    //先寻找=号左边的名称
                    for (j = i + 1; j < len; j++)
                    {
                        c = StringUtils.CharToString(content[j]);
                        if (c == "=" || c == " " || c == "\t")
                        {
                            string atrName = StringUtils.Slice(content, i, j);
                            if (StringUtils.Split(atrName,":").Count == 2)
                            {
                                nameSpace = new XMLNameSpace();
                                this.Namesapces.Add(nameSpace);
                                nameSpace.Name = StringUtils.Split(atrName, ":")[1];
                            }
                            else
                            {
                                attribute = new XMLAttribute();
                                this.Attributes.Add(attribute);
                                attribute.Name = atrName;
                            }
                            break;
                        }
                    }

                    //寻找=号右边的字符
                    //寻找开始 " 符号
                    j++;
                    string startSign = "";
                    for (; j < len; j++)
                    {
                        c = StringUtils.CharToString(content[j]);
                        if (c == "\"" || c == "'")
                        {
                            i = j + 1;
                            startSign = c;
                            break;
                        }
                    }

                    //寻找=号右边的字符
                    //寻找结束 " 符号
                    j++;

                    for (; j < len; j++)
                    {
                        c = StringUtils.CharToString(content[j]);
                        if (c == startSign && StringUtils.CharToString(content[j-1]) != "\\")
                        {
                            if (attribute != null)
                            {
                                attribute.Value = StringUtils.Slice(content, i, j);
                                attribute = null;
                            }
                            else
                            {
                                nameSpace.Value = StringUtils.Slice(content, i, j);
                                nameSpace = null;
                            }
                            i = j;
                            break;
                        }
                    }
                }
            }

            if (end == true) return i;

            //第二步，解析内容，和定位结尾
            //寻找下一个<
            int contentStart = 0;
            for (; i < len; i++)
            {
                c = StringUtils.CharToString(content[i]);
                if (c != " " && c != "\t")
                {
                    contentStart = i;
                    i--;
                    break;
                }
            }
            for (; i < len; i++)
            {
                c = StringUtils.CharToString(content[i]);
                if (c == "<")
                {
                    //略去前面的" "和"\t"
                    for (j = i + 1; j < len; j++)
                    {
                        c = StringUtils.CharToString(content[j]);
                        if (c != " " && c != "\t")
                        {
                            break;
                        }
                    }
                    //寻找第一个字符，如果是/则表示找到了结尾，否则继续寻找结尾
                    if (c == "/")
                    {
                        for (j = i + 1; j < len; j++)
                        {
                            c = StringUtils.CharToString(content[j]);
                            if (c == " " || c == "\t" || c == ">")
                            {
                                string endName = StringUtils.Slice(content, i + 2, j);
                                if (endName != Name)
                                {
                                    throw new Exception("开始标签和结尾标签不一致，开始标签：" + Name + " ，结尾标签：" + endName);
                                }
                                break;
                            }
                        }
                        if (this.List.Count == 0) //寻找中间的字符串内容

                        {
                            i--;
                            for (; i >= 0; i--)
                            {
                                c = StringUtils.CharToString(content[i]);
                                if (c != " " && c != "\t")
                                {
                                    break;
                                }
                            }
                            Value += StringUtils.Slice(content, contentStart, i + 1);
                        }
                        //寻找>结束符
                        for (; j < len; j++)

                        {
                            c = StringUtils.CharToString(content[j]);
                            if (c == ">")
                            {
                                i = j + 1;
                                break;
                            }
                        }
                        end = true;
                        break;
                    }
                    else
                    {
                        XMLElement element = new XMLElement();

                        this.List.Add(element);

                        i = element.readInfo(content, i) - 1;

                    }
                }
            }
            return i;
        }

        public static XMLElement Parse(string content)
        {
            XMLElement xml = new XMLElement();
            xml.ParseString(content);
            return xml;
        }
    }
}