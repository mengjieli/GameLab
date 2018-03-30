using System.Collections;
using System.Collections.Generic;

namespace lib
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="e"></param>
    public delegate void listenerBack(Event e);

    public class EventDispatcher
    {
        private Dictionary<string, ArrayList> listeners = new Dictionary<string, ArrayList>();

        /// <summary>
        /// 注册事件
        /// </summary>
        /// <param name="type"> 事件类型 </param>
        /// <param name="listener"> 回调函数 </param>
        public void AddListener(string type,listenerBack listener)
        {
            if(!listeners.ContainsKey(type))
            {
                listeners.Add(type, new ArrayList());
            }
            listeners[type].Add(listener);
        }

        /// <summary>
        /// 移除事件
        /// </summary>
        /// <param name="type"> 事件类型 </param>
        /// <param name="listener"> 回调函数 </param>
        public void RemoveListener(string type,listenerBack listener)
        {
            if(listeners.ContainsKey(type))
            {
                ArrayList list = listeners[type];
                foreach (listenerBack item in list)
                {
                    if (item == listener)
                    {
                        list.Remove(item);
                        break;
                    }
                }
            }
        }

        /// <summary>
        /// 抛出事件
        /// </summary>
        /// <param name="e"> 事件 </param>
        public void Dispatch(Event e)
        {
            e.target = this;
            if (listeners.ContainsKey(e.Type))
            {
                ArrayList list = listeners[e.Type].Clone() as ArrayList;
                for(int i = 0, len = list.Count; i < len; i++)
                {
                    (list[i] as listenerBack)(e);
                }
            }
        }

        /// <summary>
        /// 抛出事件，无需创建事件对象，只需要传递事件类型和相关内容即可
        /// </summary>
        /// <param name="type"> 事件类型 </param>
        /// <param name="data"> 事件内容 </param>
        public void DispatchWith(string type,object data = null)
        {
            Event e = Event.Create(type, data);
            Dispatch(e);
        }
    }
}