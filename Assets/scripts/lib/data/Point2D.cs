using System.Collections.Generic;

namespace lib
{
    public class Point2D
    {
        private FloatValue x = new FloatValue();
        private FloatValue y = new FloatValue();

        public Point2D(float x = 0,float y = 0)
        {
            this.x.Value = x;
            this.y.Value = y;
        }

        public float X
        {
            get { return (float)x.Value; }
            set { x.Value = value; }
        }
        public float Y
        {
            get { return (float)y.Value; }
            set { y.Value = value; }
        }

        private static List<Point2D> pools = new List<Point2D>();

        public static Point2D Create(float x = 0, float y = 0)
        {
            if(pools.Count > 0)
            {
                Point2D p = pools[pools.Count - 1];
                pools.RemoveAt(pools.Count - 1);
                p.X = x;
                p.Y = y;
                return p;
            }
            return new Point2D(x, y);
        }

        public static void Release(Point2D p)
        {
            pools.Add(p);
        }
    }
}