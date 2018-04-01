using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace lib
{
	public class ThreadEventList
	{
		private static Dictionary<int,ThreadEvent> list = new Dictionary<int,ThreadEvent>();
		private static int readId = -1;
		private static int maxId = -1;
		private static int clearId = -1;

		public static ThreadEvent ReadEvent()
		{
			if (readId < maxId) {
				ThreadEvent e = list [readId + 1];
				readId++;
				return e;
			}
			return null;
		}

		public static void AddEvent(ThreadEvent e)
		{
			list.Add (e.Id, e);
			maxId = e.Id;
		}

		public static void Clear()
		{
			while (clearId < readId) {
				clearId++;
				list.Remove(clearId);
			}
		}
	}
}
