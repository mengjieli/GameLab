using System.Collections.Generic;

namespace lib
{
    public class CSV
    {
        //"name,value\r\nmonsterEnterTime,\"400,500\"\r\ntipStartTime,300\r\ntipEndTime,500\r\ntipGapTime,500\r\noperateSrartTime,500\r\noperateEndTime,500\r\nmonsterExitTime,500\r\nlevelGapTime,500\r\ngameOverLevel,5\r\nperfectTime,100\r\ngoodTime,200\r\nmissTime,300\r\ntipHandTime,200\r\ntipEffectTime,200\r\nfaceChangeTime,500\r\n"
        public static List<List<string>> Parse(string content)
        {
            List<List<string>> list = new List<List<string>>();
            content = StringUtils.Replace(content, '\r', '\n');
            content = StringUtils.Replace(content, "\n\n", '\n');
            List<string> array = StringUtils.Split(content, '\n');
            for(int i = 0, len = array.Count; i < len; i++)
            {
                List<string> row = new List<string>();
                list.Add(row);
                int start = 0;
                int end = start;
                bool special = false;
                string rowStr = array[i];
                for (int c = 0,clen = array[i].Length; c < clen; c++)
                {
                    if (rowStr[c] == '"')
                    {
                        if(special == false)
                        {
                            special = true;
                            start = c + 1;
                            end = start;
                        }
                        else
                        {
                            if(c + 1 < clen && rowStr[c + 1] == '"')
                            {
                                c++;
                                end += 2;
                            }
                            else
                            {
                                end++;
                                if (c == clen - 1)
                                {
                                    row.Add(StringUtils.Slice(rowStr, start, end));
                                }
                                special = false;
                            }
                        }
                    }
                    else if(rowStr[c] == ',')
                    {
                        if(!special)
                        {
                            row.Add(StringUtils.Slice(rowStr, start, end));
                            start = c + 1;
                            end = start;
                        }
                    }
                    else
                    {
                        end++;
                        if(c == clen - 1)
                        {
                            row.Add(StringUtils.Slice(rowStr, start, end));
                        }
                    }
                }
            }
            return list;
        }
    }
}