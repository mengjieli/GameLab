using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Threading;

namespace lib
{
    public class Thread : EventDispatcher
    {
        private System.Threading.Thread thread;
        private Timer timer;
        private FPSCounter fps;
        private int id; 
    
        public Thread(bool startThread = true)
        {
            staticId++;
            id = staticId;
            if(startThread)
            {
                thread = new System.Threading.Thread(new ThreadStart(Start));
                thread.Start();
            }
            fps = new FPSCounter();
            ThreadEventList.AddThread(Id);
        }

        public int Id
        {
            get { return id; }
        }

        public FPSCounter FPS
        {
            get { return fps; }
        }

        private void Start()
        {
            TimerCallback timeCallBack = new TimerCallback(Update);
            timer = new Timer(timeCallBack,null,1000,1000/60);
        }

        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="state"></param>
        virtual public void Update(object state = null)
        {
            if (exitAllFlag)
            {
                timer.Dispose();
                return;
            }
            fps.Update();

            //清除没已读的事件
            ThreadEventList.ClearEventList(Id);

            //接受来自 GameThread 的事件
            List<ThreadEvent> list = ThreadEventList.GetAllEvent(Id);
            for(int i = 0; i < list.Count; i++)
            {
                this.Dispatch(list[i]);
                list[i].Dispose();
            }
        }

        public void AddEvent(int threadId,ThreadEvent e)
        {
            ThreadEventList.GetList(Id, threadId).AddEvent(e);
        }

        /// <summary>
        /// 释放内存
        /// </summary>
        public void Dispose()
        {
            timer.Dispose();
        }

        private static int staticId = 1;

        private static bool exitAllFlag = false;

        /// <summary>
        /// 推出所有线程
        /// </summary>
        public static void ExitAll()
        {
            exitAllFlag = true;
        }
    }
}