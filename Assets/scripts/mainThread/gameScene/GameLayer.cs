using UnityEngine;

public class GameLayer : MonoBehaviour {

    //可移动范围
    public Rect moveRange;
    //镜头范围，根据屏幕可视范围和移动范围计算得到
    [HideInInspector]
    public Rect cameraRange;

    private void Awake()
    {
    }

        // Use this for initialization
    void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
        Rect cameraRange = LayerManager.Instance.cameraRange;
        Vector2 cameraPosition = LayerManager.Instance.cameraPosition;
        if (cameraRange.Equals(this.cameraRange) == false)
        {
            //计算镜头移动比例
            float xPercent = (cameraPosition.x - cameraRange.x) / cameraRange.width;
            float yPercent = (cameraPosition.y - cameraRange.y) / cameraRange.height;
            float x = this.cameraRange.x + this.cameraRange.width * xPercent;
            float y = this.cameraRange.y + this.cameraRange.height * yPercent;
            float cameraX = cameraRange.x + cameraRange.width * xPercent;
            float cameraY = cameraRange.y + cameraRange.height * yPercent;
            gameObject.transform.position = new Vector3(cameraX - x, cameraY - y, gameObject.transform.position.z);
        }
    }
}
