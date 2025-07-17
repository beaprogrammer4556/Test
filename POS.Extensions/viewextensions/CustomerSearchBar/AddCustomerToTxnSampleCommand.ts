import { ProxyEntities } from "PosApi/Entities";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as SearchView from "PosApi/Extend/Views/SearchView";
import GenericStatic from "../../Entities/GenericStatic";
import { ITxnSampleViewModelOptions } from "../../Views/TxnSample/NavigationContract";  //

export default class AddCustomerToTxnSampleCommand extends SearchView.CustomerSearchExtensionCommandBase {  //

    private _customerSearchResults: ProxyEntities.GlobalCustomer[];
    constructor(context: IExtensionCommandContext<SearchView.ICustomerSearchToExtensionCommandMessageTypeMap>) {
        super(context);
        this.id = "AddCustomerToTxnSampleCommand"; //
        this.label = "Add to Txn Sample";
        this.extraClass = "iconGo";
        this._customerSearchResults = [];

        this.searchResultsSelectedHandler = (data: SearchView.CustomerSearchSearchResultSelectedData): void => {
            this._customerSearchResults = data.customers;
            this.canExecute = true;
        };

        this.searchResultSelectionClearedHandler = (): void => {
            this._customerSearchResults = [];
            this.canExecute = false;
        };
    }

    protected init(state: SearchView.ICustomerSearchExtensionCommandState): void {
        this.isVisible = true;
    }


    protected execute(): void {
        let customer: ProxyEntities.GlobalCustomer = ArrayExtensions.firstOrUndefined(this._customerSearchResults);
        if (!ObjectExtensions.isNullOrUndefined(customer)) {
            //*
            GenericStatic.TxnSampleCustAccount = customer.AccountNumber;
            GenericStatic.TxnSampleCustName = customer.FullName;
            GenericStatic.TxnSampleCustMobile = (customer.Phone == null || customer.Phone == undefined) ? "" : customer.Phone;

            let nav: ITxnSampleViewModelOptions = {
                navigationParameters: undefined
            }

            this.context.navigator.navigate("TxnSampleView", nav);
            //*
        }
    }
}