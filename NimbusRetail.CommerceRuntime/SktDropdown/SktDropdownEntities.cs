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
        public class SktDropdownEntities : CommerceEntity
        {
            public SktDropdownEntities()
                : base("SktDropdownEntities")
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
        public class SktDropdownHeader
        {
            public SktDropdownHeader()
            {
                LstLines = new List<SktDropdownDetail>();
            }
            public string ITEMID { get; set; }
            public List<SktDropdownDetail> LstLines { get; set; }
        }
        public class SktDropdownDetail
        {
            public string ITEMID { get; set; }
            public decimal AMOUNT { get; set; }
        }
    }
}
