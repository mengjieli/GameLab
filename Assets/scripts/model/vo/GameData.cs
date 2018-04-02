using lib;

public class GameData
{
    public CameraData2D camera = new CameraData2D();

    public GameData()
    {
        Instance = this;
    }

    public static GameData Instance;
}