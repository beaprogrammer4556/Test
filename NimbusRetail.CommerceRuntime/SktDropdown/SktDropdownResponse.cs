namespace NimbusRetail
{
    namespace CommerceRuntime.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        [DataContract]
        public class SktDropdownResponse : Response
        {
            public SktDropdownResponse(string _ResponseVal)
            {
                this.ResponseVal = _ResponseVal;
            }

            [DataMember]
            public string ResponseVal { get; private set; }
        }
    }
}
