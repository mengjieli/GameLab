using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Threading;

namespace lib
{
    public class Thread
    {
        private System.Threading.Thread thread;
        private Timer timer;
    
        public Thread()
        {
            thread = new System.Threading.Thread(new ThreadStart(Start));
            thread.Start();
        }

        private void Start()
        {
            TimerCallback timeCallBack = new TimerCallback(Update);
            timer = new Timer(timeCallBack,this,1000,1000/60);
        }

        private void Update(object state)
        {
            if(exitAllFlag)
            {
                timer.Dispose();
                return;
            }
            Debug.Log("go.");
        }

        public void Dispose()
        {
            timer.Dispose();
        }

        private static bool exitAllFlag = false;

        private static void StaticUpdate()
        {
            Debug.Log("go.");
        }

        public static void ExitAll()
        {
            exitAllFlag = true;
        }
    }
}