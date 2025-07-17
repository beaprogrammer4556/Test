namespace NimbusRetail
{
    namespace CommerceRuntime
    {
		using System;
		using System.Text;
		using System.Collections.Generic;
		using Microsoft.Dynamics.Commerce.Runtime;
		using Microsoft.Dynamics.Commerce.Runtime.Messages;
		using Newtonsoft.Json;
		using System.Threading.Tasks;
		using NimbusRetail.CommerceRuntime.Messages;

		public class SampleDataService : IRequestHandlerAsync
        {
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(SampleRequest)
                    };
                }
            }

            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");
                Type reqType = request.GetType();

                if (reqType == typeof(SampleRequest))
                {
					return await this.ExecuteSampleAsync((SampleRequest)request).ConfigureAwait(false);

				}
                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

			public async Task<SampleResponse> ExecuteSampleAsync(SampleRequest request)
			{
				StringBuilder commandText = new StringBuilder();
				BasicResponse resp = new BasicResponse()
				{
					ErrorDetails = "",
					Message = "Success",
					Payload = "",
					Remarks = "Data saved successfully !",
					Status = 200
				};

				try
				{

					StoreConfiguration config = await StoreConfiguration.GetConfigurationAsync(request).ConfigureAwait(false);
					dynamic requestObj = JsonConvert.DeserializeObject<dynamic>(request.RequestVal);
					string _Operation = requestObj.Opreration;
					switch (_Operation)
					{
						default:
							resp.Payload = null;
							break;

                    }
				}
				catch (Exception ex)
				{
					await CommonHelper.GenerateErrorLogAsync(request, "GEN-EST", ex.StackTrace, ex.InnerException).ConfigureAwait(false);
					resp.ErrorDetails = ex.StackTrace + "|" + ex.Source;
					resp.Message = ex.Message;
					resp.Payload = "";
					resp.Remarks = ex.Message;
					resp.Status = 201;
				}

				return new SampleResponse(JsonConvert.SerializeObject(resp));
			}
		}
	}
}