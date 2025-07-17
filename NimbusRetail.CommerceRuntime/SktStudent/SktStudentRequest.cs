using System;
namespace NimbusRetail
{
    namespace CommerceRuntime.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        [DataContract]
        public sealed class SktStudentRequest : Request
        {
            public SktStudentRequest(string _RequestVal, string _ObjStrVal)
            {
                this.RequestVal = _RequestVal;
                this.ObjStrVal = _ObjStrVal;
            }

            [DataMember]
            public string RequestVal { get; private set; }

            [DataMember]
            public string ObjStrVal { get; private set; }
        }
    }
}

