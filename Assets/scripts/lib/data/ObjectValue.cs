using System.Collections;

namespace lib
{
    public abstract class ObjectValue : ValueBase
    {
        public string Value
        {
            get { return Encode(); }
            set { Decode(value); }
        }

        /// <summary>
        /// 范序列化
        /// </summary>
        /// <param name="val"></param>
        protected abstract void Decode(string val);

        /// <summary>
        /// 序列化
        /// </summary>
        /// <returns></returns>
        protected abstract string Encode();
    }
}