namespace NimbusRetail
{
	namespace CommerceRuntime
	{
		using System;
		using System.Collections.Generic;
        
		public class EnumDropdown
		{
			public object value { get; set; }
			public string name { get; set; }
		}

		public class IDropdown
		{
			public string value { get; set; }
		}

		public class IDropdownV2 : IDropdown
		{
			public string text { get; set; }
		}

		public class IDropdownAdvance : IDropdownV2
		{
			public string src { get; set; }
		}

        public class NimKeyValue
        {
            public object Key { get; set; }
            public object Value { get; set; }
        }

        public class NimKeyValueV2
        {
            public string Key { get; set; }
            public decimal Value { get; set; }
        }

        public class NimKeyValueV3
        {
            public string Key { get; set; }
            public decimal Value { get; set; }
            public string Text { get; set; }
        }

        public class NimKeyValueText
        {
            public string Key { get; set; }
            public string Value { get; set; }
            public string Text { get; set; }
        }

        public class NimKeyValueTextV2
        {
            public string Key { get; set; }
            public decimal Value { get; set; }
            public string Text { get; set; }
            public int Flag { get; set; }
        }
        public class RetailParameterResp
		{
			public RetailParameterResp()
			{
				
            }
			
        }

		public class ChannelExt
		{
			public ChannelExt()
			{
				this.NIMCLUSTERCODE = string.Empty;
				this.NIMCUSTGROUP = string.Empty;
				this.NIMREGIONCODE = string.Empty;
				this.NIMZONECODE = string.Empty;
				this.STORENUMBER = string.Empty;
				this.LANGUAGE = string.Empty;
				this.CURRENCY = string.Empty;
				this.NIMBANKACCOUNTID = string.Empty;
				this.NIMOTPREQUIRE = 0;
				this.NIMWHATSAPPREQUIRE = 0;
				this.NIMEMAILREQUIRE = 0;
				this.GIFTCARDTENDERTYPEID = "";
				this.NIMDEFAULTTENDERTYPEID = "";
				this.NIMDISABLECOSTPRICEVALIDATION = 0;
			}
			public string STORENUMBER { get; set; }
			public string NIMREGIONCODE { get; set; }
			public string NIMZONECODE { get; set; }
			public string NIMCLUSTERCODE { get; set; }
			public string NIMCUSTGROUP { get; set; }
			public string LANGUAGE { get; set; }
			public string CURRENCY { get; set; }
			public string NIMBANKACCOUNTID { get; set; }
			public int NIMOTPREQUIRE { get; set; }
			public int NIMWHATSAPPREQUIRE { get; set; }
			public int NIMEMAILREQUIRE { get; set; }
			public string GIFTCARDTENDERTYPEID { get; set; }
			public string NIMDEFAULTTENDERTYPEID { get; set; }
			public int NIMDISABLECOSTPRICEVALIDATION { get; set; }
		}

		public class TerminalExt
		{
			public TerminalExt()
			{
				this.NIMHARDWAREID = string.Empty;
				this.NIMIMEI = string.Empty;
				this.NIMMERCHANTID = 0;
				this.NIMMERCHANTSTOREPOSCODE = string.Empty;
				this.NIMSECURITYTOKEN = string.Empty;
				this.NIM40COLUMNESTIMATEFORMAT = 0;
			}

			public string NIMHARDWAREID { get; set; }
			public string NIMIMEI { get; set; }
			public string NIMSECURITYTOKEN { get; set; }
			public int NIMMERCHANTID { get; set; }
			public string NIMMERCHANTSTOREPOSCODE { get; set; }
			public int NIM40COLUMNESTIMATEFORMAT { get; set; }
		}

		public class NimItemDetail
		{
			
		}

		public class CustomerInfo
		{
			public string ACCOUNTNUMBER { get; set; }
			public string NAME { get; set; }
			public string FIRSTNAME { get; set; }
			public string MIDDLENAME { get; set; }
			public string LASTNAME { get; set; }
			public string PHONE { get; set; }
			public string EMAIL { get; set; }
			public string CELLPHONE { get; set; }
			public string RECEIPTEMAIL { get; set; }
			public string ADDRESS { get; set; }
			public string ZIPCODE { get; set; }
			public string STATE { get; set; }
			public string STATENAME { get; set; }
			public string COUNTY { get; set; }
			public string COUNTYNAME { get; set; }
			public string CITY { get; set; }
			public string STREET { get; set; }
			public string STREETNUMBER { get; set; }
			public string BUILDINGCOMPLIMENT { get; set; }
			public string POSTBOX { get; set; }
			public string DISTRICTNAME { get; set; }
			public string COUNTRYREGIONID { get; set; }
			public int CUSTOMERTYPE { get; set; }
			public string LANGUAGE { get; set; }
			public string CURRENCY { get; set; }
			public string GSTIN { get; set; }
			public string PANNUMBER { get; set; }
			public string SALESGROUP { get; set; }
			public int ISB2B { get; set; }
			public int ISB2BADMIN { get; set; }
			public int RECEIPTSETTINGS { get; set; }
			public string CUSTGROUP { get; set; }
			public int BLOCKED { get; set; }
			public string TAXGROUP { get; set; }
			public long RECID { get; set; }
			public long PARTY { get; set; }
			public string PARTYNUMBER { get; set; }
			public int ISACTIVEEINVOICE { get; set; }
		}

