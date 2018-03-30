using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using lib;

public class AppStart : MonoBehaviour {

	// Use this for initialization
	void Start () {

        /*string str = Resources.Load("test/Test") + "";
        Debug.Log(str);
        XMLElement xml = XMLElement.Parse(str);*/


        string str = Resources.Load("test/Config") + "";
		Dictionary<string,object> json = JSON.Parse(str) as Dictionary<string,object>;
		Debug.Log(json["a"]);
    }

    private void OnChange(lib.Event e)
    {
        Debug.Log("change value:" + (e.target as StringValue).Value + ",old:" + (e.target as StringValue).Old);
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}

public class PlayerData : ObjectValue
{
	public IntValue age =  new IntValue();
    public int Age
    {
        get { return (int)age.Value; }
        set { age.Value = value; }
    }

    protected override void Decode(object val)
    {
		Dictionary<string,object> json = val as Dictionary<string,object>;
		this.age.Value = json["age"];
    }

    protected override string Encode()
    {
		return "{\n"
			+ "age:" + age.Value + "\n"
			+ "}";
    }
}