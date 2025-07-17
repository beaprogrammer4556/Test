namespace NimbusRetail
{
    namespace CommerceRuntime.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        [DataContract]
        public class TxnSampleResponse : Response
        {
            public TxnSampleResponse(string _ResponseVal)
            {
                this.ResponseVal = _ResponseVal;
            }

            [DataMember]
            public string ResponseVal { get; private set; }
        }
    }
}
