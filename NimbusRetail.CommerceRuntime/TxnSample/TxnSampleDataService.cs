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
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using System.Globalization;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using System.Linq;

        public class TxnSampleDataService : IRequestHandlerAsync
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

                if (reqType == typeof(TxnSampleRequest))
                {
                    return await this.ExecuteTxnSampleAsync((TxnSampleRequest)request).ConfigureAwait(false);

                }
                throw new NotSupportedException(string.Format("Request '{0}' is not supportable.", request.GetType()));
            }

            public async Task<TxnSampleResponse> ExecuteTxnSampleAsync(TxnSampleRequest request)
            {
                StringBuilder commandText = new StringBuilder();
                BasicResponse resp = new BasicResponse()
                {
                    ErrorDetails = "",
                    Message = "Success",
                    Payload = "",
                    Remarks = "Operation executed successfully !",
                    Status = 200
                };

                try
                {

                    StoreConfiguration config = await StoreConfiguration.GetConfigurationAsync(request).ConfigureAwait(false);
                    dynamic requestObj = JsonConvert.DeserializeObject<dynamic>(request.RequestVal);
                    string _Operation = requestObj.Opreration;
                    switch (_Operation)
                    {
                        case "GENERATETXNID":
                            resp.Payload = await GenerateTransactionIdAsync(request, config).ConfigureAwait(false);
                            break;

                        case "SAVETXN":
                            resp.Payload = await SaveTransactionAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETTXNDETAIL":
                            resp.Payload = await GetTransactionDetailsAsync(request, config, requestObj, request.ObjStrVal).ConfigureAwait(false);
                            break;

                        case "GETTXNNUMBERS":
                            resp.Payload = await GetTransactionNumbersAsync(request, config).ConfigureAwait(false);
                            break;

                        case "GETORDERNUM":
                            resp.Payload = await GetOrdrNumbersAsync(request, config).ConfigureAwait(false);
                            break;
                        default:
                            resp.Payload = null;
                            break;

                    }
                }
                catch (Exception ex)
                {
                    await CommonHelper.GenerateErrorLogAsync(request, "TXN-SAM", ex.StackTrace, ex.InnerException).ConfigureAwait(false);
                    resp.ErrorDetails = ex.StackTrace + "|" + ex.Source;
                    resp.Message = ex.Message;
                    resp.Payload = "";
                    resp.Remarks = ex.Message;
                    resp.Status = 201;
                }

                return new TxnSampleResponse(JsonConvert.SerializeObject(resp));
            }

            #region Save Block

            //15-10-2024 Receipt No Gen   
            // EXT.NIMPOSSEEDVALUE and EXT.RETAILRECEIPTMASKSCUSTOM
            public async Task<string> GenerateTransactionIdAsync(Request request, StoreConfiguration config)
            {
                ReceiptNoGeneration objTransNo = new ReceiptNoGeneration();
                NIMCustomReceiptInfo _customReceipt = new NIMCustomReceiptInfo();
                _customReceipt.ReceiptTransactionType = (int)ReceiptTransactionType.TxnSample;
                _customReceipt = await objTransNo.GetNextReceiptID_V2Async(request, config, _customReceipt).ConfigureAwait(false);
                return _customReceipt.ReceiptId;
            }


            public async Task<int> SaveTransactionAsync(Request request, StoreConfiguration config, dynamic requestObj, string JsonObjStr)
            {
                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                using (var transactionScope = CommonHelper.CreateReadCommittedTransactionScope())
                {
                    #region Header

                    TxnHeader hdr = JsonConvert.DeserializeObject<TxnHeader>(JsonObjStr);
                    var queryHeader = _Get_Txn_Header_Query(config, hdr);
                    await databaseContext.ExecuteNonQueryAsync(queryHeader).ConfigureAwait(false);

                    #endregion

                    #region Details

                    decimal LineNum = 1.00m;
                    if (hdr.LstLines != null && hdr.LstLines.Count > 0)
                    {
                        foreach (TxnDetail _item in hdr.LstLines)
                        {
                            var queryDetails = _Get_Txn_Detail_Query(config, _item, LineNum);
                            await databaseContext.ExecuteNonQueryAsync(queryDetails).ConfigureAwait(false);
                            LineNum = LineNum + 1;
                        }
                    }

                    #endregion

                    transactionScope.Complete();
                }

                return 0;
            }

            private SqlQuery _Get_Txn_Header_Query(StoreConfiguration config, TxnHeader hdr)
            {
                StringBuilder headerStr = new StringBuilder();

                //To increment Pos seed value
                ReceiptNoGeneration objTransNo = new ReceiptNoGeneration();
                headerStr.Append(objTransNo.UpdateOtherReceiptLastSeedValue(config, (int)ReceiptTransactionType.TxnSample, hdr.TRANSACTIONID));

                headerStr.Append(@" INSERT INTO [ext].[TRANSACTIONHEADER]
                                    (
	                                    [DATAAREAID], [CHANNEL], [STORE], [TERMINALID], [TRANSACTIONID], [TRANSDATE],
                                        [CUSTACCOUNT], [CUSTMOBILE],[CUSTNAME],[GROSSTOTAL],[RETAILSTAFFID],[TAXTOTAL],[NETTOTAL]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@CHANNEL,@STORE,@TERMINALID,@TRANSACTIONID,@TRANSDATE,@CUSTACCOUNT,
                                         @CUSTMOBILE,@CUSTNAME,@GROSSTOTAL,@RETAILSTAFFID,@TAXTOTAL,@NETTOTAL
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                DateTime txnDt = DateTime.ParseExact(hdr.TRANSDATE, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@CHANNEL"] = config.Channel;
                headerQuery.Parameters["@STORE"] = config.Store;
                headerQuery.Parameters["@TERMINALID"] = config.TerminalId;
                headerQuery.Parameters["@TRANSACTIONID"] = hdr.TRANSACTIONID;
                headerQuery.Parameters["@TRANSDATE"] = txnDt.ToString("yyyy-MM-dd");
                headerQuery.Parameters["@CUSTACCOUNT"] = hdr.CUSTACCOUNT;
                headerQuery.Parameters["@CUSTMOBILE"] = hdr.CUSTMOBILE;
                headerQuery.Parameters["@CUSTNAME"] = hdr.CUSTNAME;
                headerQuery.Parameters["@GROSSTOTAL"] = hdr.GROSSTOTAL;
                headerQuery.Parameters["@RETAILSTAFFID"] = config.StaffId;
                headerQuery.Parameters["@TAXTOTAL"] = hdr.TAXTOTAL;
                headerQuery.Parameters["@NETTOTAL"] = hdr.NETTOTAL;
                return headerQuery;
            }

            private SqlQuery _Get_Txn_Detail_Query(StoreConfiguration config, TxnDetail dtl, decimal lineNum)
            {
                StringBuilder headerStr = new StringBuilder();
                headerStr.Append(@" INSERT INTO [ext].[TRANSACTIONDETAIL]
                                    (
	                                    [DATAAREAID],[CHANNEL],[STORE],[TERMINALID],[TRANSACTIONID],[LINENUM],[ITEMID],
                                        [ITEMDESCRIPTION],[MRP],[DISCPERCENT],[DISCAMOUNT],[NETAMOUNT],[TAXPERCENT],
	                                    [TAXAMOUNT],[TOTALAMOUNT]
                                    )
                                    VALUES
                                    (
	                                     @DATAAREAID,@CHANNEL,@STORE,@TERMINALID,@TRANSACTIONID,@LINENUM,@ITEMID,
                                         @ITEMDESCRIPTION,@MRP,@DISCPERCENT,@DISCAMOUNT,@NETAMOUNT,@TAXPERCENT,
	                                     @TAXAMOUNT,@TOTALAMOUNT
                                    ) ");

                var headerQuery = new SqlQuery(headerStr.ToString());

                headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
                headerQuery.Parameters["@CHANNEL"] = config.Channel;
                headerQuery.Parameters["@STORE"] = config.Store;
                headerQuery.Parameters["@TERMINALID"] = config.TerminalId;
                headerQuery.Parameters["@TRANSACTIONID"] = dtl.TRANSACTIONID;
                headerQuery.Parameters["@LINENUM"] = lineNum;
                headerQuery.Parameters["@ITEMID"] = dtl.ITEMID;
                headerQuery.Parameters["@ITEMDESCRIPTION"] = dtl.ITEMDESCRIPTION;
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


            public async Task<TxnHeader> GetTransactionDetailsAsync(Request request, StoreConfiguration config, dynamic requestObj, string TransactionId)
            {
                TxnHeader hdr = new TxnHeader();
                List<TxnDetail> lstLine = new List<TxnDetail>();

                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@TRANSACTIONID", TransactionId);
                    pSet.Add("@DATAAREAID", config.DataAreaId);
                    pSet.Add("@STORE", config.Store);

                    commandText.Append(@"   SELECT TRANSACTIONID, FORMAT(TRANSDATE, 'dd-MM-yyyy') AS TRANSDATE, CUSTACCOUNT, CUSTMOBILE, CUSTNAME, GROSSTOTAL, TAXTOTAL, NETTOTAL 
                                 FROM [ext].[TRANSACTIONHEADER] WHERE TRANSACTIONID = @TRANSACTIONID AND DATAAREAID = @DATAAREAID AND STORE = @STORE


                                 SELECT TRANSACTIONID,LINENUM,ITEMID,ITEMDESCRIPTION,MRP,DISCPERCENT,DISCAMOUNT,
                                        NETAMOUNT,TAXPERCENT,TAXAMOUNT,TOTALAMOUNT
                                 FROM [ext].[TRANSACTIONDETAIL] WHERE TRANSACTIONID = @TRANSACTIONID AND DATAAREAID = @DATAAREAID AND STORE = @STORE  ");

                    ds = await context.ExecuteQueryDataSetAsync(commandText.ToString(), pSet).ConfigureAwait(false);
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                        {
                            hdr = DataHelpers.ConvertDataTable<TxnHeader>(ds.Tables[0]).ToList()[0];
                        }

                        if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                        {
                            lstLine = DataHelpers.ConvertDataTable<TxnDetail>(ds.Tables[1]).ToList();
                        }

                        hdr.LstLines = lstLine;
                    }
                }

                return hdr;
            }

            public async Task<List<NimKeyValue>> GetTransactionNumbersAsync(Request request, StoreConfiguration config)
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

                    commandText.Append(@"   SELECT DISTINCT TRANSACTIONID AS [Key], TRANSACTIONID AS [Value] 
                                 FROM [ext].[TRANSACTIONHEADER] WHERE DATAAREAID = @DATAAREAID AND STORE = @STORE ");

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

            public async Task<List<IDropdownV2>> GetOrdrNumbersAsync(Request request, StoreConfiguration config)
            {
                List<IDropdownV2> lstTxns = new List<IDropdownV2>();
                using (DatabaseContext context = new DatabaseContext(request.RequestContext))
                {
                    String NewLine = Environment.NewLine;
                    StringBuilder commandText = new StringBuilder();
                    DataSet ds = new DataSet();

                    ParameterSet pSet = new ParameterSet();
                    pSet.Add("@DATAAREAID", config.DataAreaId);
                    pSet.Add("@STORE", config.Store);

                    commandText.Append(@"   SELECT DISTINCT TRANSACTIONID AS [value], TRANSACTIONID AS [text] 
                                 FROM [ext].[TRANSACTIONHEADER] WHERE DATAAREAID = @DATAAREAID AND STORE = @STORE ");

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

        }
    }
}
