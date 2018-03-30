namespace lib
{
    public class ArrayValue : ValueBase
    {
        public IntValue length = new IntValue();

        //public 

        public int Length
        {
            get { return (int)length.Value; }
        }
    }
}
