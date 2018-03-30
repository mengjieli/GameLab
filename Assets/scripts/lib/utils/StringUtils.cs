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
    }
}