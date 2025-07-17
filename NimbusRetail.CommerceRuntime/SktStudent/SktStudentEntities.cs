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
        public class SktStudentEntities : CommerceEntity
        {
            public SktStudentEntities()
                : base("SktStudentEntities")
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
        public class StudentInfoHeader
        {
            public StudentInfoHeader()
            {
                LstLines = new List<StudentResultDetail>();
            }
            public string STUDENTID { get; set; }
            public string STUDENTNAME { get; set; }
            public string STUDENTCLASS { get; set; }
            public List<StudentResultDetail> LstLines { get; set; }
        }
        public class StudentResultDetail
        {
            public string STUDENTID { get; set; }
            public decimal LINENUM { get; set; }
            public decimal SUBJECT1 { get; set; }
            public decimal SUBJECT2 { get; set; }
            public decimal SUBJECT3 { get; set; }
        }
    }
}
