namespace lib
{
    public class Rect
    {
        public FloatValue X = new FloatValue();
        public FloatValue Y = new FloatValue();
        public FloatValue Width = new FloatValue();
        public FloatValue Height = new FloatValue();

        public Rect(float x = 0,float y = 0,float width = 0,float height = 0)
        {
            X.Value = x;
            Y.Value = y;
            Width.Value = width;
            Height.Value = height;
        }
    }
}