using System;
using System.Collections;

namespace lib
{
    public class FloatValue : SimpleValue
    {
        public FloatValue(object value = null)
        {
            this.value = value ?? 0;
        }

        /// <summary>
        /// 设置当前值
        /// </summary>
        /// <param name="val"></param>
        protected override void SetValue(object val)
        {
            if (!(val is float))
            {
                val = (float)Convert.ToDouble(val);
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