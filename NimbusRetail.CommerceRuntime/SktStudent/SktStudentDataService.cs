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

        public class SktStudentDataService : IRequestHandlerAsync
        {
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(SktStudentRequest)
                    };
                }
            }

            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");
                Type reqType = request.GetType();

                if (reqType == typeof(SktStudentRequest))
                {
                    return await this.ExecuteNewSktStudentAsync((SktStudentRequest)request).ConfigureAwait(false);

                }
                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

            public async Task<SktStudentResponse> ExecuteNewSktStudentAsync(SktStudentRequest request)
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
                        case "GENERATESTUDENTID":
                            resp.Payload = await GenerateStudentIdAsync(request, config).ConfigureAwait(false);
                            break;

                        case "SAVESTUDENTDETAIL":
                            resp.Payload = await SaveStudentDetailAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETSTUDENTID":
                            resp.Payload = await GetStudentIdNumbers(request, config).ConfigureAwait(false);
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

                return new SktStudentResponse(JsonConvert.SerializeObject(resp));
            }
            public async Task<string> GenerateStudentIdAsync(Request request, StoreConfiguration config)
            {
                ReceiptNoGeneration objOrdNo = new ReceiptNoGeneration();
                NIMCustomReceiptInfo _customReceipt = new NIMCustomReceiptInfo();
                _customReceipt.ReceiptTransactionType = (int)ReceiptTransactionType.SktCustOrder;
                _customReceipt = await objOrdNo.GetNextReceiptID_V2Async(request, config, _customReceipt).ConfigureAwait(false);
                return _customReceipt.ReceiptId;
            }

            public async Task<List<NimKeyValue>> GetStudentIdNumbers(Request request, StoreConfiguration config)
            {
                List<NimKeyValue> lstTxns = new List<NimKeyValue>();
                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@DATAAREAID", config.DataAreaId);
                    pSet.Add("@STORE", config.Store);

                    commandText.Append(@"   SELECT DISTINCT STUDENTID AS [Key], STUDENTID AS [Value] 
                                 FROM [ext].[STUDENTINFOHEADER] WHERE DATAAREAID = @DATAAREAID ");

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

            #region Save Block
            public async Task<int> SaveStudentDetailAsync(Request request, StoreConfiguration config, dynamic requestObj, string JsonObjStr)
            {
                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                using (var transactionScope = CommonHelper.CreateReadCommittedTransactionScope())
                {
                    #region Header

                    StudentInfoHeader hdr = JsonConvert.DeserializeObject<StudentInfoHeader>(JsonObjStr);
                    var queryHeader = _Get_StudentInfo_Header_Query(config, hdr);
                    await databaseContext.ExecuteNonQueryAsync(queryHeader).ConfigureAwait(false);

                    #endregion

                    #region Details

                    decimal LineNum = 1.00m;
                    if (hdr.LstLines != null && hdr.LstLines.Count > 0)
                    {
                        foreach (StudentResultDetail _item in hdr.LstLines)
                        {
                            var queryDetails = _Get_StudentResult_Detail_Query(config, _item, LineNum);
                            await databaseContext.ExecuteNonQueryAsync(queryDetails).ConfigureAwait(false);
                            LineNum = LineNum + 1;
                        }
                    }

                    #endregion

                    transactionScope.Complete();
                }

                return 0;
            }

            private SqlQuery _Get_StudentInfo_Header_Query(StoreConfiguration config, StudentInfoHeader hdr)
            {
                StringBuilder headerStr = new StringBuilder();
                ReceiptNoGeneration objTransNo = new ReceiptNoGeneration();
                headerStr.Append(objTransNo.UpdateOtherReceiptLastSeedValue(config, (int)ReceiptTransactionType.SktCustOrder, hdr.STUDENTID));

                headerStr.Append(@" INSERT INTO [ext].[StudentInfoHeader]
                                    (
	                                    [DATAAREAID], [STUDENTID], [STUDENTNAME],[STUDENTCLASS]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@STUDENTID,@STUDENTNAME,@STUDENTCLASS
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@STUDENTID"] = hdr.STUDENTID;
                headerQuery.Parameters["@STUDENTNAME"] = hdr.STUDENTNAME;
                headerQuery.Parameters["@STUDENTCLASS"] = hdr.STUDENTCLASS;
               
                return headerQuery;
            }

            private SqlQuery _Get_StudentResult_Detail_Query(StoreConfiguration config, StudentResultDetail dtl, decimal lineNum)
            {
                StringBuilder headerStr = new StringBuilder();
                headerStr.Append(@" INSERT INTO [ext].[StudentResultDetail]
                                    (
	                                    [DATAAREAID],[STUDENTID],[LINENUM],[SUBJECT1],[SUBJECT2],[SUBJECT3]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@STUDENTID,@LINENUM,@SUBJECT1,@SUBJECT2,@SUBJECT3
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@STUDENTID"] = dtl.STUDENTID;
                headerQuery.Parameters["@LINENUM"] = lineNum;
                headerQuery.Parameters["@SUBJECT1"] = dtl.SUBJECT1;
                headerQuery.Parameters["@SUBJECT2"] = dtl.SUBJECT2;
                headerQuery.Parameters["@SUBJECT3"] = dtl.SUBJECT3;

                return headerQuery;
            }

            #endregion
            //public async Task<StudentInfoHeader> GetRepairOrderAsync(Request request, StoreConfiguration config, dynamic requestObj, string RepairOrderNumber)
            //{
            //    StudentInfoHeader hdr = new StudentInfoHeader();
            //    List<StudentResultDetail> lstLine = new List<StudentResultDetail>();



            //    using (DatabaseContext context = new DatabaseContext(request.RequestContext))
            //    {
            //        String NewLine = Environment.NewLine;
            //        StringBuilder commandText = new StringBuilder();
            //        DataSet ds = new DataSet();

            //        ParameterSet pSet = new ParameterSet();
            //        pSet.Add("@REPAIRORDERNUMBER", RepairOrderNumber);
            //        pSet.Add("@DATAAREAID", config.DataAreaId);
            //        pSet.Add("@STORE", config.Store);

            //        commandText.Append(@"   SELECT REPAIRORDERNUMBER, FORMAT(TRANSDATE, 'dd-MM-yyyy') AS TRANSDATE,FORMAT(DELIVERYDATE, 'dd-MM-yyyy') AS DELIVERYDATE, 
										  //  CUSTACCOUNT, CUSTMOBILE, CUSTNAME,TOTALCHARGES, GROSSTOTAL, TAXTOTAL
            //                                FROM [ext].[RETAILStudentInfoHeader] WHERE REPAIRORDERNUMBER = @REPAIRORDERNUMBER AND DATAAREAID = @DATAAREAID AND STORE = @STORE

            //                                SELECT REPAIRORDERNUMBER,LINENUM,ITEMID,ITEMDESCRIPTION,CAST(QUANTITY AS NUMERIC(28, 3)) AS QUANTITY,REPAIRCHARGE,
            //                                       TAXPERCENT,TAXAMOUNT,TOTALAMOUNT
            //                                FROM [ext].[StudentResultDetail] WHERE REPAIRORDERNUMBER = @REPAIRORDERNUMBER AND DATAAREAID = @DATAAREAID AND STORE = @STORE  ");

            //        ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);
            //        if (ds != null && ds.Tables.Count > 0)
            //        {
            //            if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            //            {
            //                hdr = DataHelpers.ConvertDataTable<StudentInfoHeader>(ds.Tables[0]).ToList()[0];
            //            }

            //            if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            //            {
            //                lstLine = DataHelpers.ConvertDataTable<StudentResultDetail>(ds.Tables[1]).ToList();
            //            }

            //            hdr.LstLines = lstLine;
            //        }
            //    }

            //    return hdr;
            //}

        }
    }
}