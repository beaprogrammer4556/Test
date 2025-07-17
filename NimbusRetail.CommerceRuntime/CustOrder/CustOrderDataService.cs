
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

        public class CustOrderDataService : IRequestHandlerAsync
        {
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(CustOrderRequest)
                    };
                }
            }

            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");
                Type reqType = request.GetType();

                if (reqType == typeof(CustOrderRequest))
                {
                    return await this.ExecuteSampleAsync((CustOrderRequest)request).ConfigureAwait(false);

                }
                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

            public async Task<CustOrderResponse> ExecuteSampleAsync(CustOrderRequest request)
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
                        case "GENERATEORDID":
                            resp.Payload = await GenerateOrderIdAsync(request, config).ConfigureAwait(false);
                            break;
                        case "SAVEORD":
                            resp.Payload = await SaveCustomerOrderAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETORDDETAIL":
                            resp.Payload = await GetCustomerOrderDetailsAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETORDNUMBERS":
                            resp.Payload = await GetOrderNumbersAsync(request, config).ConfigureAwait(false);
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

                return new CustOrderResponse(JsonConvert.SerializeObject(resp));
            }

            #region Save Data

            public async Task<int> SaveCustomerOrderAsync(Request request, StoreConfiguration config, dynamic requestObj, string JsonObjStr)
            {
                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                using (var transactionScope = CommonHelper.CreateReadCommittedTransactionScope())
                {
                    #region Header

                    CustOrderHeader hdr = JsonConvert.DeserializeObject<CustOrderHeader>(JsonObjStr);
                    var queryHeader = _Get_CustomerOrder_Header_Query(config, hdr);
                    await databaseContext.ExecuteNonQueryAsync(queryHeader).ConfigureAwait(false);

                    #endregion

                    #region Details

                    decimal LineNum = 1.00m;
                    if (hdr.LstLines != null && hdr.LstLines.Count > 0)
                    {
                        foreach (CustOrderDetail _item in hdr.LstLines)
                        {
                            var queryDetails = _Get_CustomerOrder_Detail_Query(config, _item, LineNum);
                            await databaseContext.ExecuteNonQueryAsync(queryDetails).ConfigureAwait(false);
                            LineNum = LineNum + 1;
                        }
                    }

                    #endregion

                    transactionScope.Complete();
                }

                return 0;
            }

            private SqlQuery _Get_CustomerOrder_Header_Query(StoreConfiguration config, CustOrderHeader hdr)
            {
                StringBuilder headerStr = new StringBuilder();

                //To increment Pos seed value
                ReceiptNoGeneration objTransNo = new ReceiptNoGeneration();
                headerStr.Append(objTransNo.UpdateOtherReceiptLastSeedValue(config, (int)ReceiptTransactionType.Order, hdr.ORDERNUMBER));

                headerStr.Append(@" INSERT INTO [ext].[CUSTOMERORDERHEADER]
                                    (
	                                    [DATAAREAID], [CHANNEL], [STORE], [TERMINALID], [ORDERNUMBER], [TRANSDATE],[DELIVERYDATE],
                                        [CUSTACCOUNT], [CUSTMOBILE],[CUSTNAME],[GROSSTOTAL],[RETAILSTAFFID],[TAXTOTAL],[NETTOTAL]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@CHANNEL,@STORE,@TERMINALID,@ORDERNUMBER,@TRANSDATE,@DELIVERYDATE,@CUSTACCOUNT,
                                         @CUSTMOBILE,@CUSTNAME,@GROSSTOTAL,@RETAILSTAFFID,@TAXTOTAL,@NETTOTAL
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                DateTime txnDt = DateTime.ParseExact(hdr.TRANSDATE, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                DateTime DeliveryDt = DateTime.ParseExact(hdr.DELIVERYDATE, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@CHANNEL"] = config.Channel;
                headerQuery.Parameters["@STORE"] = config.Store;
                headerQuery.Parameters["@TERMINALID"] = config.TerminalId;
                headerQuery.Parameters["@ORDERNUMBER"] = hdr.ORDERNUMBER;
                headerQuery.Parameters["@TRANSDATE"] = txnDt.ToString("yyyy-MM-dd");
                headerQuery.Parameters["@DELIVERYDATE"] = DeliveryDt.ToString("yyyy-MM-dd");
                headerQuery.Parameters["@CUSTACCOUNT"] = hdr.CUSTACCOUNT;
                headerQuery.Parameters["@CUSTMOBILE"] = hdr.CUSTMOBILE;
                headerQuery.Parameters["@CUSTNAME"] = hdr.CUSTNAME;
                headerQuery.Parameters["@GROSSTOTAL"] = hdr.GROSSTOTAL;
                headerQuery.Parameters["@RETAILSTAFFID"] = config.StaffId;
                headerQuery.Parameters["@TAXTOTAL"] = hdr.TAXTOTAL;
                headerQuery.Parameters["@NETTOTAL"] = hdr.NETTOTAL;
                return headerQuery;
            }

            private SqlQuery _Get_CustomerOrder_Detail_Query(StoreConfiguration config, CustOrderDetail dtl, decimal lineNum)
            {
                StringBuilder headerStr = new StringBuilder();
                headerStr.Append(@" INSERT INTO [ext].[CUSTOMERORDERDETAIL]
                                    (
	                                    [DATAAREAID],[CHANNEL],[STORE],[TERMINALID],[ORDERNUMBER],[LINENUM],[ITEMID],
                                        [ITEMDESCRIPTION],[QUANTITY],[MRP],[DISCPERCENT],[DISCAMOUNT],[NETAMOUNT],[TAXPERCENT],
	                                    [TAXAMOUNT],[TOTALAMOUNT]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@CHANNEL,@STORE,@TERMINALID,@ORDERNUMBER,@LINENUM,@ITEMID,
                                         @ITEMDESCRIPTION,@QUANTITY,@MRP,@DISCPERCENT,@DISCAMOUNT,@NETAMOUNT,@TAXPERCENT,
	                                     @TAXAMOUNT,@TOTALAMOUNT
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@CHANNEL"] = config.Channel;
                headerQuery.Parameters["@STORE"] = config.Store;
                headerQuery.Parameters["@TERMINALID"] = config.TerminalId;
                headerQuery.Parameters["@ORDERNUMBER"] = dtl.ORDERNUMBER;
                headerQuery.Parameters["@LINENUM"] = lineNum;
                headerQuery.Parameters["@ITEMID"] = dtl.ITEMID;
                headerQuery.Parameters["@ITEMDESCRIPTION"] = dtl.ITEMDESCRIPTION;
                headerQuery.Parameters["@QUANTITY"] = dtl.QUANTITY;
                headerQuery.Parameters["@MRP"] = dtl.MRP;
                headerQuery.Parameters["@DISCPERCENT"] = dtl.DISCPERCENT;
                headerQuery.Parameters["@DISCAMOUNT"] = dtl.DISCAMOUNT;
                headerQuery.Parameters["@NETAMOUNT"] = dtl.NETAMOUNT;
                headerQuery.Parameters["@TAXPERCENT"] = dtl.TAXPERCENT;
                headerQuery.Parameters["@TAXAMOUNT"] = dtl.TAXAMOUNT;
                headerQuery.Parameters["@TOTALAMOUNT"] = dtl.TOTALAMOUNT;

                return headerQuery;
            }


            #endregion

            // EXT.NIMPOSSEEDVALUE and EXT.RETAILRECEIPTMASKSCUSTOM
            public async Task<string> GenerateOrderIdAsync(Request request, StoreConfiguration config)
            {
                ReceiptNoGeneration objOrdNo = new ReceiptNoGeneration();
                NIMCustomReceiptInfo _customReceipt = new NIMCustomReceiptInfo();
                _customReceipt.ReceiptTransactionType = (int)ReceiptTransactionType.Order;
                _customReceipt = await objOrdNo.GetNextReceiptID_V2Async(request, config, _customReceipt).ConfigureAwait(false);
                return _customReceipt.ReceiptId;
            }

            public async Task<CustOrderHeader> GetCustomerOrderDetailsAsync(Request request, StoreConfiguration config, dynamic requestObj, string OrderNo)
            {
                CustOrderHeader hdr = new CustOrderHeader();
                List<CustOrderDetail> lstLine = new List<CustOrderDetail>();

                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@ORDERNUMBER", OrderNo);
                    pSet.Add("@DATAAREAID", config.DataAreaId);
                    pSet.Add("@STORE", config.Store);

                    commandText.Append(@"   SELECT ORDERNUMBER, FORMAT(TRANSDATE, 'dd-MM-yyyy') AS TRANSDATE, FORMAT(DELIVERYDATE, 'dd-MM-yyyy') AS DELIVERYDATE, CUSTACCOUNT, CUSTMOBILE, CUSTNAME, GROSSTOTAL, TAXTOTAL, NETTOTAL 
                                 FROM [ext].[CUSTOMERORDERHEADER] WHERE ORDERNUMBER = @ORDERNUMBER AND DATAAREAID = @DATAAREAID AND STORE = @STORE


                                 SELECT ORDERNUMBER,LINENUM,ITEMID,ITEMDESCRIPTION,QUANTITY,MRP,DISCPERCENT,DISCAMOUNT,
                                        NETAMOUNT,TAXPERCENT,TAXAMOUNT,TOTALAMOUNT
                                 FROM [ext].[CUSTOMERORDERDETAIL] WHERE ORDERNUMBER = @ORDERNUMBER AND DATAAREAID = @DATAAREAID AND STORE = @STORE  ");

                    ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                        {
                            hdr = DataHelpers.ConvertDataTable<CustOrderHeader>(ds.Tables[0]).ToList()[0];
                        }

                        if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                        {
                            lstLine = DataHelpers.ConvertDataTable<CustOrderDetail>(ds.Tables[1]).ToList();
                        }

                        hdr.LstLines = lstLine;
                    }
                }

                return hdr;
            }

            public async Task<List<NimKeyValue>> GetOrderNumbersAsync(Request request, StoreConfiguration config)
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

                    commandText.Append(@"   SELECT DISTINCT ORDERNUMBER AS [Key], ORDERNUMBER AS [Value] 
                                 FROM [ext].[CUSTOMERORDERHEADER] WHERE DATAAREAID = @DATAAREAID AND STORE = @STORE ");

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













        }
    }
}


