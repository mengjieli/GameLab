namespace lib
{
    /// <summary>
    /// 对象，具有唯一标识，并且有生命周期，在结束时会抛出事件
    /// </summary>
    public class Object : EventDispatcher {

        /// <summary>
        /// 唯一标识，动态的
        /// </summary>
        private int id;

        public Object()
        {
            id = idCount++;
        }

        /// <summary>
        /// 唯一标识，动态生成的
        /// </summary>
        public int Id
        {
            get { return id; }
        }

        /// <summary>
        /// 销毁
        /// </summary>
        virtual public void Destory()
        {
            DispatchWith(Event.DESTORY);
        }

        /// <summary>
        /// id 计数器
        /// </summary>
        private static int idCount = 1;
    }
}

