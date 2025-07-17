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
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime.DataAccess.SqlServer;

        public class SktSearchStudentDataService : IRequestHandlerAsync
        {
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(SktSearchStudentRequest)
                    };
                }
            }

            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");
                Type reqType = request.GetType();

                if (reqType == typeof(SktSearchStudentRequest))
                {
                    return await this.ExecuteStudentAsync((SktSearchStudentRequest)request).ConfigureAwait(false);

                }
                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

            public async Task<SktSearchStudentResponse> ExecuteStudentAsync(SktSearchStudentRequest request)
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
                        case "GETSTUDENTDETAIL":
                            resp.Payload = await GetSktStudentDetailsAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETSTUDENTID":
                            resp.Payload = await GetStudentIds(request, config).ConfigureAwait(false);
                            break;

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

                return new SktSearchStudentResponse(JsonConvert.SerializeObject(resp));
            }

            public async Task<List<IDropdownV2>> GetStudentIds(Request request, StoreConfiguration config)
            {
                List<IDropdownV2> lstTxns = new List<IDropdownV2>();
                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@DATAAREAID", config.DataAreaId);

                    commandText.Append(@"   SELECT DISTINCT STUDENTID AS [value], STUDENTID AS [text] 
                                 FROM [ext].[STUDENTINFOHEADER] WHERE DATAAREAID = @DATAAREAID ");

                    ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                        {
                            lstTxns = DataHelpers.ConvertDataTable<IDropdownV2>(ds.Tables[0]).ToList();
                        }
                    }
                }

                return lstTxns;
            }

            public async Task<studentsearcheader> GetSktStudentDetailsAsync(Request request, StoreConfiguration config, dynamic requestObj, string StudentId)
            {
                studentsearcheader hdr = new studentsearcheader { STUDENTID = StudentId, LstLines = new List<studentsearchdetail>() };

                try
                {
                    using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                    {
                        ParameterSet pSet = new ParameterSet();
                        pSet.Add("@STUDENTID", StudentId);
                        pSet.Add("@DATAAREAID", config.DataAreaId);

                        StringBuilder commandText = new StringBuilder();
                        commandText.Append(@"SELECT si.STUDENTID, si.STUDENTNAME, sr.SUBJECT1, sr.SUBJECT2, sr.SUBJECT3,  
                                         (SUM(sr.SUBJECT1) + SUM(sr.SUBJECT2) + SUM(sr.SUBJECT3)) / 3 as STUDENTMARKS
                                 FROM [ext].[STUDENTINFOHEADER] as si
                                 JOIN [ext].[STUDENTRESULTDETAIL] as sr
                                 ON si.STUDENTID = sr.STUDENTID
                                 WHERE si.STUDENTID = @STUDENTID AND si.DATAAREAID = @DATAAREAID
                                 GROUP BY si.STUDENTID, si.STUDENTNAME, sr.SUBJECT1, sr.SUBJECT2, sr.SUBJECT3");

                        DataSet ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);

                        if (ds != null && ds.Tables.Count > 0)
                        {
                            hdr = DataHelpers.ConvertDataTable<studentsearcheader>(ds.Tables[0]).FirstOrDefault() ?? hdr;
                            hdr.LstLines = DataHelpers.ConvertDataTable<studentsearchdetail>(ds.Tables[1]).ToList();
                        }
                    }
                }
                catch (Exception ex)
                {
                    await CommonHelper.GenerateErrorLogAsync(request, "GEN-EST", ex.StackTrace, ex.InnerException).ConfigureAwait(false);
                }

                return hdr;
            }
        }
    }
}