using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace lib
{
    public class StartUp : MonoBehaviour
    {
        //主相机
        public Camera mainCamera;

        private void Awake()
        {
            Instance = this;
        }

        // Update is called once per frame
        void Update()
        {

        }
        
        public GameObject Create(UnityEngine.Object obj)
        {
            return Instantiate(obj) as GameObject;
        }

        public static StartUp Instance;
    }

}