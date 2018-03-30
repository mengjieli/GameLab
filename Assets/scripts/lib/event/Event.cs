using System.Collections;

namespace lib
{
    /// <summary>
    /// 事件
    /// </summary>
    public class Event
    {
        /// <summary>
        /// 事件类型
        /// </summary>
        private string type;

        /// <summary>
        /// 抛出事件的对象
        /// </summary>
        internal EventDispatcher target;

        /// <summary>
        /// 事件内容
        /// </summary>
        private object data;

        /// <summary>
        /// 初始化函数
        /// </summary>
        /// <param name="type"> 事件类型 </param>
        /// <param name="data"> 事件内容 </param>
        public Event(string type, object data = null)
        {
            this.type = type;
            this.data = data;
        }

        /// <summary>
        /// 事件类型
        /// </summary>
        public string Type
        {
            get { return type; }
        }

        /// <summary>
        /// 抛出事件的对象
        /// </summary>
        public EventDispatcher Target
        {
            get { return target; }
        }

        /// <summary>
        /// 事件内容
        /// </summary>
        public object Data 
        {
            get { return data; }
        }

        /// <summary>
        /// 对象改变
        /// </summary>
        public static string CHANGE = "Change";

        /// <summary>
        /// 对象被销毁
        /// </summary>
        public static string DESTORY = "Destory";

        /// <summary>
        /// 某件事情完成
        /// </summary>
        public static string COMPLETE = "Complete";

        /// <summary>
        /// 对象池
        /// </summary>
        private static ArrayList pools = new ArrayList();

        /// <summary>
        /// 创建事件，如果对象池中有则无需创建
        /// </summary>
        /// <param name="type"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        internal static Event Create(string type, object data = null)
        {
            if(pools.Count > 0)
            {
                Event e = pools[pools.Count - 1] as Event;
                e.type = type;
                e.data = data;
                return e;
            }
            return new Event(type, data);
        }

        /// <summary>
        /// 把事件放回对象池
        /// </summary>
        /// <param name="e"></param>
        internal static void Release(Event e)
        {
            pools.Add(e);
        }
    }

}
