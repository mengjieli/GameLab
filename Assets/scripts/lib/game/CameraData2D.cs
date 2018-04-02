namespace lib
{
    public class CameraData2D : ObjectData
    {
        //镜头大小，游戏实际的投影大小
        public Point2D Size = new Point2D();

        //镜头的位置
        private Point2D position = new Point2D();

        //可移动范围
        public Rect Range = new Rect();

        public Point2D Position
        {
            get { return position; }
            set
            {
                Point2D.Release(position);
                position = value;
                DispatchWith("Position",position);
                ThreadEvent e = ThreadEvent.Create(CameraEvent.MOVE);
                e.X = position.X;
                e.Y = position.Y;
                GameThread.Instance.AddEvent(MainThread.ThreadId,e);
            }
        }
    }
}