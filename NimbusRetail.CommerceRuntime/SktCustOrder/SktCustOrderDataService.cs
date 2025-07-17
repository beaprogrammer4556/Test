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
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        public class SktCustOrderDataService : IRequestHandlerAsync
        {
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(SktCustOrderRequest)
                    };
                }
            }

            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");
                Type reqType = request.GetType();

                if (reqType == typeof(SktCustOrderRequest))
                {
                    return await this.ExecuteNewCustOrderAsync((SktCustOrderRequest)request).ConfigureAwait(false);

                }
                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

            public async Task<SktCustOrderResponse> ExecuteNewCustOrderAsync(SktCustOrderRequest request)
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
                        case "GENERATECUSTORDNUMBER":
                            resp.Payload = await GenerateCustOrderIdAsync(request, config).ConfigureAwait(false);
                            break;

                        case "SAVECUSTORDER":
                            resp.Payload = await SaveCustOrderAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETCUSTORDERDETAIL":
                            resp.Payload = await GetCustOrderAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETCUSTODRNUMBERS":
                            resp.Payload = await GetCustomerOdrNumbers(request, config).ConfigureAwait(false);
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

                return new SktCustOrderResponse(JsonConvert.SerializeObject(resp));
            }
            public async Task<string> GenerateCustOrderIdAsync(Request request, StoreConfiguration config)
            {
                ReceiptNoGeneration objOrdNo = new ReceiptNoGeneration();
                NIMCustomReceiptInfo _customReceipt = new NIMCustomReceiptInfo();
                _customReceipt.ReceiptTransactionType = (int)ReceiptTransactionType.SktCustOrder;
                _customReceipt = await objOrdNo.GetNextReceiptID_V2Async(request, config, _customReceipt).ConfigureAwait(false);
                return _customReceipt.ReceiptId;
            }

            public async Task<List<NimKeyValue>> GetCustomerOdrNumbers(Request request, StoreConfiguration config)
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
                    pSet.Add("@TERMINALID", config.TerminalId);
                    pSet.Add("@CHANNEL", config.Channel);


                    commandText.Append(@"   SELECT DISTINCT ORDERNUMBER AS [Key], ORDERNUMBER AS [Value] 
                                 FROM [ext].[SKTCUSTORDERHEADER] WHERE DATAAREAID = @DATAAREAID AND STORE = @STORE AND TERMINALID= @TERMINALID AND CHANNEL= @CHANNEL");

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
            public async Task<int> SaveCustOrderAsync(Request request, StoreConfiguration config, dynamic requestObj, string JsonObjStr)
            {
                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                using (var transactionScope = CommonHelper.CreateReadCommittedTransactionScope())
                {
                    #region Header

                    SktCustOrderHeader hdr = JsonConvert.DeserializeObject<SktCustOrderHeader>(JsonObjStr);
                    var queryHeader = _Get_CustOrder_Header_Query(config, hdr);
                    await databaseContext.ExecuteNonQueryAsync(queryHeader).ConfigureAwait(false);

                    #endregion

                    #region Details

                    decimal LineNum = 1.00m;
                    if (hdr.LstLines != null && hdr.LstLines.Count > 0)
                    {
                        foreach (SktCustOrderDetail _item in hdr.LstLines)
                        {
                            var queryDetails = _Get_CustOrder_Detail_Query(config, _item, LineNum);
                            await databaseContext.ExecuteNonQueryAsync(queryDetails).ConfigureAwait(false);
                            LineNum = LineNum + 1;
                        }
                    }

                    #endregion

                    transactionScope.Complete();
                }

                return 0;
            }

            private SqlQuery _Get_CustOrder_Header_Query(StoreConfiguration config, SktCustOrderHeader hdr)
            {
                StringBuilder headerStr = new StringBuilder();
                ReceiptNoGeneration objTransNo = new ReceiptNoGeneration();
                headerStr.Append(objTransNo.UpdateOtherReceiptLastSeedValue(config, (int)ReceiptTransactionType.SktCustOrder, hdr.ORDERNUMBER));

                headerStr.Append(@" INSERT INTO [ext].[SKTCUSTORDERHEADER]
                                    (
	                                    [DATAAREAID], [CHANNEL], [STORE], [TERMINALID], [ORDERNUMBER], [CUSTACCOUNT],[CUSTNAME],
                                        [ORDERDATE], [DELIVERYDATE],[OFFERSTATUS],[FLOTINGSTATUS],[INVENTLOCATION],[SALESPERSON],[REMARKS],[TOTALMETALWT],
                                        [OFFODRADV],[EXPDATE],[ITEMID],[PIECES],[TAXPERCENT]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@CHANNEL,@STORE,@TERMINALID,@ORDERNUMBER,@CUSTACCOUNT,@CUSTNAME,@ORDERDATE,
                                         @DELIVERYDATE,@OFFERSTATUS,@FLOTINGSTATUS,@INVENTLOCATION,@SALESPERSON,@REMARKS,@TOTALMETALWT,
                                         @OFFODRADV,@EXPDATE,@ITEMID,@PIECES,@TAXPERCENT
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                DateTime cstDt = DateTime.ParseExact(hdr.ORDERDATE, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                DateTime cstDt2 = DateTime.ParseExact(hdr.DELIVERYDATE, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                DateTime cstDt3 = DateTime.ParseExact(hdr.EXPDATE, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@CHANNEL"] = config.Channel;
                headerQuery.Parameters["@STORE"] = config.Store;
                headerQuery.Parameters["@TERMINALID"] = config.TerminalId;
                headerQuery.Parameters["@ORDERNUMBER"] = hdr.ORDERNUMBER;
                headerQuery.Parameters["@CUSTACCOUNT"] = hdr.CUSTACCOUNT;
                headerQuery.Parameters["@CUSTNAME"] = hdr.CUSTNAME;
                headerQuery.Parameters["@ORDERDATE"] = cstDt.ToString("yyyy-MM-dd");
                headerQuery.Parameters["@DELIVERYDATE"] = cstDt2.ToString("yyyy-MM-dd"); 
                headerQuery.Parameters["@OFFERSTATUS"] = hdr.OFFERSTATUS;
                headerQuery.Parameters["@FLOTINGSTATUS"] = hdr.FLOTINGSTATUS;
                headerQuery.Parameters["@INVENTLOCATION"] = hdr.INVENTLOCATION;
                headerQuery.Parameters["@SALESPERSON"] = hdr.SALESPERSON;
                headerQuery.Parameters["@REMARKS"] = hdr.REMARKS;
                headerQuery.Parameters["@TOTALMETALWT"] = hdr.TOTALMETALWT;
                headerQuery.Parameters["@OFFODRADV"] = hdr.OFFODRADV;
                headerQuery.Parameters["@EXPDATE"] = cstDt3.ToString("yyyy-MM-dd");
                headerQuery.Parameters["@ITEMID"] = hdr.ITEMID;
                headerQuery.Parameters["@TAXPERCENT"] = hdr.TAXPERCENT;
                return headerQuery;
            }

            private SqlQuery _Get_CustOrder_Detail_Query(StoreConfiguration config, SktCustOrderDetail dtl, decimal lineNum)
            {
                StringBuilder headerStr = new StringBuilder();
                headerStr.Append(@" INSERT INTO [ext].[SKTCUSTORDERDETAIL]
                                    (
	                                    [DATAAREAID],[CHANNEL],[STORE],[TERMINALID],[ORDERNUMBER],[LINENUM],[ITEMID],
                                        [PIECES],[CVALUE],[GROSSTOTAL],[NETTOTAL],[TAXTOTAL],[TOTALDISCOUNT]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@CHANNEL,@STORE,@TERMINALID,@ORDERNUMBER,@LINENUM,@ITEMID,
                                         @PIECES,@CVALUE,@GROSSTOTAL,@NETTOTAL,@TAXTOTAL,@TOTALDISCOUNT
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());
                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@CHANNEL"] = config.Channel;
                headerQuery.Parameters["@STORE"] = config.Store;
                headerQuery.Parameters["@TERMINALID"] = config.TerminalId;
                headerQuery.Parameters["@ORDERNUMBER"] = dtl.ORDERNUMBER;
                headerQuery.Parameters["@LINENUM"] = lineNum;
                headerQuery.Parameters["@ITEMID"] = dtl.ITEMID;
                headerQuery.Parameters["@PIECES"] = dtl.PIECES;
                headerQuery.Parameters["@CVALUE"] = dtl.CVALUE;
                headerQuery.Parameters["@GROSSTOTAL"] = dtl.GROSSTOTAL;
                headerQuery.Parameters["@NETTOTAL"] = dtl.NETTOTAL;
                headerQuery.Parameters["@TAXTOTAL"] = dtl.TAXTOTAL;
                headerQuery.Parameters["@TOTALDISCOUNT"] = dtl.TOTALDISCOUNT; 
                return headerQuery;
            }

            #endregion
            public async Task<SktCustOrderHeader> GetCustOrderAsync(Request request, StoreConfiguration config, dynamic requestObj, string CustOrderNumber)
            {
                SktCustOrderHeader hdr = new SktCustOrderHeader();
                List<SktCustOrderDetail> lstLine = new List<SktCustOrderDetail>();



                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@ORDERNUMBER", CustOrderNumber);
                    pSet.Add("@DATAAREAID", config.DataAreaId);
                    pSet.Add("@STORE", config.Store);
                    pSet.Add("@TERMINALID", config.TerminalId);
                    pSet.Add("@CHANNEL", config.Channel);

                    commandText.Append(@"   SELECT ORDERNUMBER, FORMAT(EXPDATE,'dd-MM-yyyy') AS EXPDATE, CUSTACCOUNT, CUSTNAME, OFFERSTATUS,FLOTINGSTATUS, INVENTLOCATION, SALESPERSON,
                                            REMARKS,TOTALMETALWT,OFFODRADV,ITEMID,PIECES,TAXPERCENT
                                            FROM [ext].[SKTCUSTORDERHEADER] WHERE ORDERNUMBER = @ORDERNUMBER AND DATAAREAID = @DATAAREAID AND STORE = @STORE AND TERMINALID=@TERMINALID AND CHANNEL=@CHANNEL;

                                            SELECT ORDERNUMBER,LINENUM,ITEMID,PIECES,CVALUE,GROSSTOTAL,NETTOTAL,TAXTOTAL,TOTALDISCOUNT
                                            FROM [ext].[SKTCUSTORDERDETAIL] WHERE ORDERNUMBER = @ORDERNUMBER AND DATAAREAID = @DATAAREAID AND STORE = @STORE AND TERMINALID=@TERMINALID AND CHANNEL=@CHANNEL");

                    ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                        {
                            hdr = DataHelpers.ConvertDataTable<SktCustOrderHeader>(ds.Tables[0]).ToList()[0];
                        }

                        if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                        {
                            lstLine = DataHelpers.ConvertDataTable<SktCustOrderDetail>(ds.Tables[1]).ToList();
                        }

                        hdr.LstLines = lstLine;
                    }
                }

                return hdr;
            }

        }
    }
}
