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
        public class SktCustOrderEntities : CommerceEntity
        {
            public SktCustOrderEntities()
                : base("SktCustOrderEntities")
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
        public class SktCustOrderHeader
        {
            public SktCustOrderHeader()
            {
                LstLines = new List<SktCustOrderDetail>();
            }
            public string ORDERNUMBER { get; set; }
            public string CUSTACCOUNT { get; set; }
            public string CUSTNAME { get; set; }
            public string ORDERDATE { get; set; }
            public string DELIVERYDATE { get; set; }
            public decimal OFFERSTATUS { get; set; }
            public decimal FLOTINGSTATUS { get; set; }
            public string INVENTLOCATION { get; set; }
            public string SALESPERSON { get; set; }
            public string REMARKS { get; set; }
            public decimal TOTALMETALWT { get; set; } 
            public decimal OFFODRADV { get; set; }
            public string EXPDATE { get; set; }
            public string ITEMID { get; set; }
            public decimal PIECES { get; set; } 
            public decimal TAXPERCENT { get; set; }
            public decimal TOTALAMOUNT { get; set; }
            public decimal CVALUE { get; set; }    //Need to add this feild in database                                                    

            //public decimal ODRRATEFREEZE { get; set; }
            //public decimal PAYAMOUNT { get; set; 
            //public decimal TAXTOTAL { get; set; }
            //public decimal MINODRADV { get; set; }
            //public decimal TXNAMOUNT { get; set; }
            //public string TXNID { get; set; }

            public List<SktCustOrderDetail> LstLines { get; set; }
        }
        public class SktCustOrderDetail
        {
            //public SktCustOrderDetail()
            //{
            //    LstLines2 = new List<SktCustOrderIngredient>();
            //}
            public string ORDERNUMBER { get; set; }
            public decimal LINENUM { get; set; }
            public string ITEMID { get; set; }
            public decimal PIECES { get; set; }
            public decimal CVALUE { get; set; }
            public decimal GROSSTOTAL { get; set; }
            public decimal NETTOTAL { get; set; }
            public decimal TAXTOTAL { get; set; }
            public decimal TOTALDISCOUNT { get; set; }

            //public decimal GROSSWT { get; set; }
            //public decimal MKAMOUNT { get; set; }
            //public decimal WSTAMOUNT { get; set; }
            //public string BOOKED { get; set; }
            //public string DLVDATE { get; set; }
            //public string SRTOREDLVDATE { get; set; }
            //public string DISCPKG { get; set; }
            //public decimal DISCFROM { get; set; }
            //public decimal DISCTO { get; set; }
            //public decimal SKETCH { get; set; }
            //public decimal SAMPLE { get; set; }
            //public decimal STONES { get; set; }
            //public decimal TOTALAMOUNT { get; set; }

            //public List<SktCustOrderIngredient> LstLines2 { get; set; }

        }

        //public class SktCustOrderIngredient
        //{
        //    public string ORDERNUMBER { get; set; }
        //    public decimal LINENUM { get; set; }
        //    public decimal REFLINENUM { get; set; }
        //    public string ITEMID { get; set; }
        //    public string CONFIG { get; set; }
        //    public string COLOR { get; set; }
        //    public decimal SIZE { get; set; }
        //    public decimal PIECES { get; set; }
        //    public decimal NETWT { get; set; }
        //    public decimal RATE { get; set; }
        //    public decimal CVALUE { get; set; }
        //    public decimal MKTYPE { get; set; }
        //    public decimal MKRATE { get; set; }
        //    public decimal MKAMT { get; set; }
        //    public string WSTTYPE { get; set; }
        //    public string WSTRATE { get; set; }
        //    public decimal WSTAMT { get; set; }
        //    public string UNIT { get; set; }
        //}
    }
}
