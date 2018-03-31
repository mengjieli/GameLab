using System;
using System.Collections.Generic;
using System.Text;
using UnityEngine;

namespace lib
{
    public struct KeyValue
    {
        string Key;
        object Value;
    }

    public class StringUtils
    {

        /// <summary>
        /// 返回字符串从第 start 到 end (不包含) 的元素 ，比如 Slice("abcd",1,3) 会返回 "bc"
        /// </summary>
        /// <param name="str"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        public static string Slice(string str,int start,int end)
        {
            start = start < 0 ? 0 : start;
            end = end > str.Length ? str.Length : end;
            List<char> list = new List<char>();
            for(int i = start; i < end; i++)
            {
                list.Add(str[i]);
            }
            return new string(list.ToArray());
        }

        public static string CharToString(char c)
        {
            char[] chars = new char[1];
            chars[0] = c;
            return new string(chars);
        }

        /// <summary>
        /// 分割字符串
        /// </summary>
        /// <param name="str"></param>
        /// <param name="split"></param>
        /// <returns></returns>
        public static List<string> Split(string str,string split)
        {
            int last = 0;
            List<string> list = new List<string>();
            for(int i = 0, len = str.Length; i < len; i++)
            {
                if(Slice(str,i,i + split.Length) == split)
                {
                    list.Add(Slice(str, last, i));
                    last = i + split.Length;
                }
            }
            list.Add(Slice(str, last, str.Length));
            return list;
        }

        public static List<string> Split(string str, char split)
        {
            int last = 0;
            List<string> list = new List<string>();
            for (int i = 0, len = str.Length; i < len; i++)
            {
                if (str[i] == split)
                {
                    list.Add(Slice(str, last, i));
                    last = i + 1;
                }
            }
            list.Add(Slice(str, last, str.Length));
            return list;
        }

        /// <summary>
        /// 把任意类型转换成数组，如果不是数字类型会返回 null
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static object ToNumber(string str)
        {
            int code0 = (int)'0';
            int code9 = (int)'9';
            int codeP = (int)'.';
            int codeM = (int)'-';
            bool isMinus = false;
            bool isNumber;
            bool hasPoint = false;
            string before = "";
            string end = "";
            int code;
            bool flag = true;
            for (var p = 0; p < str.Length; p++)
            {
                code = (int)str[p];
                if(code == codeM && p == 0)
                {
                    isMinus = true;
                }
                else if (hasPoint)
                {
                    if (code >= code0 && code <= code9)
                    {
                        end += str[p];
                    }
                    else
                    {
                        flag = false;
                        break;
                    }
                }
                else
                {
                    if (code == codeP)
                    {
                        hasPoint = true;
                    }
                    else if (code >= code0 && code <= code9)
                    {
                        before += str[p];
                    }
                    else
                    {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag)
            {
                if(hasPoint)
                {
                    double d = (isMinus ? -1 : 1) * (Convert.ToInt32(before) + (end != "" ? Convert.ToInt32(end) / (Math.Pow(10, end.Length)) : 0));
                    float f = (float)d;
                    return f;
                }
                else
                {
                    return (isMinus ? -1 : 1) * (Convert.ToInt32(before));
                }
            }
            return null;
        }
        
        /// <summary>
        /// 删除特定字符
        /// </summary>
        /// <param name="str"></param>
        /// <param name="delete"></param>
        /// <returns></returns>
        public static string Delete(string str,char deleteChar)
        {
            for(int i = 0; i < str.Length; i++)
            {
                if(str[i] == deleteChar)
                {
                    str = Slice(str, 0, i) + Slice(str, i + 1, str.Length);
                    i--;
                }
            }
            return str;
        }

        public static string Delete(string str, string deleteString)
        {
            for (int i = 0; i < str.Length; i++)
            {
                if (Slice(str,i,i+ deleteString.Length) == deleteString)
                {
                    str = Slice(str, 0, i) + Slice(str, i + 1, str.Length);
                    i -= deleteString.Length;
                }
            }
            return str;
        }

        /// <summary>
        /// 替换字符
        /// </summary>
        /// <param name="str"></param>
        /// <param name="findChar"></param>
        /// <param name="replaceChar"></param>
        /// <returns></returns>
        public static string Replace(string str, char findChar,char replaceChar)
        {
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] == findChar)
                {
                    str = Slice(str, 0, i) + replaceChar + Slice(str, i + 1, str.Length);
                    i--;
                }
            }
            return str;
        }

        public static string Replace(string str, char findChar, string replaceString)
        {
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] == findChar)
                {
                    str = Slice(str, 0, i) + replaceString + Slice(str, i + 1, str.Length);
                    i--;
                }
            }
            return str;
        }

        public static string Replace(string str,string findString,char replaceChar)
        {
            for (int i = 0; i < str.Length; i++)
            {
                if (Slice(str,i,i + findString.Length) == findString)
                {
                    str = Slice(str, 0, i) + replaceChar + Slice(str, i + findString.Length, str.Length);
                    i--;
                }
            }
            return str;
        }

        public static string Replace(string str,string findString,string relpaceString)
        {
            for (int i = 0; i < str.Length; i++)
            {
                if (Slice(str, i, i + findString.Length) == findString)
                {
                    str = Slice(str, 0, i) + relpaceString + Slice(str, i + findString.Length, str.Length);
                    i--;
                }
            }
            return str;
        }
    }
}