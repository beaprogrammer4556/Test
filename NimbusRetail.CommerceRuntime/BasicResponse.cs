namespace NimbusRetail
{
    namespace CommerceRuntime
	{
        public class BasicResponse
        {
            public int Status { get; set; }
            public string Message { get; set; }
            public string Remarks { get; set; }
            public string ErrorDetails { get; set; }
            public dynamic Payload { get; set; }
        }
    }
}
