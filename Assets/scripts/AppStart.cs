using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using lib;
using System;
using UnityEngine.UI;

public class AppStart : MonoBehaviour {

	public Text text;

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
		new Thread();
    }



    private void OnChange(lib.Event e)
    {
        Debug.Log("change value:" + (e.target as StringValue).Value + ",old:" + (e.target as StringValue).Old);
    }

	// Update is called once per frame
	void Update () {
		ThreadEvent e = ThreadEventList.ReadEvent ();
		while (e != null) {
			if (e.Type == ThreadEventType.UpdateObjectPosition) {
				//Debug.Log (text.rectTransform.position.x + "," + text.rectTransform.position.y + "," + e.Z);
				text.rectTransform.position = new Vector3 (text.rectTransform.position.x + e.X, text.rectTransform.position.y + e.Y, e.Z);
			}
			e = ThreadEventList.ReadEvent ();
		}
	}

	void OnDestroy()
	{
		Thread.ExitAll();
	}
}