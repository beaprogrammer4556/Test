namespace NimbusRetail
{
	using System.Collections.Generic;
	namespace Commerce.Runtime.DataModel
	{
		using System.Runtime.Serialization;
		using Microsoft.Dynamics.Commerce.Runtime.ComponentModel.DataAnnotations;
		using Microsoft.Dynamics.Commerce.Runtime.DataModel;
		using SystemAnnotations = System.ComponentModel.DataAnnotations;

		[DataContract]
		public class RepairOrderEntities : CommerceEntity
		{
			public RepairOrderEntities()
				: base("RepairOrderEntities")
			{ }
			private const string IdColumn = "ID";

			[SystemAnnotations.Key]
			[DataMember]
			[Column(IdColumn)]
			public string ID
			{
				get { return (string)this[IdColumn]; }
				set { this[IdColumn] = value; }
			}
		}
	}

	namespace CommerceRuntime
	{
		public class RepairOrderHeader
		{
			public RepairOrderHeader()
			{
				LstLines = new List<RepairOrderDetail>();
			}
			public string TRANSDATE { get; set; }
			public string REPAIRORDERNUMBER { get; set; }
			public string DELIVERYDATE { get; set; }
			public string CUSTACCOUNT { get; set; }
			public string CUSTNAME { get; set; }
			public string CUSTMOBILE { get; set; }
			public decimal TOTALCHARGES { get; set; }
			public decimal GROSSTOTAL { get; set; }
			public decimal TAXTOTAL { get; set; }
			public decimal TOGGLESTATUS { get; set; }
			public List<RepairOrderDetail> LstLines { get; set; }
		}
		public class RepairOrderDetail
		{
			public string REPAIRORDERNUMBER { get; set; }
			public decimal LINENUM { get; set; }
			public string ITEMID { get; set; }
			public string ITEMDESCRIPTION { get; set; }
			public decimal QUANTITY { get; set; }
			public decimal REPAIRCHARGE { get; set; }
			public decimal DISCOUNTPERCENT { get; set; }
			public decimal DISCOUNTAMOUNT { get; set; }
			public decimal TAXPERCENT { get; set; }
			public decimal NETAMOUNT { get; set; }
			public decimal TAXAMOUNT { get; set; }
			public decimal TOTALAMOUNT { get; set; }
		}
	}
}
