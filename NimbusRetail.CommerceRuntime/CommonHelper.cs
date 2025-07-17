namespace NimbusRetail
{
    namespace CommerceRuntime
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using System.Transactions;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime.DataAccess.SqlServer;

        public class CommonHelper
        {
			public string Test = "";
            public const string DefaultVal = "--SELECT--";
            public const string DefaultBlank = "";

			public static TransactionScope CreateReadCommittedTransactionScope()
			{
				var options = new TransactionOptions()
				{
					IsolationLevel = IsolationLevel.ReadCommitted
				};

				return new TransactionScope(TransactionScopeOption.Required, options, TransactionScopeAsyncFlowOption.Enabled);
			}

            public static TransactionScope CreateReadCommittedTransactionScope(int Minutes)
            {
                var options = new TransactionOptions()
                {
                    IsolationLevel = IsolationLevel.ReadCommitted,
                    Timeout = TimeSpan.FromMinutes(Minutes)
                };

                return new TransactionScope(TransactionScopeOption.Required, options, TransactionScopeAsyncFlowOption.Enabled);
            }

			public static async Task GenerateApiLogAsync(Request request, string _URL, string _Request, string _Response, string LogType, string SubLogType, string RefNumber, string LOGREFNUMBER2 = "")
			{
				#region Log
				try
				{
					StoreConfiguration config = await StoreConfiguration.GetConfigurationAsync(request).ConfigureAwait(false);
					using (var databaseContext = new SqlServerDatabaseContext(request.RequestContext))
					{
						ParameterSet parameters = new ParameterSet();

						parameters["@TERMINAL"] = config.TerminalId;
						parameters["@STORE"] = config.Store;
						parameters["@DATAAREAID"] = config.DataAreaId;
						parameters["@REQUESTURL"] = _URL;
						parameters["@REQUESTDATA"] = _Request;
						parameters["@RESPONSEDATA"] = _Response;
						parameters["@LOGTYPE"] = LogType;
						parameters["@LOGSUBTYPE"] = SubLogType;
						parameters["@LOGREFNUMBER"] = RefNumber;
						parameters["@LOGDATE"] = config.CurrentDate.ToString("yyyy-MM-dd");
						parameters["@LOGTIME"] = config.CurrentDate.ToString("hh:mm:ss");
                        parameters["@LOGREFNUMBER2"] = LOGREFNUMBER2;

						await databaseContext.ExecuteStoredProcedureNonQueryAsync("[ext].[GENERATEAPILOG]", parameters, null).ConfigureAwait(false);
					}
				}
				catch { }
				#endregion
			}

			public static async Task GenerateErrorLogAsync(Request request, string Code, string Details, Exception innerException)
			{
				try
				{
					StoreConfiguration config = await StoreConfiguration.GetConfigurationAsync(request).ConfigureAwait(false);
					using (var databaseContext = new SqlServerDatabaseContext(request.RequestContext))
					{
						ParameterSet parameters = new ParameterSet();
						parameters["@DATAAREAID"] = config.DataAreaId;
						parameters["@STORE"] = config.Store;
						parameters["@TERMINAL"] = config.TerminalId;
						parameters["@CHANNEL"] = config.Channel;
						parameters["@LOGCODE"] = Code;
						parameters["@STACKTRACE"] = Details;
						parameters["@INNERMESSAGE"] = (innerException != null) ? ((innerException.Message != null) ? innerException.Message : "") : "";
						await databaseContext.ExecuteStoredProcedureNonQueryAsync("[EXT].[INSERTTXNERRORLOG]", parameters, null).ConfigureAwait(false);
					}
				}
				catch { }
			}

			public static async Task GenerateErrorLogAsync(RequestContext context, string Code, string Details, Exception innerException)
			{
				try
				{
					StoreConfiguration config = await StoreConfiguration.GetConfigurationAsync(context).ConfigureAwait(false);
					using (var databaseContext = new SqlServerDatabaseContext(context))
					{
						ParameterSet parameters = new ParameterSet();
						parameters["@DATAAREAID"] = config.DataAreaId;
						parameters["@STORE"] = config.Store;
						parameters["@TERMINAL"] = config.TerminalId;
						parameters["@CHANNEL"] = config.Channel;
						parameters["@LOGCODE"] = Code;
						parameters["@STACKTRACE"] = Details;
						parameters["@INNERMESSAGE"] = (innerException != null) ? ((innerException.Message != null) ? innerException.Message : "") : "";
						await databaseContext.ExecuteStoredProcedureNonQueryAsync("[EXT].[INSERTTXNERRORLOG]", parameters, null).ConfigureAwait(false);
					}
				}
				catch { }
			}
			
			public static async Task<IList<DataTable>> DataTableFromQueryAsync(Request request, string query, List<NimKeyValue> param)
			{
				IList<DataTable> dataTables = new List<DataTable>();
				ParameterSet pSet = new ParameterSet();
				if (param != new List<NimKeyValue>() && param.Where(f => f.Key.GetType() == typeof(string)).ToList().Count == param.Count)
				{
					foreach (NimKeyValue item in param)
					{
						pSet.Add((string)item.Key, item.Value);
					}
				}
				using (DatabaseContext database = new DatabaseContext(request.RequestContext))
				{
					dataTables = (await database.ExecuteQueryDataSetAsync(query, pSet).ConfigureAwait(false)).Tables;
				}
				return dataTables;
			}

            internal static void GenerateErrorLog(Request request, string v, string stackTrace, Exception innerException)
            {
                throw new NotImplementedException();
            }
        }
	}
}
