using lib;

public class MainThread : Thread
{
    public MainThread() : base(false)
    {
        Instance = this;

        new GameObjectManager();
    }

    override public void Update(object state = null)
    {
        base.Update(state);

        //检测控制输入
        ControlInput.Update();
    }

    public static MainThread Instance;

    public static int ThreadId
    {
        get { return Instance.Id; }
    }
}