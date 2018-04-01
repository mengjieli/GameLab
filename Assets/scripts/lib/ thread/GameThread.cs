using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Threading;

namespace lib
{
	public class GameThread
	{

		public GameThread ()
		{
		}
		public void Update()
		{

			ThreadEventList.Clear ();
			ThreadEvent e = new ThreadEvent ();
			e.Type = ThreadEventType.UpdateObjectPosition;
			e.X = 1;
			e.Y = 0;
			e.Z = 0;
			ThreadEventList.AddEvent (e);
			if (Exit) {
				timer.Dispose ();
				return;
			}
		}

		public static GameThread Instance; 
		private static Thread thread;
		private static Timer timer;
		private static bool Exit = false;

		public static void Start()
		{
			//thread = new Thread(new ThreadStart(StartCall));
			//thread.Start();
		}

		public static int Fps;

		public static void Destory()
		{
			Exit = true;
		}

		private static void StartCall()
		{
			Instance = new GameThread ();
			//创建代理对象TimerCallback，该代理将被定时调用
			TimerCallback timerDelegate = new TimerCallback(OnFrame);
			timer = new Timer(timerDelegate, null, 1000, 1000/60);
		}

		private static void OnFrame(object state)
		{
			Instance.Update ();
		}
	}
}