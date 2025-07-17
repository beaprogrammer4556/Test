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
        public class SampleEntities : CommerceEntity
		{
			public SampleEntities()
				: base("SampleEntities")
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
    }
}
