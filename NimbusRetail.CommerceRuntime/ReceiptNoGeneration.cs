namespace NimbusRetail
{
    namespace CommerceRuntime
    {
		using System;
		using System.Text;
		using System.Collections.Generic;
		using System.Linq;
		using Microsoft.Dynamics.Commerce.Runtime;
		using Microsoft.Dynamics.Commerce.Runtime.DataModel;
		using Microsoft.Dynamics.Commerce.Runtime.Messages;
		using Microsoft.Dynamics.Commerce.Runtime.Data;
		using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
		using Newtonsoft.Json;
		using System.Transactions;
		using System.Threading.Tasks;

		public class TransactionTypeCount
        {
            public int Sales { get; set; }
            public int Purchase { get; set; }
            public int PurchaseReturn { get; set; }
            public int Exchange { get; set; }
            public int ExchangeReturn { get; set; }
            public int SalesReturn { get; set; }
        }

		public class NIMCustomReceiptInfo
        {
            public NIMCustomReceiptInfo()
            {
                this.LastSequence = 0;
                this.Mask = "";
                this.ReceiptId = "";
                this.ReceiptTransactionType = 0;
                this.SeedValue = 0;
            }
            public long LastSequence { get; set; }
            public long SeedValue { get; set; }
            public string ReceiptId { get; set; }
            public int ReceiptTransactionType { get; set; }
            public string Mask { get; set; }
        }

        public class Receipt_Data
        {
            public long LASTSEQUENCE { get; set; }
            public int RECEIPTTRANSACTIONTYPE { get; set; }
        }

        public class ValidateNumSequenceResponse
        {
            public ValidateNumSequenceResponse()
            {
                Flag = false;
                LstData = new List<int>();
                list = new List<Receipt_Data>();
            }
            public bool Flag { get; set; }
            public List<int> LstData { get; set; }
            public List<Receipt_Data> list { get; set; }
        }
        public class ReceiptNoGeneration
        {
			#region Old Recipt Number Generation

			public async Task<string> GetNextReceiptID(Request request, int transType, string funcProfile
			   , string storeId, string terminalId, string staffId)
			{
				string sReceiptNo = string.Empty;
				try
				{
					string funcProfileId = request.RequestContext.GetDeviceConfiguration().ProfileId;
                    string mask = await orderNumberAsync(request, transType, funcProfileId).ConfigureAwait(false);
					if (string.IsNullOrEmpty(mask))
						sReceiptNo = string.Empty;
					else
					{
						string seedValue = await GetSeedValAsync(request, transType, funcProfileId, storeId).ConfigureAwait(false);
						sReceiptNo = ReceiptMaskFillerCustom.FillMask(mask, seedValue, storeId, terminalId, staffId);
					}


					return sReceiptNo;

				}
				catch (Exception ex)
				{
					await CommonHelper.GenerateErrorLogAsync(request, "RECEIPT MASK 3", ex.StackTrace + "::" + ex.Message, ex.InnerException).ConfigureAwait(false);
					return sReceiptNo;
				}
			}
			 
			private async Task<string> GetSeedValAsync(Request request, int transType, string funcProfile, string Store)
			{

				string sVal = string.Empty;
				StringBuilder commandText = new StringBuilder();
				commandText.Append(" DECLARE @VAL AS INT  SELECT @VAL = CHARINDEX('#',mask) FROM ext.RETAILRECEIPTMASKSCUSTOM WHERE FUNCPROFILEID ='" + funcProfile + "'  AND RECEIPTTRANSTYPE = " + transType + "");

				if (transType == (int)ReceiptTransactionType.Estimation)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(ESTIMATENO,@VAL,LEN(ESTIMATENO)),0) AS INTEGER)) + 1 from ext.RETAILCUSTOMERESTIMATETABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "' ");
				}

				else if (transType == (int)ReceiptTransactionType.Order)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(ORDERNO,@VAL,LEN(ORDERNO)),0) AS INTEGER)) + 1 from ext.RETAILCUSTOMERORDERTABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}

				else if (transType == (int)ReceiptTransactionType.CounterTransfer)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(STOCKTRANSFERID,@VAL,LEN(STOCKTRANSFERID)),0) AS INTEGER)) + 1 from ext.SKUTRANSFER_HEADER WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}

				else if (transType == (int)ReceiptTransactionType.BulkItemStockIn)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(BULKITEMTRANSORDRNO,@VAL,LEN(BULKITEMTRANSORDRNO)),0) AS INTEGER)) + 1 from ext.BULKITEMTRANSHEADER WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}

				else if (transType == (int)ReceiptTransactionType.BulkItemStockOut)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(BULKITEMTRANSORDRNO,@VAL,LEN(BULKITEMTRANSORDRNO)),0) AS INTEGER)) + 1 from ext.BULKITEMTRANSISSUEHEADER WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}

				else if (transType == (int)ReceiptTransactionType.PDCEntry)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(PDCENTRYCODE,@VAL,LEN(PDCENTRYCODE)),0) AS INTEGER)) + 1 from ext.PDCENTRYTABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}
				else if (transType == (int)ReceiptTransactionType.RepairOrder)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(REPAIRID,@VAL,LEN(REPAIRID)),0) AS INTEGER)) + 1 from [ext].[RETAILREPAIRHDR] WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}
				else if (transType == (int)ReceiptTransactionType.RepairReturn)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(REPAIRRETURNID,@VAL,LEN(REPAIRRETURNID)),0) AS INTEGER)) + 1 from [ext].[RETAILREPAIRRETURNTRANS] WHERE RETAILSTOREID = '" + Store + "' AND RETAILTERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}
				else if (transType == (int)ReceiptTransactionType.StockCount)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(VOUCHERNUM,@VAL,LEN(VOUCHERNUM)),0) AS INTEGER)) + 1 from ext.RETAILSTOCKCOUNTHEADER WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}
				else if (transType == (int)ReceiptTransactionType.ProductWiseStockVoucher)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(VOUCHERNUM,@VAL,LEN(VOUCHERNUM)),0) AS INTEGER)) + 1 from ext.NIMPRODUCTWISESTOCKTAKINGTABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}
				else if (transType == (int)ReceiptTransactionType.Insurance)
				{
					commandText.Append(" SELECT  MAX(CAST(ISNULL(SUBSTRING(INSURANCENO,@VAL,LEN(INSURANCENO)),0) AS INTEGER)) + 1 from ext.INSURANCETRANSACTIONDETAIL WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "'");
				}
				else if (transType == (int)ReceiptTransactionType.Purchase)
				{
					commandText.Append(" SELECT  ISNULL(MAX(CAST(ISNULL(SUBSTRING(CUSTOMRECEIPTID,@VAL,LEN(CUSTOMRECEIPTID)),0) AS INTEGER)), 0) + 1  ");
					commandText.Append(" FROM ext.RETAILCUSTOMCALCULATIONSTABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "' AND TRANSACTIONTYPE IN (1, 3) ");
				}
				else if (transType == (int)ReceiptTransactionType.PurchaseReturn)
				{
					commandText.Append(" SELECT  ISNULL(MAX(CAST(ISNULL(SUBSTRING(CUSTOMRECEIPTID,@VAL,LEN(CUSTOMRECEIPTID)),0) AS INTEGER)), 0) + 1 ");
					commandText.Append(" FROM ext.RETAILCUSTOMCALCULATIONSTABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "' AND TRANSACTIONTYPE IN (2, 4) ");
				}
				else if (transType == (int)ReceiptTransactionType.Sales)
				{
					commandText.Append(" SELECT  ISNULL(MAX(CAST(ISNULL(SUBSTRING(CUSTOMRECEIPTID,@VAL,LEN(CUSTOMRECEIPTID)),0) AS INTEGER)), 0) + 1 ");
					commandText.Append(" FROM ext.RETAILCUSTOMCALCULATIONSTABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "' AND TRANSACTIONTYPE = 0 AND LineAmount < 0 ");
				}
				else if (transType == (int)ReceiptTransactionType.SalesReturn)
				{
					commandText.Append(" SELECT  ISNULL(MAX(CAST(ISNULL(SUBSTRING(CUSTOMRECEIPTID,@VAL,LEN(CUSTOMRECEIPTID)),0) AS INTEGER)), 0) + 1 ");
					commandText.Append(" FROM ext.RETAILCUSTOMCALCULATIONSTABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "' AND TRANSACTIONTYPE = 0 AND LineAmount > 0 ");
				}
				else if (transType == (int)ReceiptTransactionType.AdvanceRefund)
				{
					commandText.Append(" SELECT  ISNULL(MAX(CAST(ISNULL(SUBSTRING(CUSTOMRECEIPTID,@VAL,LEN(CUSTOMRECEIPTID)),0) AS INTEGER)), 0) + 1 ");
					commandText.Append(" FROM ext.RETAILADJUSTMETCALCTABLE WHERE STORE = '" + Store + "' AND TERMINALID = '" + request.RequestContext.GetTerminalId() + "' AND ISADVANCEREFUND = 1 ");
				}

				using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
				{
					var query = new SqlQuery(commandText.ToString());
					try
					{
						sVal = Convert.ToString(await databaseContext.ExecuteScalarAsync<Int32>(query).ConfigureAwait(false));
					}
					catch (Exception ex)
					{
						await CommonHelper.GenerateErrorLogAsync(request, "RECEIPT MASK 2", ex.StackTrace + "::" + ex.Message, ex.InnerException).ConfigureAwait(false);
					}
				}

				if (string.IsNullOrEmpty(sVal))
				{
					sVal = "1";
				}
				return sVal;
			}

			private async Task<string> orderNumberAsync(Request request, int transType, string funcProfile)
			{
				string sVal = "";
				StringBuilder commandText = new StringBuilder();
				commandText.Append(" SELECT MASK FROM ext.RETAILRECEIPTMASKSCUSTOM WHERE FUNCPROFILEID='" + funcProfile.Trim() + "'");
				commandText.Append("AND RECEIPTTRANSTYPE = " + transType + " ");

				using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
				{
					var query = new SqlQuery(commandText.ToString());

					try
					{
						sVal = await databaseContext.ExecuteScalarAsync<string>(query).ConfigureAwait(false);
					}
					catch (Exception ex)
					{
						await CommonHelper.GenerateErrorLogAsync(request, "RECEIPT MASK", ex.StackTrace + "::" + ex.Message, ex.InnerException).ConfigureAwait(false);
					}

				}

				return sVal;
			}

			#endregion

			#region New Receipt Number Generation

			public async Task<NIMCustomReceiptInfo> GetNextReceiptID_V2Async(Request request, StoreConfiguration config, NIMCustomReceiptInfo customReceiptInfo)
			{
				string funcProfileId = request.RequestContext.GetDeviceConfiguration().ProfileId;
				using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
				{
					ParameterSet pSet = new ParameterSet();
					string SqlQuery = @"  SELECT TOP 1 A.LASTSEQUENCE, B.MASK FROM [ext].[NIMPOSSEEDVALUE] AS A
                                      INNER JOIN EXT.RETAILRECEIPTMASKSCUSTOM AS B ON A.RECEIPTTRANSACTIONTYPE = B.RECEIPTTRANSTYPE
                                      WHERE B.FUNCPROFILEID = @FUNCPROFILEID AND A.RECEIPTTRANSACTIONTYPE = @RECEIPTTRANSACTIONTYPE
                                      AND A.STORE = @STORE AND A.TERMINAL = @TERMINAL ";
					pSet.Add("@FUNCPROFILEID", funcProfileId);
					pSet.Add("@RECEIPTTRANSACTIONTYPE", customReceiptInfo.ReceiptTransactionType);
					pSet.Add("@STORE", config.Store);
					pSet.Add("@TERMINAL", config.TerminalId);
					DataSet ds = await databaseContext.ExecuteQueryDataSetAsync(SqlQuery, pSet).ConfigureAwait(false);
					if (ds != null && ds.Tables.Count > 0)
					{
						if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
						{
							customReceiptInfo.Mask = Convert.ToString(ds.Tables[0].Rows[0]["MASK"]);
							customReceiptInfo.LastSequence = Convert.ToInt64(ds.Tables[0].Rows[0]["LASTSEQUENCE"]);
							customReceiptInfo.SeedValue = customReceiptInfo.LastSequence + 1;
							customReceiptInfo.ReceiptId = ReceiptMaskFillerCustom.FillMask(customReceiptInfo.Mask, customReceiptInfo.SeedValue.ToString(), config.Store, config.TerminalId, config.StaffId);
						}
					}
				}
				return customReceiptInfo;
			}

			public async Task UpdateOtherReceiptLastSeedValueAsync(Request request, StoreConfiguration config, int ReceiptTransactionType, string ReceiptId)
			{
				using (DatabaseContext db = new DatabaseContext(request.RequestContext))
				using (TransactionScope transaction = CommonHelper.CreateReadCommittedTransactionScope())
				{
					await db.ExecuteNonQueryAsync(new SqlQuery(UpdateOtherReceiptLastSeedValue(config, ReceiptTransactionType, ReceiptId).ToString())).ConfigureAwait(false);
					transaction.Complete();
				}
			}

			public string UpdateOtherReceiptLastSeedValue(StoreConfiguration config, int ReceiptTransactionType, string ReceiptId)
			{
				String NewLine = Environment.NewLine;
				StringBuilder commandText = new StringBuilder();
				commandText.Append(NewLine);
				commandText.Append(" DECLARE @STORE_ID NVARCHAR(10) = '" + config.Store + "' ");
				commandText.Append(" DECLARE @TERMINAL_ID NVARCHAR(10) = '" + config.TerminalId + "' ");
				commandText.Append(" DECLARE @CUSTOMRECEIPT_ID NVARCHAR(44) = '" + ReceiptId + "' ");
				commandText.Append(" DECLARE @RECEIPTTRANSACTIONTYPE INT = " + ReceiptTransactionType);
				commandText.Append(" DECLARE @FUNCPROFILEID NVARCHAR(10) = '" + config.FuncProfileId + "' ");

				commandText.Append(@"  DECLARE @VAL AS INT  SELECT @VAL = CHARINDEX('#',mask) FROM ext.RETAILRECEIPTMASKSCUSTOM WHERE FUNCPROFILEID = @FUNCPROFILEID AND RECEIPTTRANSTYPE = @RECEIPTTRANSACTIONTYPE
                                       DECLARE @LASTSEEDVALUE BIGINT = MAX(CAST(ISNULL(SUBSTRING(@CUSTOMRECEIPT_ID,@VAL,LEN(@CUSTOMRECEIPT_ID)),0) AS INTEGER))
                                       IF EXISTS(SELECT TOP 1 A.RECEIPTTRANSACTIONTYPE FROM [ext].[NIMPOSSEEDVALUE] AS A 
		                                           WHERE  A.RECEIPTTRANSACTIONTYPE = @RECEIPTTRANSACTIONTYPE
		                                           AND A.STORE = @STORE_ID AND A.TERMINAL = @TERMINAL_ID)
                                       BEGIN
	                                       UPDATE [ext].[NIMPOSSEEDVALUE] SET [LASTSEQUENCE] = @LASTSEEDVALUE
	                                       WHERE  RECEIPTTRANSACTIONTYPE = @RECEIPTTRANSACTIONTYPE
	                                       AND STORE = @STORE_ID AND TERMINAL = @TERMINAL_ID
                                       END
                                       ELSE
                                       BEGIN 
	                                       INSERT INTO [ext].[NIMPOSSEEDVALUE]([STORE],[TERMINAL],[RECEIPTTRANSACTIONTYPE],[LASTSEQUENCE])
                                           VALUES(@STORE_ID,@TERMINAL_ID,@RECEIPTTRANSACTIONTYPE, @LASTSEEDVALUE)
                                       END ");
				commandText.Append(NewLine);
				return commandText.ToString();
			}

			#endregion

			private async Task<ValidateNumSequenceResponse> _ValidateNumberSequencesAsync(Request request, StoreConfiguration config)
			{
				ValidateNumSequenceResponse obj = new ValidateNumSequenceResponse();
				obj.LstData = Enum.GetValues(typeof(ReceiptTransactionType)).Cast<int>().ToList();
				string funcProfileId = request.RequestContext.GetDeviceConfiguration().ProfileId;
				using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
				{
					ParameterSet pSet = new ParameterSet();
					string SqlQuery = @" SELECT A.LASTSEQUENCE, A.RECEIPTTRANSACTIONTYPE FROM ext.NIMPOSSEEDVALUE AS A
                                         INNER JOIN EXT.RETAILRECEIPTMASKSCUSTOM AS B ON A.RECEIPTTRANSACTIONTYPE = B.RECEIPTTRANSTYPE AND B.FUNCPROFILEID =  @FUNCPROFILEID
                                         WHERE A.STORE = @STORE AND A.TERMINAL = @TERMINAL ";

					pSet.Add("@FUNCPROFILEID", funcProfileId);
					pSet.Add("@STORE", config.Store);
					pSet.Add("@TERMINAL", config.TerminalId);
					DataSet ds = await databaseContext.ExecuteQueryDataSetAsync(SqlQuery, pSet).ConfigureAwait(false);
					obj.list = DataHelpers.ConvertDataTable<Receipt_Data>(ds.Tables[0]);
					if (obj.list.Count == obj.LstData.Count)
						obj.Flag = true;
				}
				return obj;
			}

			public async Task<BasicResponse> ValidateNumberSequencesAsync(Request request, BasicResponse resp, StoreConfiguration config)
			{
				resp.Status = 200;
				//List<int> LstData = new List<int>();
				//List<Receipt_Data> list = new List<Receipt_Data>();
				ValidateNumSequenceResponse obj = await _ValidateNumberSequencesAsync(request, config).ConfigureAwait(false);
				if (obj.Flag)
				{
					resp.Payload = true;
					resp.Message = "Number sequence of all receipt type already available.";
				}
				else
				{
					resp.Payload = false;
					resp.Message = "Receipt number sequence for";
					StringBuilder sb = new StringBuilder("");
					int _index = 0;
					foreach (int ReceiptType in obj.LstData)
					{
						Receipt_Data data = obj.list.FirstOrDefault(x => x.RECEIPTTRANSACTIONTYPE == ReceiptType);
						if (data == null)
						{
							int SeedValue = (ReceiptType == (int)ReceiptTransactionType.Estimation) ? 0 : 0;
							string stringValue = Enum.GetName(typeof(ReceiptTransactionType), ReceiptType);
							resp.Message = resp.Message + ((_index == 0) ? (" '" + stringValue + "'") : (", '" + stringValue + "'"));
							sb.Append(" INSERT INTO [ext].[NIMPOSSEEDVALUE] ([STORE],[TERMINAL],[RECEIPTTRANSACTIONTYPE],[LASTSEQUENCE]) VALUES ('" + config.Store + "','" + config.TerminalId + "'," + ReceiptType + "," + SeedValue.ToString() + ") ");
							sb.Append(Environment.NewLine);
						}
						_index = _index + 1;
					}

					resp.Message = resp.Message + " generated successfully !";
					if (sb.ToString().Length > 0)
					{
						using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
						{
							var query = new SqlQuery(sb.ToString());
							await databaseContext.ExecuteNonQueryAsync(query).ConfigureAwait(false);
						}
					}
				}

				await ManageEstimationDailyWiseAsync(request, config).ConfigureAwait(false);

				return resp;
			}

			private async Task ManageEstimationDailyWiseAsync(Request request, StoreConfiguration config)
			{
				using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
				{
					ParameterSet pSet = new ParameterSet();
					string SqlQueryString = @" IF NOT EXISTS(SELECT TOP 1 ESTIMATENO FROM EXT.RETAILCUSTOMERESTIMATETABLE 
										 	   WHERE ESTIMATEDATE = @CURRENTDATE AND DATAAREAID = @DATAAREAID AND STORE = @STORE AND TERMINALID = @TERMINAL)
											   BEGIN
										 	   	   UPDATE EXT.NIMPOSSEEDVALUE SET LASTSEQUENCE = 0 WHERE STORE = @STORE AND TERMINAL = @TERMINAL AND RECEIPTTRANSACTIONTYPE = @RECEIPTTRANSTYPE
											   END ";

					var headerQuery = new SqlQuery(SqlQueryString.ToString());

					headerQuery.Parameters["@CURRENTDATE"] = config.CurrentDate.ToString("yyyy-MM-dd");
					headerQuery.Parameters["@DATAAREAID"] = config.DataAreaId;
					headerQuery.Parameters["@STORE"] = config.Store;
					headerQuery.Parameters["@TERMINAL"] = config.TerminalId;
					headerQuery.Parameters["@RECEIPTTRANSTYPE"] = (int)ReceiptTransactionType.Estimation;
					await databaseContext.ExecuteNonQueryAsync(headerQuery).ConfigureAwait(false);
				}
			}
		}
	}
}

