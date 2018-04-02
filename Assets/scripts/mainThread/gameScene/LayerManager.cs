using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using lib;

public class LayerManager : MonoBehaviour {

    public static LayerManager Instance;

    public Camera mainCamera;

    //前景层
    public GameObject frontLayer;
    //怪物层
    public GameObject monsterLayer;
    //角色层
    public GameObject playerLayer;
    //子弹层，特效层
    public GameObject bulletLayer;

    //镜头大小，游戏实际的投影大小
    public Vector3 cameraSize;

    //镜头范围，根据屏幕可视范围和移动范围计算得到
    public UnityEngine.Rect cameraRange;

    public Vector2 cameraPosition;

    public UnityEngine.Rect sceneSize;

    private void Awake()
    {
        Instance = this;

        mainCamera = StartUp.Instance.mainCamera;

        cameraSize = new Vector3();
        cameraSize = mainCamera.ViewportToWorldPoint(cameraSize);
        cameraSize.x = Mathf.Abs(cameraSize.x);
        cameraSize.y = Mathf.Abs(cameraSize.y);


        GameLayer[] layers = gameObject.GetComponentsInChildren<GameLayer>();
        for(int i = 0; i < layers.Length; i++)
        {
            //计算镜头实际可移动范围
            layers[i].cameraRange.x = layers[i].moveRange.x + Mathf.Abs(cameraSize.x);
            layers[i].cameraRange.width = layers[i].moveRange.width - 2 * Mathf.Abs(cameraSize.x);
            layers[i].cameraRange.y = layers[i].moveRange.y + Mathf.Abs(cameraSize.y);
            layers[i].cameraRange.height = layers[i].moveRange.height - 2 * Mathf.Abs(cameraSize.y);
        }

        cameraPosition = new Vector2(0, 0);

        //设置镜头属性
        UnityEngine.Rect frontCameraRange = LayerManager.Instance.frontLayer.GetComponent<GameLayer>().cameraRange;
        cameraRange = new UnityEngine.Rect(frontCameraRange.x, frontCameraRange.y, frontCameraRange.width, frontCameraRange.height);
        //vo.camera.cameraTransform = mainCamera.transform;
        //记录场景大小
        UnityEngine.Rect moveRange = frontLayer.GetComponent<GameLayer>().moveRange;
        sceneSize = new UnityEngine.Rect(moveRange.x, moveRange.y, moveRange.width, moveRange.height);

        ThreadEventList.GetList(MainThread.ThreadId, GameThread.ThreadId).AddEvent(ThreadEvent.Create(CameraEvent.INIT, moveRange));

        MainThread.Instance.AddListener(CameraEvent.MOVE, OnCameraMove);
    }

    private void OnCameraMove(lib.Event evt)
    {
        ThreadEvent e = evt as ThreadEvent;
        cameraPosition[0] = e.X;
        cameraPosition[1] = e.Y;
        mainCamera.transform.position = new Vector3(e.X,e.Y);
    }

    // Use this for initialization
    void Start () {
    }

    // Update is called once per frame
    void Update () {

    }
}
