using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace lib
{
    public class PrefabManager
    {
        private static Dictionary<string, List<GameObject>> pools = new Dictionary<string, List<GameObject>>();

        public static GameObject Create(string url)
        {
            if(pools.ContainsKey(url) == false)
            {
                pools.Add(url, new List<GameObject>());
            }
            if(pools[url].Count > 0)
            {
                GameObject obj = pools[url][pools[url].Count - 1];
                pools[url].RemoveAt(pools[url].Count - 1);
                return obj;
            }
            return StartUp.Instance.Create(ResourceManager.GetResource(url));
        }

        public static void Release(string url,GameObject obj)
        {
            if(pools.ContainsKey(url) == false)
            {
                pools.Add(url, new List<GameObject>());
            }
            obj.SetActive(false);
            pools[url].Add(obj);
        }
    }
}
