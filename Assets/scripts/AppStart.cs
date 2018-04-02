using UnityEngine;
using lib;
using UnityEngine.UI;

public class AppStart : MonoBehaviour {

    public Camera mainCamera;


    // Use this for initialization
    void Start () {
        /*string str = Resources.Load("test/Test") + "";
        Debug.Log(str);
        XMLElement xml = XMLElement.Parse(str);*/

        /*string str = Resources.Load("test/Config") + "";
		Dictionary<string,object> json = JSON.Parse(str) as Dictionary<string,object>;
		Debug.Log(json["a"]);*/

        /*string str = Resources.Load("config/All") + "";
        List<List<string>> csv = CSV.Parse(str);*/

        /*ConfigDecode.Decode();
        object cfg;
        cfg = PlayerConfig.Configs;
        cfg = PlayerConfig.GetConfig(2);*/

        //GameThread.Start ();

        gameObject.AddComponent<StartUp>().mainCamera = mainCamera;

        new MainThread();
        new GameThread();
        GameThread.Instance.Start();
    }

	void Update ()
    {
        MainThread.Instance.Update();
	}

	void OnDestroy()
	{
		Thread.ExitAll();
	}
}