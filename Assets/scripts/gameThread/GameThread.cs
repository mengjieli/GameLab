using lib;
using UnityEngine;

public class GameThread : Thread
{
    public GameThread() 
    {
        Instance = this;
    }

    public void Start()
    {
        //初始化数据模型
        GameData data = new GameData();

        //计算镜头实际大小
        Camera camera = StartUp.Instance.mainCamera;
        Vector3 size = new Vector3();
        size = camera.ViewportToWorldPoint(size);
        data.camera.Size = new Point2D(size.x, size.y);

        AddListener(CameraEvent.INIT, OnInitCamera);

        AddListener(ControlInputEvent.LEFT, OnControl);
        AddListener(ControlInputEvent.RIGHT, OnControl);
        AddListener(ControlInputEvent.UP, OnControl);
        AddListener(ControlInputEvent.DOWN, OnControl);

        ThreadEvent te = ThreadEvent.Create(ThreadEvent.CREATE_PREFAB);
        te.URL = "gameLevel/level1/SceneBackground";
        ThreadEventList.GetList(GameThread.ThreadId, MainThread.ThreadId).AddEvent(te);
    }

    public override void Update(object state = null)
    {
        base.Update(state);
    }

    private void OnInitCamera(lib.Event e)
    {
        ThreadEvent te = e as ThreadEvent;
        CameraData2D camera = GameData.Instance.camera;
        UnityEngine.Rect rect = (UnityEngine.Rect)te.Data;
        camera.Range = new lib.Rect(rect.x, rect.y, rect.width, rect.height);
    }

    private void OnControl(lib.Event e)
    {
        if(e.Type == ControlInputEvent.LEFT)
        {
            GameData.Instance.camera.Position = Point2D.Create(GameData.Instance.camera.Position.X - 0.01f, GameData.Instance.camera.Position.Y);
        }
        else if (e.Type == ControlInputEvent.RIGHT)
        {
            GameData.Instance.camera.Position = Point2D.Create(GameData.Instance.camera.Position.X + 0.01f, GameData.Instance.camera.Position.Y);
        }
        else if (e.Type == ControlInputEvent.UP)
        {
            GameData.Instance.camera.Position = Point2D.Create(GameData.Instance.camera.Position.X, GameData.Instance.camera.Position.Y + 0.01f);
        }
        else if (e.Type == ControlInputEvent.DOWN)
        {
            GameData.Instance.camera.Position = Point2D.Create(GameData.Instance.camera.Position.X, GameData.Instance.camera.Position.Y - 0.01f);
        }
    }

    public static GameThread Instance;

    public static int ThreadId
    {
        get { return Instance.Id; }
    }
}