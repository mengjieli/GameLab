using System;
using System.Collections;

namespace lib
{
    public class BoolValue : SimpleValue
    {
        public BoolValue(object value = null)
        {
            this.value = value ?? 0;
        }

        /// <summary>
        /// 设置当前值
        /// </summary>
        /// <param name="val"></param>
        protected override void SetValue(object val)
        {
            if (!(val is bool))
            {
                val = Convert.ToBoolean(val);
            }
            if (value == val)
            {
                return;
            }
            old = value;
            value = val;
            DispatchWith(Event.CHANGE);
        }
    }
}