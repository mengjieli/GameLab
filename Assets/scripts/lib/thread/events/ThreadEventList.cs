using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace lib
{
	public class ThreadEventList
	{
		private Dictionary<int,ThreadEvent> list = new Dictionary<int,ThreadEvent>();
		private int readId = -1;
		private int maxId = -1;
		private int clearId = -1;

		public ThreadEvent ReadEvent()
		{
			while (readId < maxId) {
                if(list.ContainsKey(readId + 1))
                {
                    ThreadEvent e = list[readId + 1];
                    readId++;
                    return e;
                }
                else
                {
                    readId++;
                }
			}
			return null;
		}

		public void AddEvent(ThreadEvent e)
		{
			list.Add (e.Id, e);
			maxId = e.Id;
		}

		public void Clear()
		{
			while (clearId < readId) {
				clearId++;
				list.Remove(clearId);
			}
		}

        public static ThreadEventList GetList(int fromThread, int toThread)
        {
            if(threadList[fromThread] == null)
            {
                return null;
            }
            return threadList[fromThread][toThread];
        }

        public static void ClearEventList(int threadId)
        {
            Dictionary<int, ThreadEventList> list = threadList[threadId];
            for (int i = 0; i < threads.Count; i++)
            {
                if(threads[i] != threadId)
                {
                    list[threads[i]].Clear();
                }
            }
        }

        public static List<ThreadEvent> GetAllEvent(int threadId)
        {
            List<ThreadEvent> list = new List<ThreadEvent>();
            for(int i = 0; i < threads.Count; i++)
            {
                if(threads[i] != threadId)
                {
                    ThreadEventList threadEventList = threadList[threads[i]][threadId];
                    ThreadEvent e = threadEventList.ReadEvent();
                    while(e != null)
                    {
                        list.Add(e);
                        e = threadEventList.ReadEvent();
                    }
                }
            }
            return list;
        }

        private static List<int> threads = new List<int>();
        private static Dictionary<int, Dictionary<int, ThreadEventList>> threadList = new Dictionary<int, Dictionary<int, ThreadEventList>>();

        internal static void AddThread(int id)
        {
            threadList[id] = new Dictionary<int, ThreadEventList>();
            if (threads.Count > 0)
            {
                for(int i = 0; i < threads.Count; i++)
                {
                    threadList[threads[i]].Add(id, new ThreadEventList());
                    threadList[id].Add(threads[i], new ThreadEventList());
                }
            }
            threads.Add(id);
        }
	}
}
