namespace NimbusRetail
{
	namespace CommerceRuntime
	{
		public enum NoYes
		{
			No = 0,
			Yes = 1
		}
		
        public enum ReceiptTransactionType
        {
            Estimation = 11,
            Order = 12,
            CounterTransfer = 13,
            BulkItemStockIn = 14,
            BulkItemStockOut = 15,
            PDCEntry = 16,
            RepairOrder = 17,
            RepairReturn = 18,
            StockCount = 19,
            ProductWiseStockVoucher = 20,
            Purchase = 21,
            Insurance = 22,
            Sales = 23,
            SalesReturn = 24,
            PurchaseReturn = 25,
            AdvanceRefund = 26,
            ComplementaryGift = 27,
            ApprovalReceive = 28,
            ApprovalIssue = 29,
			TxnSample = 30, //15-10-2024 for receipt generation
			SktCustOrder =31
        }
        public enum APILogType
		{
			PINELAB = 1,
			SMS = 2
		}

		public enum ApprovalType
		{
			Cashier = 0,
			Salesperson = 1,
			Supervisor = 2,
			Manager = 3
		}

		public enum BaseTransactionType
		{
			LogOff = 0,
			LogOn = 1,
			Sales = 2,
			Payment = 3,
			RemoveTender = 4,
			FloatEntry = 5,
			ChangeTender = 6,
			TenderDeclaration = 7,
			OpenDrawer = 9,
			SalesOrder = 14,
			SalesInvoice = 15,
			BankDrop = 16,
			SafeDrop = 17,
			IncomeExpense = 18,
			CustomerOrder = 19,
			StartingAmount = 20,
			SuspendShift = 21,
			BlindCloseShift = 22,
			CloseShift = 23,
			PrintX = 24,
			PrintZ = 25,
			PendingSalesOrder = 27,
			KitDisassembly = 28,
			AsyncCustomerQuote = 31,
			AsyncCustomerOrder = 33,
			ForceDeleteShift = 34,
			GiftCardInquiry = 35,
			SuspendedTransaction = 36,
			None = -1
		}

		public enum Message_Type
		{
			Success = 0,
			Warning = 1,
			Failed = 2
		}
    }
}