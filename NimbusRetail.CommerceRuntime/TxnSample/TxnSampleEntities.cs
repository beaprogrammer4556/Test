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
        public class TxnSampleEntities : CommerceEntity
        {
            public TxnSampleEntities()
                : base("TxnSampleEntities")
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
        public class TxnHeader
        {
            public TxnHeader()
            {
                LstLines = new List<TxnDetail>();
            }
            public string TRANSACTIONID { get; set; }
            public string TRANSDATE { get; set; }
            public string CUSTACCOUNT { get; set; }
            public string CUSTMOBILE { get; set; }
            public string CUSTNAME { get; set; }
            public decimal GROSSTOTAL { get; set; }
            public decimal TAXTOTAL { get; set; }
            public decimal NETTOTAL { get; set; }
            public List<TxnDetail> LstLines { get; set; }
        }
        public class TxnDetail
        {
            public string TRANSACTIONID { get; set; }
            public decimal LINENUM { get; set; }
            public string ITEMID { get; set; }
            public string ITEMDESCRIPTION { get; set; }
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
