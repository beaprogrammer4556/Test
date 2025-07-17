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
        public class SktSearchStudentEntities : CommerceEntity
        {
            public SktSearchStudentEntities()
                : base("SktSearchStudentEntities")
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
        public class studentsearcheader
        {
            public studentsearcheader()
            {
                LstLines = new List<studentsearchdetail>();
            }
            public string STUDENTID { get; set; }
            public List<studentsearchdetail> LstLines { get; set; }


        }
        public class studentsearchdetail
        {

            public string STUDENTID { get; set; }
            public string STUDENTNAME { get; set; }
            public decimal SUBJECT1 { get; set; }
            public decimal SUBJECT2 { get; set; }
            public decimal SUBJECT3 { get; set; }
            public decimal STUDENTMARKS { get; set; }
        }
    }
}
