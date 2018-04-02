using System.Collections.Generic;

namespace lib
{
    sealed public class ThreadEvent : Event
	{
		private int id;

		public ThreadEvent(string type,object data = null) : base(type,data)
        {
            id = ID++;
		}

		public int Id
		{
			get { return id;}
		}

		//Object ID
		public int ObjectId;

		public float X;
		public float Y;
		public float Z;

		public float ScaleX;
		public float ScaleY;

		public float Roation;

        public string URL;

        public void Dispose()
        {
            pools.Add(this);
            Data = null;
        }

		private static int ID = 0;

        public static string CREATE_PREFAB = "create_prefab";
        public static string UPDATE_POSITION = "update_position";
        public static string UPDATE_SCALE = "update_scale";
        public static string UPDATE_ROTATION = "update_rotation";

        private static List<ThreadEvent> pools = new List<ThreadEvent>();

        public static ThreadEvent Create(string type)
        {
            if(pools.Count > 0)
            {
                ThreadEvent e = pools[pools.Count - 1];
                e.id = ID++;
                e.type = type;
                pools.RemoveAt(pools.Count - 1);
                return e;
            }
            return new ThreadEvent(type);
        }
    }
}
