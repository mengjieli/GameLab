using System;
using System.Collections;

namespace lib
{
    public class IntValue : SimpleValue
    {
        public IntValue(object value = null)
        {
            this.value = value ?? 0;
        }

        /// <summary>
        /// 设置当前值
        /// </summary>
        /// <param name="val"></param>
        protected override void SetValue(object val)
        {
            if (value == val)
            {
                return;
            }
            if(!(val is int))
            {
               val = (int)Convert.ToDouble(val);
            }
            old = value;
            if(defendFalsify) //加上防篡改功能
            {
                DefendEncode(val);
            }
            else
            {
                value = val;
            }
            DispatchWith(Event.CHANGE);
        }

        /// <summary>
        /// 防篡改反序列化
        /// </summary>
        protected override void DefendDecode()
        {
            ArrayList list = defendValue as ArrayList;
            string str = "";
            for (int i = 0, len = list.Count; i < len; i++)
            {
                str += list[i].ToString();
            }
            value = Convert.ToInt64(str);
        }
    }
}