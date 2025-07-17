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
        using System.Globalization;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using System.Linq;

        public class SktDropdownDataService : IRequestHandlerAsync
        {
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(SktDropdownRequest)
                    };
                }
            }

            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");
                Type reqType = request.GetType();

                if (reqType == typeof(SktDropdownRequest))
                {
                    return await this.ExecuteNewTxnSampleAsync((SktDropdownRequest)request).ConfigureAwait(false);

                }
                throw new NotSupportedException(string.Format("Request '{0}' is not supported here.", request.GetType()));
            }

            public async Task<SktDropdownResponse> ExecuteNewTxnSampleAsync(SktDropdownRequest request)
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
                        case "GETITEMDETAIL":
                            resp.Payload = await GetDropdownDetailsAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETITEMIDUMBERS":
                            resp.Payload = await GetItemIdNumbers(request, config).ConfigureAwait(false);
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

                return new SktDropdownResponse(JsonConvert.SerializeObject(resp));
            }

            public async Task<List<NimKeyValue>> GetItemIdNumbers(Request request, StoreConfiguration config)
            {
                List<NimKeyValue> lstTxns = new List<NimKeyValue>();
                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@DATAAREAID", config.DataAreaId);

                    commandText.Append(@" SELECT DISTINCT ITEMID AS [Key], ITEMID AS [Value] 
                                 FROM [ext].[BULKITEMTRANSTABLE] WHERE DATAAREAID = @DATAAREAID ");

                    ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                        {
                            lstTxns = DataHelpers.ConvertDataTable<NimKeyValue>(ds.Tables[0]).ToList();
                        }
                    }
                }

                return lstTxns;
            }

            public async Task<SktDropdownHeader> GetDropdownDetailsAsync(Request request, StoreConfiguration config, dynamic requestObj, string ItemNumber)
            {
                SktDropdownHeader hdr = new SktDropdownHeader();
                List<SktDropdownDetail> lstLine = new List<SktDropdownDetail>();



                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@DATAAREAID", config.DataAreaId);

                    commandText.Append(@" SELECT  ITEMID,AMOUNT FROM ax.INVENTTABLE  as a JOIN ax.PRICEDISCTABLE as b ON a.ITEMID=b.ITEMRELATION  AND DATAAREAID = @DATAAREAID");

                    ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                        {
                            hdr = DataHelpers.ConvertDataTable<SktDropdownHeader>(ds.Tables[0]).ToList()[0];
                        }

                        if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                        {
                            lstLine = DataHelpers.ConvertDataTable<SktDropdownDetail>(ds.Tables[1]).ToList();
                        }

                        hdr.LstLines = lstLine;
                    }
                }

                return hdr;
            }

        }
    }
}