namespace NimbusRetail
{
    namespace CommerceRuntime
    {
		using System;
		using System.Threading.Tasks;
		using Microsoft.Dynamics.Commerce.Runtime;
		using Microsoft.Dynamics.Commerce.Runtime.DataModel;
		using Microsoft.Dynamics.Commerce.Runtime.Messages;
		using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

		public class StoreConfiguration
        {
            public StoreConfiguration()
            {
                this.Channel = 0;
                this.DataAreaId = "";
                this.LanguageID = "";
                this.StaffId = "";
                this.Store = "";
                this.TerminalId = "";
                this.Currency = "";
                this.StoreName = "";
                this.FuncProfileId = "";
                this.StaffName = "";
                //this.CurrentStore = null;
            }
            public string TerminalId { get; set; }
            public long Channel { get; set; }
            public string Store { get; set; }
            public string StoreName { get; set; }
            public string DataAreaId { get; set; }
            public string StaffId { get; set; }
            public string StaffName { get; set; }
            public string LanguageID { get; set; }
            public string Currency { get; set; }
            public DateTime CurrentDate { get; set; }
            public string FuncProfileId { get; set; }

			public static async Task<StoreConfiguration> GetConfigurationAsync(Request request)
			{
				GetEmployeesServiceRequest extensionRequest = new GetEmployeesServiceRequest(request.RequestContext.GetPrincipal().UserId, QueryResultSettings.FirstRecord);
				Employee loggedInEmp = (await request.RequestContext.ExecuteAsync<GetEmployeesServiceResponse>(extensionRequest).ConfigureAwait(false)).Employees.Results[0];

				TimeZoneInfo tst = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
				StoreConfiguration config = new StoreConfiguration();

				config.Store = request.RequestContext.GetOrgUnit().OrgUnitNumber;
				config.DataAreaId = request.RequestContext.GetChannelConfiguration().InventLocationDataAreaId;
				config.Channel = request.RequestContext.GetPrincipal().ChannelId;
				config.TerminalId = request.RequestContext.GetTerminalId();
				config.StaffId = request.RequestContext.GetPrincipal().UserId;
				config.StaffName = loggedInEmp.Name;
				config.LanguageID = request.RequestContext.GetDeviceConfiguration().CultureName;
				config.Currency = request.RequestContext.GetDeviceConfiguration().Currency;
				config.CurrentDate = TimeZoneInfo.ConvertTime(request.RequestContext.GetNowInUtc().DateTime, TimeZoneInfo.Local, tst);
				config.StoreName = request.RequestContext.GetOrgUnit().OrgUnitName;
				config.FuncProfileId = request.RequestContext.GetDeviceConfiguration().ProfileId;
				return config;
			}

			public static async Task<StoreConfiguration> GetConfigurationAsync(RequestContext context)
			{
				GetEmployeesServiceRequest extensionRequest = new GetEmployeesServiceRequest(context.GetPrincipal().UserId, QueryResultSettings.FirstRecord);
				Employee loggedInEmp = (await context.ExecuteAsync<GetEmployeesServiceResponse>(extensionRequest).ConfigureAwait(false)).Employees.Results[0];

				TimeZoneInfo tst = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
				StoreConfiguration config = new StoreConfiguration();

				config.Store = context.GetOrgUnit().OrgUnitNumber;
				config.DataAreaId = context.GetChannelConfiguration().InventLocationDataAreaId;
				config.Channel = context.GetPrincipal().ChannelId;
				config.TerminalId = context.GetTerminalId();
				config.StaffId = context.GetPrincipal().UserId;
				config.LanguageID = context.GetDeviceConfiguration().CultureName;
				config.Currency = context.GetDeviceConfiguration().Currency;
				config.CurrentDate = TimeZoneInfo.ConvertTime(context.GetNowInUtc().DateTime, TimeZoneInfo.Local, tst);
				config.StoreName = context.GetOrgUnit().OrgUnitName;
				config.FuncProfileId = context.GetDeviceConfiguration().ProfileId;
				return config;
			}
		}
    }
}
