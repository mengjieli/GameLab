using System;
using System.Collections.Generic;

namespace lib
{
    //Json 解析的当前步骤
    enum Step {
        WaitOutValue, //等待查找最外层 value
        EnterOutValue, //进入最外层 value
        WaitObjectKeyOrEnd, //等待查找 Object key 或者 Object 结束符 '}'
        EnterObjectKey, //进入 Object key
        WaitObjectValueSign, //等待查找 Object ':' 
        WaitObjectValue, //等待查找 Object value
        EnterObjectValue, //进入 Object value 
        WaitObjectSplitOrEnd, //等待查找 Object 的 分隔符 ',' 或者 结束符 '}'
        WaitArrayValueOrEnd, //等待查找 Array 的下一个 Value 或者 结束符号 ']' 
        EnterArrayValue, //进入 Array value
        WaitArraySplitOrEnd, //等待查找 Array 的 分隔符 ',' 或者 结束符号 '}'
        Over //查找到最外层的 value 等待结束
    };

    public class JSON
    {
        public static object Parse(string str)
        {
            List<object> values = new List<object>();
            object  currentValue = null;
            //当前 key
            string key = "";
            //当前对象的父对象
            object parentValue = null;
            //参见 FindType
            Step type = Step.WaitOutValue;
            //当前 key 或 value 的开始位置
            int start = -1;
            bool findNumber = false;
            for (int i = 0, len = str.Length; i < len; i++)
            {
                if (str[i] == '{')
                {
                    //等待查找最外层 value  等待查找 Object value  查找 Array value
                    if (type == Step.WaitOutValue || type == Step.WaitObjectValue || type == Step.WaitArrayValueOrEnd)
                    {
                        values.Add(new Dictionary<string, object>());
                        parentValue = currentValue;
                        currentValue = values[values.Count - 1];
                        type = Step.WaitObjectKeyOrEnd;
                    }
                    else if (type != Step.EnterOutValue || type != Step.EnterObjectKey || type != Step.EnterObjectValue)
                    {
                        throw new Exception("Json 解析错误，错误的符号 '{'");
                    }
                }
                else if (str[i] == '}')
                {
                    if (findNumber)
                    {
                        if (type == Step.EnterOutValue)
                        {
                            object val = StringUtils.ToNumber(StringUtils.Slice(str, start, i));
                            if (val != null)
                            {
                                values.Add(val);
                                findNumber = false;
                                type = Step.Over;
                            }
                            else
                            {
                                throw new Exception("Json 解析数字错误");
                            }
                        }
                    }
                    if(type == Step.WaitObjectKeyOrEnd || type == Step.WaitObjectSplitOrEnd)
                    {
                        if (values.Count > 0)
                        {
                            values.RemoveAt(values.Count - 1);
                            if (parentValue != null) //如果是 数组或 Object 之中
                            {
                                if (parentValue is List<object>)  //如果父对象是数组
                                {
                                    (parentValue as List<object>).Add(currentValue);
                                    type = Step.WaitArraySplitOrEnd;
                                }
                                else //否则就是 object
                                {
                                    (parentValue as Dictionary<string, object>).Add(key, currentValue);
                                    type = Step.WaitObjectSplitOrEnd;
                                }
                                currentValue = values[values.Count - 1];
                                parentValue = values.Count > 1 ? values[values.Count - 2] : null;
                            }
                            else //如果是最外层的 value
                            {
                                values.Add(currentValue);
                                currentValue = null;
                                parentValue = null;
                                type = Step.Over;
                            }
                        }
                    }
                    else
                    {
                        throw new Exception("Json 解析错误，错误的符号 '}'");
                    }
                }
                else if (str[i] == ':')
                {
                    if (type == Step.WaitObjectValueSign)
                    {
                        type = Step.WaitObjectValue;
                    }
                    else if (type != Step.EnterOutValue || type != Step.EnterObjectKey || type != Step.EnterObjectValue)
                    {
                        throw new Exception("Json 解析错误，错误的符号 ':'");
                    }
                }
                else if (str[i] == '[')
                {
                    if (type == Step.WaitOutValue || type == Step.WaitObjectValue || type == Step.WaitArrayValueOrEnd)
                    {
                        values.Add(new List<object>());
                        parentValue = currentValue;
                        currentValue = values[values.Count - 1];
                        type = Step.WaitArrayValueOrEnd;
                    }
                    else if (type != Step.EnterOutValue || type != Step.EnterObjectKey || type != Step.EnterObjectValue)
                    {
                        throw new Exception("Json 解析错误，错误的符号 '['");
                    }
                }
                else if (str[i] == ']')
                {
                    if (findNumber)
                    {
                        if (type == Step.EnterArrayValue)
                        {
                            object val = StringUtils.ToNumber(StringUtils.Slice(str, start, i));
                            if (val != null)
                            {
                                (currentValue as List<object>).Add(val);
                                findNumber = false;
                                type = Step.WaitArraySplitOrEnd;
                            }
                            else
                            {
                                throw new Exception("Json 解析数字错误");
                            }
                        }
                    }
                    if (type == Step.WaitArrayValueOrEnd || type == Step.WaitArraySplitOrEnd)
                    {
                        if (values.Count > 0)
                        {
                            values.RemoveAt(values.Count - 1);
                            if (parentValue != null) //如果是 数组或 Object 之中
                            {
                                if (parentValue is List<object>)  //如果父对象是数组
                                {
                                    (parentValue as List<object>).Add(currentValue);
                                    type = Step.WaitArraySplitOrEnd;
                                }
                                else //否则就是 object
                                {
                                    (parentValue as Dictionary<string, object>).Add(key, currentValue);
                                    type = Step.WaitObjectSplitOrEnd;
                                }
                                currentValue = values[values.Count - 1];
                                parentValue = values.Count > 1 ? values[values.Count - 2] : null;
                            }
                            else //如果是最外层的 value
                            {
                                values.Add(currentValue);
                                currentValue = null;
                                parentValue = null;
                                type = Step.Over;
                            }
                        }
                        else
                        {
                            throw new Exception("Json 解析错误，错误的符号 ']'");
                        }
                    }
                    else
                    {
                        throw new Exception("Json 解析错误，错误的符号 ']'");
                    }
                }
                else if (str[i] == '"')
                {
                    if (type == Step.WaitOutValue) 
                    {
                        type = Step.EnterOutValue;
                        start = i + 1;
                    }
                    else if(type == Step.EnterOutValue)
                    {
                        values.Add(StringUtils.Slice(str,start,i));
                    }
                    else if(type == Step.WaitObjectKeyOrEnd)
                    {
                        type = Step.EnterObjectKey;
                        start = i + 1;
                    }
                    else if (type == Step.EnterObjectKey)
                    {
                        key = StringUtils.Slice(str, start, i);
                        type = Step.WaitObjectValueSign;
                    }
                    else if (type == Step.WaitObjectValue)
                    {
                        type = Step.EnterObjectValue;
                        start = i + 1;
                    }
                    else if (type == Step.EnterObjectValue)
                    {
                        (currentValue as Dictionary<string, object>).Add(key, StringUtils.Slice(str, start, i));
                        type = Step.WaitObjectSplitOrEnd;
                    }
                    else if(type == Step.WaitArrayValueOrEnd)
                    {
                        type = Step.EnterArrayValue;
                        start = i + 1;
                    }
                    else if (type == Step.EnterArrayValue)
                    {
                        (currentValue as List<object>).Add(StringUtils.Slice(str, start, i));
                    }
                    else
                    {
                        throw new Exception("Json 解析错误，错误的符号 '\''");
                    }
                }
                else if (str[i] == '\\')
                {
                    i++;
                }
                else if (str[i] == ',')
                {
                    if (type == Step.EnterObjectValue)
                    {
                        if (findNumber)
                        {
                            object val = StringUtils.ToNumber(StringUtils.Slice(str, start, i));
                            if (val != null)
                            {
                                (currentValue as Dictionary<string, object>).Add(key, val);
                                findNumber = false;
                            }
                            else
                            {
                                throw new Exception("Json 解析数字错误");
                            }
                            type = Step.WaitObjectKeyOrEnd;
                        }
                    }
                    else if(type == Step.WaitObjectSplitOrEnd)
                    {
                        type = Step.WaitObjectKeyOrEnd;
                    }
                    else if (type == Step.EnterArrayValue)
                    {
                        if (findNumber)
                        {
                            object val = StringUtils.ToNumber(StringUtils.Slice(str, start, i));
                            if (val != null)
                            {
                                (currentValue as List<object>).Add(val);
                                findNumber = false;
                            }
                            else
                            {
                                throw new Exception("Json 解析数字错误");
                            }
                            type = Step.WaitArrayValueOrEnd;
                        }
                    }
                    else if(type == Step.WaitArraySplitOrEnd)
                    {
                        type = Step.WaitArrayValueOrEnd;
                    }
                    else
                    {
                        throw new Exception("Json 解析错误，错误的符号 ','");
                    }
                }
                else if(str[i] == 'n')
                {
                    if (StringUtils.Slice(str, i, i + 4) == "null")
                    {
                        if (type == Step.WaitOutValue)
                        {
                            values.Add(null);
                            type = Step.Over;
                        }
                        else if (type == Step.WaitObjectValue)
                        {
                            (currentValue as Dictionary<string, object>).Add(key, null);
                            type = Step.WaitObjectSplitOrEnd;
                        }
                        else if (type == Step.WaitArrayValueOrEnd)
                        {
                            (currentValue as List<object>).Add(null);
                            type = Step.WaitArraySplitOrEnd;
                        }
                        i += 3;
                    }
                    else
                    {
                        throw new Exception("Json 解析错误，错误的值 ");
                    }
                }
                else if (str[i] == '0' || str[i] == '1' || str[i] == '2' || str[i] == '3' || str[i] == '4' || str[i] == '5' || str[i] == '6' || str[i] == '7' || str[i] == '8' || str[i] == '9' || str[i] == '-' || str[i] == '.')
                {
                    if(type == Step.WaitOutValue || type == Step.WaitObjectValue || type == Step.WaitArrayValueOrEnd)
                    {
                        findNumber = true;
                        start = i;
                        if(type == Step.WaitOutValue)
                        {
                            type = Step.EnterOutValue;
                        }
                        else if(type == Step.WaitObjectValue)
                        {
                            type = Step.EnterObjectValue;
                        }
                        else if(type == Step.WaitArrayValueOrEnd)
                        {
                            type = Step.EnterArrayValue;
                        }
                    }
                    else if(type != Step.EnterOutValue && type != Step.EnterObjectValue && type != Step.EnterArrayValue)
                    {
                        throw new Exception("Json 解析错误，错误的符号 '" + str[i] + "'");
                    }
                }
                else if(str[i] == ' ' || str[i] == '\t' || str[i] == '\v' || str[i] == '\r' || str[i] == '\n')
                {
                    if(findNumber)
                    {
                        if (type == Step.EnterOutValue)
                        {
                            object val = StringUtils.ToNumber(StringUtils.Slice(str, start, i));
                            if (val != null)
                            {
                                values.Add(val);
                                findNumber = false;
                                type = Step.Over;
                            }
                            else
                            {
                                throw new Exception("Json 解析数字错误");
                            }
                        }
                        else if(type == Step.EnterObjectValue)
                        {
                            object val = StringUtils.ToNumber(StringUtils.Slice(str, start, i));
                            if (val != null)
                            {
                                (currentValue as Dictionary<string, object>).Add(key, val);
                                findNumber = false;
                                type = Step.WaitObjectSplitOrEnd;
                            }
                            else
                            {
                                throw new Exception("Json 解析数字错误");
                            }
                        }
                        else if(type == Step.EnterArrayValue)
                        {
                            object val = StringUtils.ToNumber(StringUtils.Slice(str, start, i));
                            if (val != null)
                            {
                                (currentValue as List<object>).Add(val);
                                findNumber = false;
                                type = Step.WaitArraySplitOrEnd;
                            }
                            else
                            {
                                throw new Exception("Json 解析数字错误");
                            }
                        }
                    }
                }
            }
            return values[0];
        }
    }
}