using System;

namespace NimbusRetail
{
    namespace CommerceRuntime.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        [DataContract]
        public sealed class KaleyraOtpRequest : Request
        {
            public KaleyraOtpRequest(string phoneNumber, string templateId)
            {
                this.PhoneNumber = phoneNumber;
                this.TemplateId = templateId;
            }

            [DataMember]
            public string PhoneNumber { get; set; }

            [DataMember]
            public string TemplateId { get; set; }

        }
    }
}