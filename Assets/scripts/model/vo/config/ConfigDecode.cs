//Make By CSVCommand. Time 2018.3.31 19:19:34
using UnityEngine;

public class ConfigDecode
{
	public static void Decode()
	{
		BulletConfig.DecodeTable(Resources.Load("config/Bullet") + "");
		GunConfig.DecodeTable(Resources.Load("config/Gun") + "");
		ItemConfig.DecodeTable(Resources.Load("config/Item") + "");
		PlayerConfig.DecodeTable(Resources.Load("config/Player") + "");
		BulletConfig.DecodeTableItem();
		GunConfig.DecodeTableItem();
		ItemConfig.DecodeTableItem();
		PlayerConfig.DecodeTableItem();
	}
}