namespace lib
{
	public class ThreadEvent
	{
		private int id;

		public ThreadEvent()
		{
			id = ID++;
		}

		public int Id
		{
			get { return id;}
		}

		public ThreadEventType Type;

		//Object ID
		public int ObjectId;

		public float X;
		public float Y;
		public float Z;

		public float ScaleX;
		public float ScaleY;

		public float Roation;

		public object Value;

		private static int ID = 0;
	}

	public enum ThreadEventType
	{
		UpdateObjectPosition,
		UpdateObjectScale,
		UpdateObjectRotation
	}

}
