using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using lib;

public class GameObjectManager {

    public GameObjectManager()
    {
        MainThread.Instance.AddListener(ThreadEvent.CREATE_PREFAB, OnCreatePrefab);
    }

    private void OnCreatePrefab(lib.Event e)
    {
        ThreadEvent te = e as ThreadEvent;
        PrefabManager.Create(te.URL);
    }
}