		public class Store_info
		{
			public Store_info()
			{
				this.STORENAME = string.Empty;
				this.STOREADDRESS = string.Empty;
				this.STORECITY = string.Empty;
				this.STOREREGIONID = string.Empty;
				this.STOREDISTRICT = string.Empty;
				this.STORESTATE = string.Empty;
				this.STORESTATENAME = string.Empty;
				this.STORESTREET = string.Empty;
				this.STOREZIPCODE = string.Empty;
				this.STOREPHONE = string.Empty;
				this.STOREPHONEEXT = string.Empty;
				this.STOREEMAIL = string.Empty;
				this.STOREWEBSITE = string.Empty;
				this.STORECELLPHONE = string.Empty;
				this.STORECIN = string.Empty;
				this.STOREGSTIN = string.Empty;
				this.CURRENCY = string.Empty;
				this.INVENTLOCATION = string.Empty;
				this.COMPANYPAN = string.Empty;
			}
			public string STORENAME { get; set; }
			public string STOREADDRESS { get; set; }
			public string STORECITY { get; set; }
			public string STOREREGIONID { get; set; }
			public string STOREDISTRICT { get; set; }
			public string STORESTATE { get; set; }
			public string STORESTATENAME { get; set; }
			public string STORESTREET { get; set; }
			public string STOREZIPCODE { get; set; }
			public string STOREPHONE { get; set; }
			public string STOREPHONEEXT { get; set; }
			public string STOREEMAIL { get; set; }
			public string STOREWEBSITE { get; set; }
			public string STORECELLPHONE { get; set; }
			public string STORECIN { get; set; }
			public string STOREGSTIN { get; set; }
			public string CURRENCY { get; set; }
			public string INVENTLOCATION { get; set; }
			public string COMPANYPAN { get; set; }
		}

		public class Company_info
		{
			public Company_info()
			{
				this.COMPANYNAME = string.Empty;
				this.COMPANYADDRESS = string.Empty;
				this.COMPANYCITY = string.Empty;
				this.COMPANYREGIONID = string.Empty;
				this.COMPANYDISTRICT = string.Empty;
				this.COMPANYSTATE = string.Empty;
				this.COMPANYSTREET = string.Empty;
				this.COMPANYZIPCODE = string.Empty;
				this.COMPANYPHONE = string.Empty;
				this.COMPANYPHONEEXT = string.Empty;
				this.COMPANYEMAIL = string.Empty;
				this.COMPANYWEBSITE = string.Empty;
				this.COMPANYCELLPHONE = string.Empty;
				this.COMPANYCIN = string.Empty;
				this.COMPANYGSTIN = string.Empty;
				this.COMPANYPAN = string.Empty;
			}
			public string COMPANYNAME { get; set; }
			public string COMPANYADDRESS { get; set; }
			public string COMPANYCITY { get; set; }
			public string COMPANYREGIONID { get; set; }
			public string COMPANYDISTRICT { get; set; }
			public string COMPANYSTATE { get; set; }
			public string COMPANYSTREET { get; set; }
			public string COMPANYZIPCODE { get; set; }
			public string COMPANYPHONE { get; set; }
			public string COMPANYPHONEEXT { get; set; }
			public string COMPANYEMAIL { get; set; }
			public string COMPANYWEBSITE { get; set; }
			public string COMPANYCELLPHONE { get; set; }
			public string COMPANYCIN { get; set; }
			public string COMPANYGSTIN { get; set; }
			public string COMPANYPAN { get; set; }
		}

		public class StoreCompanyInfo
		{
			public StoreCompanyInfo()
			{
				Store = new Store_info();
				Company = new Company_info();
			}
			public Store_info Store { get; set; }
			public Company_info Company { get; set; }
		}

		public class EmailSettings
		{
			public string SMTPUserName { get; set; }
			public string SMTPPortNumber { get; set; }
			public string SMTPRelayServerName { get; set; }
			public string SMTPPassword { get; set; }
		}

		public class OGIngredientItem
		{
			public string ITEMID { get; set; }
			public int METALTYPE { get; set; }
			public string CONFIGID { get; set; }
			public string INVENTSIZEID { get; set; }
			public string INVENTCOLORID { get; set; }
			public string INVENTSTYLEID { get; set; }
			public int ISPRECIOUSSTONE { get; set; }
			public string UNITID { get; set; }
			public int ISCATCHWEIGHITEM { get; set; }
		}
	}
}
