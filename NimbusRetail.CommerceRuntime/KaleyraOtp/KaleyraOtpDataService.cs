namespace NimbusRetail
{
    namespace CommerceRuntime
    {
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Newtonsoft.Json;
        using NimbusRetail.CommerceRuntime.Messages;
        using System;
        using System.Collections.Generic;
        using System.Net;
        using System.Net.Http;
        using System.Text;
        using System.Text.RegularExpressions;
        using System.Threading.Tasks;

        public class KaleyraOtpDataService : IRequestHandlerAsync
        {
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] { typeof(KaleyraOtpRequest) };
                }
            }

            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, nameof(request));
                Type reqType = request.GetType();
                if (reqType == typeof(KaleyraOtpRequest))
                {
                    return await this.ExecuteOtpOperationAsync((KaleyraOtpRequest)request).ConfigureAwait(false);
                }

                throw new NotSupportedException($"Request '{request.GetType()}' is not supported.");
            }

            private async Task<KaleyraOtpResponse> ExecuteOtpOperationAsync(KaleyraOtpRequest request)
            {
                BasicResponse resp = new BasicResponse()
                {
                    Status = 200,
                    Message = "Success",
                    Remarks = "",
                    Payload = "",
                    ErrorDetails = ""
                };

                try
                {
                    dynamic requestObj = JsonConvert.DeserializeObject<dynamic>(request.PhoneNumber);
                    string phoneNumber = (string)requestObj.phoneNumber;
                    string templateId = (string)requestObj.templateId;


                    var payload = new
                    {
                        to = phoneNumber,
                        method = "sms",
                        format = "json",
                        apiKey = "",
                        template_id = templateId
                    };

                    string jsonPayload = JsonConvert.SerializeObject(payload);

                    
                }
                catch (Exception ex)
                {
                    await CommonHelper.GenerateErrorLogAsync(request, "KALEYRA-OTP", ex.StackTrace, ex.InnerException).ConfigureAwait(false);
                    resp.Status = 500;
                    resp.Message = "Failed";
                    resp.ErrorDetails = ex.ToString();
                    resp.Remarks = ex.Message;
                    resp.Payload = "";
                }

                return new KaleyraOtpResponse(JsonConvert.SerializeObject(resp));
            }

            private async Task LogOtpRequestResponseAsync(StoreConfiguration config,Request request, string phoneNumber, string requestJson, string responseJson)
            {
                try
                {
                    using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                    {
                        StringBuilder commandText = new StringBuilder();
                        commandText.Append(@"
                                        INSERT INTO [ext].[KALEYRAOTPLOG]
                                        ([PHONENUMBER], [REQUESTJSON], [RESPONSEJSON], [DATAAREAID], [STORE])
                                        VALUES (@PHONENUMBER, @REQUESTJSON, @RESPONSEJSON, @DATAAREAID, @STORE)
                                        ");

                        ParameterSet parameters = new ParameterSet
                        {
                            { "@PHONENUMBER", phoneNumber },
                            { "@REQUESTJSON", requestJson },
                            { "@RESPONSEJSON", responseJson },
                            { "@DATAAREAID", config.DataAreaId},
                            { "@STORE", config.Store}
                        };

                        await context.ExecuteNonQueryAsync(commandText.ToString(), parameters).ConfigureAwait(false);
                    }
                }
                catch (Exception ex)
                {
                    await CommonHelper.GenerateErrorLogAsync(request, "KALEYRA-LOGGING", ex.StackTrace, ex.InnerException).ConfigureAwait(false);
                }
            }
        }
    }
}