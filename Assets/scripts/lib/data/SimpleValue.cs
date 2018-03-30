using System.Collections;
using System.Security.Cryptography;

namespace lib
{
    public abstract class SimpleValue : ValueBase
    {
        /// <summary>
        /// 旧的值
        /// </summary>
        protected object old;

        /// <summary>
        /// 防篡改
        /// </summary>
        internal bool defendFalsify;

        /// <summary>
        /// 受保护后的值
        /// </summary>
        internal object defendValue;

        /// <summary>
        /// 防篡改的 md5
        /// </summary>
        internal MD5 defendMD5;

        /// <summary>
        /// 防篡改的 hash 值
        /// </summary>
        internal string defendHash;

        /// <summary>
        /// 当前值
        /// </summary>
        protected object value;

        /// <summary>
        /// 当前值
        /// </summary>
        public object Value
        {
            get { return value; }
            set { SetValue(value); }
        }

        /// <summary>
        /// 设置当前值
        /// </summary>
        /// <param name="val"></param>
        protected abstract void SetValue(object val);

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="defendFalsify"> 是否防篡改 </param>
        public SimpleValue(bool defendFalsify = false)
        {
            this.defendFalsify = defendFalsify;
            if(defendFalsify)
            {
                defendValue = new ArrayList();
                defendMD5 = new MD5CryptoServiceProvider();
            }
        }

        /// <summary>
        /// 上一次的值
        /// </summary>
        public object Old
        {
            get { return old; }
        }

        public bool DefendFalsify
        {
            get { return defendFalsify; }
        }

        /// <summary>
        /// 默认的防篡改方法，记录一个 hash 值，在下次获取时检测，如果被修改了则自动复原
        /// </summary>
        /// <param name="val"></param>
        protected virtual void DefendEncode(object val)
        {
            ArrayList list = defendValue as ArrayList;
            list.Clear();
            string str = val + "";
            for(int i = 0,len = str.Length; i < len; i++)
            {
                //单个字符转 ascii
                list.Add((int)str[i]);
            }
            defendHash = System.Text.Encoding.ASCII.GetString(defendMD5.ComputeHash(System.Text.Encoding.ASCII.GetBytes(str)));
        }

        protected virtual void DefendDecode()
        {

        }
    }
}