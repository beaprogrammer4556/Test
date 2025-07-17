using System;


namespace NimbusRetail
{
    namespace CommerceRuntime.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        [DataContract]
        public class KaleyraOtpResponse : Response
        {
            public KaleyraOtpResponse(string status, string message)
            {
                this.Status = status;
                this.Message = message;
            }

            [DataMember]
            public string Status { get; private set; }

            [DataMember]
            public string Message { get; private set; }
        }
    }
}