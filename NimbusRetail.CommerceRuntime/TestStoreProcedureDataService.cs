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

        public class TestStoreProcedureDataService : IRequestHandlerAsync
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
                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

            public async Task<RepairOrderResponse> ExecuteNewTxnSampleAsync(SktDropdownRequest request)
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
                        case "SHOWDEPARTMENTNUMBER":
                            resp.Payload = await GenerateDepartmentNumber(request, config).ConfigureAwait(false);
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

                return new RepairOrderResponse(JsonConvert.SerializeObject(resp));
            }
            public async Task<string> GenerateDepartmentNumber(Request request, StoreConfiguration config)
            {
                ReceiptNoGeneration objOrdNo = new ReceiptNoGeneration();
                NIMCustomReceiptInfo _customReceipt = new NIMCustomReceiptInfo();
                _customReceipt.ReceiptTransactionType = (int)ReceiptTransactionType.RepairOrder;
                _customReceipt = await objOrdNo.GetNextReceiptID_V2Async(request, config, _customReceipt).ConfigureAwait(false);
                return _customReceipt.ReceiptId;
            }

            public async Task<List<NimKeyValue>> GetRepairOdrNumbers(Request request, StoreConfiguration config)
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

                    commandText.Append(@"   SELECT DISTINCT REPAIRORDERNUMBER AS [Key], REPAIRORDERNUMBER AS [Value] 
                                 FROM [ext].[RETAILREPAIRORDERHEADER] WHERE DATAAREAID = @DATAAREAID AND STORE = @STORE ");

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
            public async Task<int> SaveRepairOrderAsync(Request request, StoreConfiguration config, dynamic requestObj, string JsonObjStr)
            {
                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                using (var transactionScope = CommonHelper.CreateReadCommittedTransactionScope())
                {
                    #region Header

                    RepairOrderHeader hdr = JsonConvert.DeserializeObject<RepairOrderHeader>(JsonObjStr);
                    var queryHeader = _Get_RepairOrder_Header_Query(config, hdr);
                    await databaseContext.ExecuteNonQueryAsync(queryHeader).ConfigureAwait(false);

                    #endregion

                    #region Details

                    decimal LineNum = 1.00m;
                    if (hdr.LstLines != null && hdr.LstLines.Count > 0)
                    {
                        foreach (RepairOrderDetail _item in hdr.LstLines)
                        {
                            var queryDetails = _Get_RepairOrder_Detail_Query(config, _item, LineNum);
                            await databaseContext.ExecuteNonQueryAsync(queryDetails).ConfigureAwait(false);
                            LineNum = LineNum + 1;
                        }
                    }

                    #endregion

                    transactionScope.Complete();
                }

                return 0;
            }

            private SqlQuery _Get_RepairOrder_Header_Query(StoreConfiguration config, RepairOrderHeader hdr)
            {
                StringBuilder headerStr = new StringBuilder();
                ReceiptNoGeneration objTransNo = new ReceiptNoGeneration();
                headerStr.Append(objTransNo.UpdateOtherReceiptLastSeedValue(config, (int)ReceiptTransactionType.RepairOrder, hdr.REPAIRORDERNUMBER));

                headerStr.Append(@" INSERT INTO [ext].[RETAILREPAIRORDERHEADER]
                                    (
	                                    [DATAAREAID], [CHANNEL], [STORE], [TERMINALID], [REPAIRORDERNUMBER], [TRANSDATE],[DELIVERYDATE],
                                        [CUSTACCOUNT], [CUSTMOBILE],[CUSTNAME],[TOTALCHARGES],[GROSSTOTAL],[TAXTOTAL],[TOGGLESTATUS]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@CHANNEL,@STORE,@TERMINALID,@REPAIRORDERNUMBER,@TRANSDATE,@DELIVERYDATE,@CUSTACCOUNT,
                                         @CUSTMOBILE,@CUSTNAME,@TOTALCHARGES,@GROSSTOTAL,@TAXTOTAL,@TOGGLESTATUS
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                DateTime txnDt = DateTime.ParseExact(hdr.TRANSDATE, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                DateTime txnDt2 = DateTime.ParseExact(hdr.DELIVERYDATE, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@CHANNEL"] = config.Channel;
                headerQuery.Parameters["@STORE"] = config.Store;
                headerQuery.Parameters["@TERMINALID"] = config.TerminalId;
                headerQuery.Parameters["@REPAIRORDERNUMBER"] = hdr.REPAIRORDERNUMBER;
                headerQuery.Parameters["@TRANSDATE"] = txnDt.ToString("yyyy-MM-dd");
                headerQuery.Parameters["@DELIVERYDATE"] = txnDt2.ToString("yyyy-MM-dd");
                headerQuery.Parameters["@CUSTACCOUNT"] = hdr.CUSTACCOUNT;
                headerQuery.Parameters["@CUSTMOBILE"] = hdr.CUSTMOBILE;
                headerQuery.Parameters["@CUSTNAME"] = hdr.CUSTNAME;
                headerQuery.Parameters["@TOTALCHARGES"] = hdr.TOTALCHARGES;
                headerQuery.Parameters["@GROSSTOTAL"] = hdr.GROSSTOTAL;
                headerQuery.Parameters["@TAXTOTAL"] = hdr.TAXTOTAL;
                headerQuery.Parameters["@TOGGLESTATUS"] = hdr.TOGGLESTATUS;
                return headerQuery;
            }

            private SqlQuery _Get_RepairOrder_Detail_Query(StoreConfiguration config, RepairOrderDetail dtl, decimal lineNum)
            {
                StringBuilder headerStr = new StringBuilder();
                headerStr.Append(@" INSERT INTO [ext].[REPAIRORDERDETAIL]
                                    (
	                                    [DATAAREAID],[CHANNEL],[STORE],[TERMINALID],[REPAIRORDERNUMBER],[LINENUM],[ITEMID],
                                        [ITEMDESCRIPTION],[QUANTITY],[REPAIRCHARGE],[TAXPERCENT],[TAXAMOUNT],[TOTALAMOUNT]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@CHANNEL,@STORE,@TERMINALID,@REPAIRORDERNUMBER,@LINENUM,@ITEMID,
                                         @ITEMDESCRIPTION,@QUANTITY,@REPAIRCHARGE,@TAXPERCENT,@TAXAMOUNT,@TOTALAMOUNT
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@CHANNEL"] = config.Channel;
                headerQuery.Parameters["@STORE"] = config.Store;
                headerQuery.Parameters["@TERMINALID"] = config.TerminalId;
                headerQuery.Parameters["@REPAIRORDERNUMBER"] = dtl.REPAIRORDERNUMBER;
                headerQuery.Parameters["@LINENUM"] = lineNum;
                headerQuery.Parameters["@ITEMID"] = dtl.ITEMID;
                headerQuery.Parameters["@ITEMDESCRIPTION"] = dtl.ITEMDESCRIPTION;
                headerQuery.Parameters["@QUANTITY"] = dtl.QUANTITY;
                headerQuery.Parameters["@REPAIRCHARGE"] = dtl.REPAIRCHARGE;
                headerQuery.Parameters["@TAXPERCENT"] = dtl.TAXPERCENT;
                headerQuery.Parameters["@TAXAMOUNT"] = dtl.TAXAMOUNT;
                headerQuery.Parameters["@TOTALAMOUNT"] = dtl.TOTALAMOUNT;

                return headerQuery;
            }

            #endregion
            public async Task<RepairOrderHeader> GetRepairOrderAsync(Request request, StoreConfiguration config, dynamic requestObj, string RepairOrderNumber)
            {
                RepairOrderHeader hdr = new RepairOrderHeader();
                List<RepairOrderDetail> lstLine = new List<RepairOrderDetail>();



                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@REPAIRORDERNUMBER", RepairOrderNumber);
                    pSet.Add("@DATAAREAID", config.DataAreaId);
                    pSet.Add("@STORE", config.Store);

                    commandText.Append(@"   SELECT REPAIRORDERNUMBER, FORMAT(TRANSDATE, 'dd-MM-yyyy') AS TRANSDATE,FORMAT(DELIVERYDATE, 'dd-MM-yyyy') AS DELIVERYDATE, 
										    CUSTACCOUNT, CUSTMOBILE, CUSTNAME,TOTALCHARGES, GROSSTOTAL, TAXTOTAL
                                            FROM [ext].[RETAILREPAIRORDERHEADER] WHERE REPAIRORDERNUMBER = @REPAIRORDERNUMBER AND DATAAREAID = @DATAAREAID AND STORE = @STORE

                                            SELECT REPAIRORDERNUMBER,LINENUM,ITEMID,ITEMDESCRIPTION,CAST(QUANTITY AS NUMERIC(28, 3)) AS QUANTITY,REPAIRCHARGE,
                                                   TAXPERCENT,TAXAMOUNT,TOTALAMOUNT
                                            FROM [ext].[REPAIRORDERDETAIL] WHERE REPAIRORDERNUMBER = @REPAIRORDERNUMBER AND DATAAREAID = @DATAAREAID AND STORE = @STORE  ");

                    ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                        {
                            hdr = DataHelpers.ConvertDataTable<RepairOrderHeader>(ds.Tables[0]).ToList()[0];
                        }

                        if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                        {
                            lstLine = DataHelpers.ConvertDataTable<RepairOrderDetail>(ds.Tables[1]).ToList();
                        }

                        hdr.LstLines = lstLine;
                    }
                }

                return hdr;
            }

        }
    }
}