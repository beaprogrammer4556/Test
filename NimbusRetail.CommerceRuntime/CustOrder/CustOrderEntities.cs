
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
        public class CustOrderEntities : CommerceEntity
        {
            public CustOrderEntities()
                : base("CustOrderEntities")
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
        public class CustOrderHeader
        {
            public CustOrderHeader()
            {
                LstLines = new List<CustOrderDetail>();
            }
            public string ORDERNUMBER { get; set; }
            public string TRANSDATE { get; set; }
            public string DELIVERYDATE { get; set; }
            public string CUSTACCOUNT { get; set; }
            public string CUSTMOBILE { get; set; }
            public string CUSTNAME { get; set; }
            public decimal GROSSTOTAL { get; set; }
            public decimal TAXTOTAL { get; set; }
            public decimal NETTOTAL { get; set; }
            public List<CustOrderDetail> LstLines { get; set; }
        }
        public class CustOrderDetail
        {
            public string ORDERNUMBER { get; set; }
            public decimal LINENUM { get; set; }
            public string ITEMID { get; set; }
            public string ITEMDESCRIPTION { get; set; }
            public int QUANTITY { get; set; }
            public decimal MRP { get; set; }
            public decimal DISCPERCENT { get; set; }
            public decimal DISCAMOUNT { get; set; }
            public decimal NETAMOUNT { get; set; }
            public decimal TAXPERCENT { get; set; }
            public decimal TAXAMOUNT { get; set; }
            public decimal TOTALAMOUNT { get; set; }
        }
    }
}






