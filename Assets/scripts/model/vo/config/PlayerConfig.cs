//Make By CSVCommand. Time 2018.3.31 19:19:34
using System.Collections.Generic;
using lib;

public class PlayerConfig
{
	private List<string> list;
	public int Id;
	public ItemConfig BornItem;
	public GunConfig BornGun;

	public void Decode(List<string> list)
	{
		this.list = list;
		for(int i = 0; i < list.Count; i++)
		{
			if(i == 0)
			{
				Id = (int)StringUtils.ToNumber(list[0]);
			}
		}
	}

	public void DecodeConfigItem()
	{
		for (int i = 0; i < list.Count; i++)
		{
			if (i == 1)
			{
				BornItem = ItemConfig.GetConfig(Id);
			}
			if (i == 2)
			{
				BornGun = GunConfig.GetConfig(Id);
			}
		}
		list = null;
	}


	public static List<PlayerConfig> Configs = new List<PlayerConfig>();

	public static PlayerConfig GetConfig(int key)
	{
		for(int i = 0; i < Configs.Count; i++)
		{
			if(Configs[i].Id == key)
			{
				return Configs[i];
			}
		}
		return null;
	}

	public static void DecodeTable(string str)
	{
		str = StringUtils.Replace(str, '\r', '\n');
		str = StringUtils.Replace(str, "\n\n", '\n');
		List<List<string>> list = CSV.Parse(str);
		for(int i = 2,len = list.Count; i < len; i++)
		{
			PlayerConfig item = new PlayerConfig();
			item.Decode(list[i]);
			Configs.Add(item);
		}
	}

	public static void DecodeTableItem()
	{
		for(int i = 0,len = Configs.Count; i < len; i++)
		{
			Configs[i].DecodeConfigItem();
		}
	}

}