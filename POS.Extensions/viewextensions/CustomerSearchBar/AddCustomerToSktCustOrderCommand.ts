import { ProxyEntities } from "PosApi/Entities";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as SearchView from "PosApi/Extend/Views/SearchView";
import GenericStatic from "../../Entities/GenericStatic";
import { ISktCustOrderViewModelOptions } from "../../Views/SktCustOrder/NavigationContract";  //

export default class AddCustomerToSktCustOrderCommand extends SearchView.CustomerSearchExtensionCommandBase {  //

    private _customerSearchResults: ProxyEntities.GlobalCustomer[];
    constructor(context: IExtensionCommandContext<SearchView.ICustomerSearchToExtensionCommandMessageTypeMap>) {
        super(context);
        this.id = "AddCustomerToSktCustOrderCommand"; 
        this.label = "Add to SktCustOrder";
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
            GenericStatic.SktCustAccount = customer.AccountNumber;
            GenericStatic.SktCustName = customer.FullName;
           /* GenericStatic.TxnSampleCustMobile = (customer.Phone == null || customer.Phone == undefined) ? "" : customer.Phone;*/

            let nav: ISktCustOrderViewModelOptions = {
                navigationParameters: undefined
            }

            this.context.navigator.navigate("SktCustOrderView", nav);
            //*
        }
    }
}