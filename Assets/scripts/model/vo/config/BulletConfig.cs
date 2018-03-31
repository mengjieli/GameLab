//Make By CSVCommand. Time 2018.3.31 19:19:34
using System.Collections.Generic;
using lib;

public class BulletConfig
{
	private List<string> list;
	public int Id;
	public int CD;

	public void Decode(List<string> list)
	{
		this.list = list;
		for(int i = 0; i < list.Count; i++)
		{
			if(i == 0)
			{
				Id = (int)StringUtils.ToNumber(list[0]);
			}
			if(i == 1)
			{
				CD = (int)StringUtils.ToNumber(list[1]);
			}
		}
	}

	public void DecodeConfigItem()
	{
		for (int i = 0; i < list.Count; i++)
		{
		}
		list = null;
	}


	public static List<BulletConfig> Configs = new List<BulletConfig>();

	public static BulletConfig GetConfig(int key)
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
			BulletConfig item = new BulletConfig();
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