namespace NimbusRetail
{
    namespace CommerceRuntime
    {
		using System;
		using System.Collections.Generic;
		using System.ComponentModel;
		using System.IO;
		using System.Linq;
		using System.Reflection;
        using System.Xml.Linq;
        using System.Xml.Serialization;
		using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
		
		public static class DataHelpers
        {
            public static List<T> ConvertDataTable<T>(DataTable dt)
            {
                List<T> data = new List<T>();
                foreach (DataRow row in dt.Rows)
                {
                    T item = GetItem<T>(row);
                    data.Add(item);
                }
                return data;
            }

            private static T GetItem<T>(DataRow dr)
            {
                Type temp = typeof(T);
                T obj = Activator.CreateInstance<T>();

                foreach (DataColumn column in dr.Table.Columns)
                {
					foreach (PropertyInfo pro in temp.GetRuntimeProperties())
					{
						if (pro.Name == column.ColumnName)
						{
							#region Added by Shiva depending on requirement
							if (pro.PropertyType == typeof(bool) && 
								dr.Table.Columns.SingleOrDefault(s => s.ColumnName == column.ColumnName).DataType == typeof(int))
							{
								pro.SetValue(obj, Convert.ToBoolean(dr[column.ColumnName]));
								continue;
							}
							#endregion

							pro.SetValue(obj, dr[column.ColumnName], null);
						}
						else
						{
                            continue; 
						}
                    }
                }
                return obj;
            }

			public static DataTable ToDataTable<T>(this IList<T> data)
			{
				PropertyDescriptorCollection props =
				TypeDescriptor.GetProperties(typeof(T));
				DataTable table = new DataTable();
				for (int i = 0; i < props.Count; i++)
				{
					PropertyDescriptor prop = props[i];
					table.Columns.Add(prop.Name, prop.PropertyType);
				}
				object[] values = new object[props.Count];
				foreach (T item in data)
				{
					for (int i = 0; i < values.Length; i++)
					{
						values[i] = props[i].GetValue(item);
					}
					table.Rows.Add(values);
				}
				return table;
			}

			public static T DeserializeXML<T>(string input) where T : class
			{
				T result;
                XmlSerializer ser = new XmlSerializer(typeof(T));
                using (StringReader sr = new StringReader(input))
                {
					#pragma warning disable CA5369 // Use XmlReader for 'XmlSerializer.Deserialize()'
                    result = ser.Deserialize(sr) as T;
					#pragma warning restore CA5369 // Use XmlReader for 'XmlSerializer.Deserialize()'
                }
				return result;
            }

			public static List<T> DeserializeXML<T>(IEnumerable<XElement> input)
			{
				List<T> data = new List<T>();
				XmlSerializer ser = new XmlSerializer(typeof(T));
				foreach(XElement element in input)
				{
					T item = (T)ser.Deserialize(element.CreateReader());
					data.Add(item);
					//using (StringReader sr = new StringReader(element.CreateReader().ToString()))
					//{
					//	T item = (T)ser.Deserialize(element.CreateReader());
					//	data.Add(item);
					//}
				}
				return data;
			}

			public static string SerializeXML<T>(T ObjectToSerialize)
			{
				XmlSerializer xmlSerializer = new XmlSerializer(ObjectToSerialize.GetType());

				using (StringWriter textWriter = new StringWriter())
				{
					xmlSerializer.Serialize(textWriter, ObjectToSerialize);
					return textWriter.ToString();
				}
			}
		}
    }
}
