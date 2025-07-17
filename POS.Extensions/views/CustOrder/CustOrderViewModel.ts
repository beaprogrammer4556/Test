import KnockoutExtensionViewModelBase from "../BaseClasses/KnockoutExtensionViewModelBase";
import ko from "knockout";
import { ICustomViewControllerBaseState, ICustomViewControllerContext } from "PosApi/Create/Views";
import { ICustOrderViewModelOptions } from "./NavigationContract";
import { DataHelpers } from "../../Utilities/DataHelpers";
import { CustOrderDetail, CustOrderHeader } from "../../Entities/CustOrder";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import MessageHelpers from "../../Utilities/MessageHelpers";
import { NimKeyValue } from "../../Entities/Common";
import OrdNumberSelectModule from "../../controls/CustOrder/OrdNumberSelectModule";
import * as Controls from "PosApi/Consume/Controls";
import CustOrderHelper from "../../Utilities/CustOrderHelper";
export default class CustOrderViewModel extends KnockoutExtensionViewModelBase {

    public title: ko.Observable<string>;
    public Msg: string = "";
    public IsCreatedMode: ko.Observable<boolean>;

    //CustOrderHeader 
    public TRANSDATE: ko.Observable<string>;
    public DELIVERYDATE: ko.Observable<string>;
    public ORDERNUMBER: ko.Observable<string>;
    public CUSTACCOUNT: ko.Observable<string>;
    public CUSTMOBILE: ko.Observable<string>;
    public CUSTNAME: ko.Observable<string>;
    public GROSSTOTAL: ko.Observable<number>;
    public TAXTOTAL: ko.Observable<number>;
    public NETTOTAL: ko.Observable<number>;
     
    //CustOrderDetail
    public ITEMID: ko.Observable<string>;
    public ITEMDESCRIPTION: ko.Observable<string>;
    public QUANTITY: ko.Observable<number>;
    public MRP: ko.Observable<number>;
    public DISCPERCENT: ko.Observable<number>;
    public DISCAMOUNT: ko.Observable<number>;
    public NETAMOUNT: ko.Observable<number>;
    public TAXPERCENT: ko.Observable<number>;
    public TAXAMOUNT: ko.Observable<number>;
    public TOTALAMOUNT: ko.Observable<number>;

    //DataList Start
    public ListOfItem: ko.ObservableArray<CustOrderDetail>;
    public SelectedItem: ko.Observable<CustOrderDetail>;

    public dataListLn: Controls.IDataList<CustOrderDetail>;
    public dataListElementId: HTMLDivElement;
    public dataListLineColumns: Commerce.Extensibility.IDataListColumn<CustOrderDetail>[];
    //DataList End


