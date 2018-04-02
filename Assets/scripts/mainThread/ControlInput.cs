using UnityEngine;
using lib;

public class ControlInput {

    private static float lastHorizontal = 0;
    private static float lastVertical = 0;
    private static float lastJump = 0;

    public static void Update()
    {
        //左右移动
        if (Input.GetAxis("Horizontal") < 0 && Input.GetAxis("Horizontal") <= lastHorizontal)
        {
            ThreadEventList.GetList(MainThread.ThreadId, GameThread.ThreadId).AddEvent(ThreadEvent.Create(ControlInputEvent.LEFT));
        }
        if (Input.GetAxis("Horizontal") > 0 && Input.GetAxis("Horizontal") >= lastHorizontal)
        {
            ThreadEventList.GetList(MainThread.ThreadId, GameThread.ThreadId).AddEvent(ThreadEvent.Create(ControlInputEvent.RIGHT));
        }
        lastHorizontal = Input.GetAxis("Horizontal");

        //上下移动
        if (Input.GetAxis("Vertical") < 0 && Input.GetAxis("Vertical") <= lastVertical)
        {
            ThreadEventList.GetList(MainThread.ThreadId, GameThread.ThreadId).AddEvent(ThreadEvent.Create(ControlInputEvent.DOWN));
        }
        if (Input.GetAxis("Vertical") > 0 && Input.GetAxis("Vertical") >= lastVertical)
        {
            ThreadEventList.GetList(MainThread.ThreadId, GameThread.ThreadId).AddEvent(ThreadEvent.Create(ControlInputEvent.UP));
        }
        lastVertical = Input.GetAxis("Horizontal");

        //跳跃
        if (Input.GetAxis("Jump") != 0 && lastJump == 0)
        {
            ThreadEventList.GetList(MainThread.ThreadId, GameThread.ThreadId).AddEvent(ThreadEvent.Create(ControlInputEvent.JUMP));
        }
        lastJump = Input.GetAxis("Jump");
    }
}
