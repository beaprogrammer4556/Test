using System;
namespace NimbusRetail
{
    namespace CommerceRuntime.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        [DataContract]
        public sealed class SktSearchStudentRequest : Request
        {
            public SktSearchStudentRequest(string RequestVal, string ObjStrVal)
            {
                this.RequestVal = RequestVal;
                this.ObjStrVal = ObjStrVal;
            }

            [DataMember]
            public string RequestVal { get; private set; }

            [DataMember]
            public string ObjStrVal { get; private set; }
        }
    }
}