    private _context: ICustomViewControllerContext;
    private _state: ICustomViewControllerBaseState;
  
    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options: ICustOrderViewModelOptions) {
        super()
        this._context = context;
        this._state = state;

        //Field initialisation
        this.title = ko.observable("Customer Order"); //Page title/header
        this._state.isProcessing = true;
        this.IsCreatedMode = ko.observable(true);
        this.TRANSDATE = ko.observable(DataHelpers.DateHelpers.To_ddMMyyyy(new Date(), "-"));
        this.DELIVERYDATE = ko.observable(DataHelpers.DateHelpers.To_ddMMyyyy(new Date(), "-"));
        this.ORDERNUMBER = ko.observable("");
        this.CUSTACCOUNT = ko.observable("");
        this.CUSTMOBILE = ko.observable("");
        this.CUSTNAME = ko.observable("");
        this.GROSSTOTAL = ko.observable(0.00);
        this.TAXTOTAL = ko.observable(0.00);
        this.NETTOTAL = ko.observable(0.00);

        this.ITEMID = ko.observable("");
        this.ITEMDESCRIPTION = ko.observable("");
        this.QUANTITY = ko.observable(0);
        this.MRP = ko.observable(0.00);
        this.DISCPERCENT = ko.observable(0.00);
        this.DISCAMOUNT = ko.observable(0.00);
        this.NETAMOUNT = ko.observable(0.00);
        this.TAXPERCENT = ko.observable(0.00);
        this.TAXAMOUNT = ko.observable(0.00);
        this.TOTALAMOUNT = ko.observable(0.00);   

        console.log(this._context);
        ////End Field initialisation





    }

    //DataList
    public DataListManager = (dataArray: CustOrderDetail[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<CustOrderDetail> = {
                columns: this.dataListLineColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataListLn.addEventListener("SelectionChanged", (eventData: { items: CustOrderDetail[] }) => {
                this.ItemChanged(eventData.items);
            });
        }
    }

    //Data List Item selection
    public ItemChanged(items: CustOrderDetail[]): void {
        this._context.logger.logVerbose("Items selected:");
        this.SelectedItem(undefined);
        if (items.length > 0) {
            this.SelectedItem(items[0]);
        }
    }

    //App Bar Button Click
    public AppBarCommandButtonExecute = async () => {
        if (this.IsCreatedMode()) {

            let header: CustOrderHeader = {
                CUSTACCOUNT: this.CUSTACCOUNT(),
                CUSTMOBILE: this.CUSTMOBILE(),
                CUSTNAME: this.CUSTNAME(),
                GROSSTOTAL: this.GROSSTOTAL(),
                NETTOTAL: this.NETTOTAL(),
                TAXTOTAL: this.TAXTOTAL(),
                ORDERNUMBER: this.ORDERNUMBER(),
                TRANSDATE: this.TRANSDATE(),
                DELIVERYDATE: this.DELIVERYDATE(),
                LstLines: this.ListOfItem()
            }

            //with sync
            //let num: number = await TxnSampleHelper.SaveTxnSample(this._context, header);
            //if (num >= 0) {
            //    await MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !");
            //    let param: ITxnSampleViewModelOptions = {
            //        navigationParameters: undefined
            //    }
            //    this._context.navigator.navigate("TxnSampleView", param);
            //}


            //without sync
            CustOrderHelper.SaveCustOrder(this._context, header).then((num: number) => {
                if (num >= 0) {
                    MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !").then(() => {
                        let param: ICustOrderViewModelOptions = {
                            navigationParameters: undefined
                        }
                        this._context.navigator.navigate("CustOrderView", param);
                    });
                }
            });
        }
    }

    //App Bar Button Click
    public VoidCommandButtonExecute(): void {
        let param: ICustOrderViewModelOptions = {
            navigationParameters: undefined
        }
        this._context.navigator.navigate("CustOrderView", param);
    }

    //App Bar Button Click
    public GoToHomeCommandButtonExecute(): void {
        //related Code on that command 
        this._context.navigator.navigateToPOSView("HomeView", undefined);
    }

    //App Bar Search Button Click (Without async )
    public SearchCommandButtonExecute = async () => {
        let arr: NimKeyValue[] = await CustOrderHelper.GetOrdNumbers(this._context);
        let dialog: OrdNumberSelectModule = new OrdNumberSelectModule();
        let selectedItem = await dialog.open(arr);
        if (selectedItem != undefined) {
            let txnInfo: CustOrderHeader = await CustOrderHelper.GetOrdSample(this._context, selectedItem.Key.toString());
            console.log("txnInfo", txnInfo);
            this.IsCreatedMode(false);
            this.TRANSDATE(txnInfo.TRANSDATE);
            this.DELIVERYDATE(txnInfo.DELIVERYDATE);
            this.ORDERNUMBER(txnInfo.ORDERNUMBER);
            this.CUSTACCOUNT(txnInfo.CUSTACCOUNT);
            this.CUSTMOBILE(txnInfo.CUSTMOBILE);
            this.CUSTNAME(txnInfo.CUSTNAME);
            this.GROSSTOTAL(txnInfo.GROSSTOTAL);
            this.TAXTOTAL(txnInfo.TAXTOTAL);
            this.NETTOTAL(txnInfo.NETTOTAL);
            this.ListOfItem(txnInfo.LstLines);
        }
    }

    //Custom button on page
    public AddItemClickHandler = async (d, e): Promise<void> => {

        if (this.IsCreatedMode()) {
            if (this.ITEMID() != "" || this.ITEMDESCRIPTION() != "" && this.QUANTITY() > 0 && this.MRP() > 0 && this.TAXPERCENT() > 0 && this.DISCPERCENT() > 0) {
                //Business logic start
                let obj: CustOrderDetail = {
                    DISCAMOUNT: this.DISCAMOUNT(),
                    DISCPERCENT: this.DISCPERCENT(),
                    QUANTITY: this.QUANTITY(),
                    ITEMDESCRIPTION: this.ITEMDESCRIPTION(),
                    ITEMID: this.ITEMID(),
                    LINENUM: 0.00,
                    MRP: this.MRP(),
                    NETAMOUNT: this.NETAMOUNT(),
                    TAXAMOUNT: this.TAXAMOUNT(),
                    TAXPERCENT: this.TAXPERCENT(),
                    TOTALAMOUNT: this.TOTALAMOUNT(),
                    ORDERNUMBER: this.ORDERNUMBER()
                }
                console.log("obj", obj);
                let Arr: CustOrderDetail[] = this.ListOfItem();
                Arr.push(obj)
                console.log("Arr", Arr);
                this.ListOfItem(Arr);

                console.log("this.ListOfItem()", this.ListOfItem());

                this.ITEMID("");
                this.ITEMDESCRIPTION("");
                this.QUANTITY(0);
                this.MRP(0.00);
                this.DISCPERCENT(0.00);
                this.DISCAMOUNT(0.00);
                this.NETAMOUNT(0.00);
                this.TAXPERCENT(0.00);
                this.TAXAMOUNT(0.00);
                this.TOTALAMOUNT(0.00);
            }
            else {
                MessageHelpers.ShowWarningMessage(this._context, "Please fill requied field value !");
            }
        }
        //Business Logic End
        return Promise.resolve();
    }






}