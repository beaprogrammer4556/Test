import ko from "knockout";
import * as Controls from "PosApi/Consume/Controls";
import { ICustomViewControllerBaseState, ICustomViewControllerContext } from "PosApi/Create/Views";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import RepairOrderNumberSelectModule from "../../Controls/RepairOrder/RepairOrderNumberSelectModule";
import { NimKeyValue } from "../../Entities/Common";
import { RepairOrderDetail, RepairOrderHeader } from "../../Entities/RepairOrderEntities";
import GenericStatic from "../../Entities/GenericStatic";
import Common from "../../Utilities/Common";
import { DataHelpers } from "../../Utilities/DataHelpers";
import MessageHelpers from "../../Utilities/MessageHelpers";
import RepairOrderHelper from "../../Utilities/RepairOrderHelper";
import KnockoutExtensionViewModelBase from "../BaseClasses/KnockoutExtensionViewModelBase";
import { IRepairOrderViewModelOptions } from "./NavigationContract";

export default class RepairOrderViewModel extends KnockoutExtensionViewModelBase {

    public title: ko.Observable<string>;
    public Msg: string = "";
    public IsCreatedMode: ko.Observable<boolean>;

    //Header
    public TRANSDATE: ko.Observable<string>;
    public DELIVERYDATE: ko.Observable<string>;
    public REPAIRORDERNUMBER: ko.Observable<string>;
    public CUSTACCOUNT: ko.Observable<string>;
    public CUSTMOBILE: ko.Observable<string>;
    public CUSTNAME: ko.Observable<string>;
    public GROSSTOTAL: ko.Observable<number>;
    public TAXTOTAL: ko.Observable<number>;

    public TOTALCHARGES: ko.Observable<number>;
    //public TOGGLESTATUS: ko.Observable<number>;
    //Line
    public ITEMID: ko.Observable<string>;
    public ITEMDESCRIPTION: ko.Observable<string>;
    public QUANTITY: ko.Observable<number>;
    public REPAIRCHARGE: ko.Observable<number>;
    public NETTOTAL: ko.Observable<number>;
    public TAXPERCENT: ko.Observable<number>;
    public TAXAMOUNT: ko.Observable<number>;
    public TOTALAMOUNT: ko.Observable<number>;


    //DataList Start
    public ListOfItem: ko.ObservableArray<RepairOrderDetail>;
    public SelectedItem: ko.Observable<RepairOrderDetail>;

    public dataListLn: Controls.IDataList<RepairOrderDetail>;
    public dataListElementId: HTMLDivElement;
    public dataListLineColumns: Commerce.Extensibility.IDataListColumn<RepairOrderDetail>[];


    public ToggleElementId: HTMLDivElement;
    public IsToggleValue: ko.Observable<boolean>;
    public ToggleElement: Controls.IToggle;

    public DatePickerElementId: HTMLDivElement;
    public DatePickerDate: ko.Observable<Date>;
    public DatePickerElement: Controls.IDatePicker;

    //DataList End

    private _context: ICustomViewControllerContext;
    private _state: ICustomViewControllerBaseState;

    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options: IRepairOrderViewModelOptions) {
        super();

        this._context = context;
        this._state = state;

        ////
        //Field initialisation
        this.title = ko.observable("REPAIR ORDER ENTRY"); //Page title/header
        this._state.isProcessing = true;
        this.IsCreatedMode = ko.observable(true);
        this.TRANSDATE = ko.observable(DataHelpers.DateHelpers.To_ddMMyyyy(new Date(), "-"));
        this.DELIVERYDATE = ko.observable("");
        this.REPAIRORDERNUMBER = ko.observable("");
        //this.CUSTACCOUNT = ko.observable(GenericStatic.RepairOrderCustAccount);
        //this.CUSTMOBILE = ko.observable(GenericStatic.RepairOrderCustMobile);
        //this.CUSTNAME = ko.observable(GenericStatic.RepairOrderCustName);
        this.GROSSTOTAL = ko.observable(0.00);
        this.TAXTOTAL = ko.observable(0.00);
        this.TOTALCHARGES = ko.observable(0.00);
        //this.TOGGLESTATUS = ko.observable(0);

        this.ITEMID = ko.observable("");
        this.ITEMDESCRIPTION = ko.observable("");
        this.REPAIRCHARGE = ko.observable(0.00);
        this.QUANTITY = ko.observable(0);
        this.NETTOTAL = ko.observable(0.00);

        this.TAXPERCENT = ko.observable(0.00);
        this.TAXAMOUNT = ko.observable(0.00);
        this.TOTALAMOUNT = ko.observable(0.00);
        this.ListOfItem = ko.observableArray([]); //DataList

        this.IsToggleValue = ko.observable(false);

        this.DatePickerDate = ko.observable(new Date());

        ////End Field initialisation

        ////----Load Event
        RepairOrderHelper.GetCurrentRepairOrderNumbers(this._context).then((str: string) => {
            this.REPAIRORDERNUMBER(str);
        });
        ////----End Load Event

        //Field Value changed
        this.REPAIRCHARGE.subscribe((newValArr) => {
            this.CalculateBeforeItemAdd();
        });

        this.QUANTITY.subscribe((newValArr) => {
            this.CalculateBeforeItemAdd();
        });
        this.TAXPERCENT.subscribe((newValArr) => {
            this.CalculateBeforeItemAdd();
        });
        this.TOTALCHARGES.subscribe((newValArr) => {
            this.CalculateAfterItemAdd();
        });

        this.TAXTOTAL.subscribe((newValArr) => {
            this.CalculateAfterItemAdd();
        });
        this.GROSSTOTAL.subscribe((newValArr) => {
            this.CalculateAfterItemAdd();
        });

        //DataList
        this.ListOfItem.subscribe((newValArr) => {
            this.DataListManager(newValArr);
            this.CalculateAfterItemAdd();
        });

        //this.UpdatedListOfItem.subscribe((newValArr) => {
        //    this.DataListManager(newValArr);
        //    this.CalculateAfterItemAdd();
        //});

        //Product Fetch
        //if (GenericStatic.RepairOrderProduct != undefined) {
        //    this.ITEMID(GenericStatic.RepairOrderProduct.ItemId);
        //    this.ITEMDESCRIPTION(GenericStatic.RepairOrderProduct.Description);
        //    this.REPAIRCHARGE(GenericStatic.RepairOrderProduct.MRP);
        //}

        this._state.isProcessing = false;
    }

    //DataList
    public DataListManager = (dataArray: RepairOrderDetail[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<RepairOrderDetail> = {
                columns: this.dataListLineColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataListLn.addEventListener("SelectionChanged", (eventData: { items: RepairOrderDetail[] }) => {
                this.ItemChanged(eventData.items);
            });
        }
    }

    public fixedcursor = (data: any, event: KeyboardEvent): boolean => {
        if (event.key === "Enter") {
            event.preventDefault();

            this.REPAIRORDERNUMBER("");

            // Refocus the input field
            setTimeout(() => document.getElementById("skuInput").focus(), 100);
        }

        return true;
    };


    //Data List Item selection
    public ItemChanged(items: RepairOrderDetail[]): void {
        this._context.logger.logVerbose("Items selected:");
        this.SelectedItem(undefined);
        if (items.length > 0) {
            this.SelectedItem(items[0]);
        }
    }

    //App Bar Button Click
    public AppBarCommandButtonExecute = async () => {
        if (this.IsCreatedMode()) {

            let header: RepairOrderHeader = {
                CUSTACCOUNT: this.CUSTACCOUNT(),
                CUSTMOBILE: this.CUSTMOBILE(),
                CUSTNAME: this.CUSTNAME(),
                GROSSTOTAL: this.GROSSTOTAL(),
                TOTALCHARGES: this.TOTALCHARGES(),
                TAXTOTAL: this.TAXTOTAL(),
                //TOGGLESTATUS: this.TOGGLESTATUS(),
                REPAIRORDERNUMBER: this.REPAIRORDERNUMBER(),
                TRANSDATE: this.TRANSDATE(),
                DELIVERYDATE: this.DELIVERYDATE(),
                LstLines: this.ListOfItem()
            }

            //with sync
            //let num: number = await RepairOrderHelper.SaveTxnSample(this._context, header);
            //if (num >= 0) {
            //    await MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !");
            //    let param: IRepairOrderViewModelOptions = {
            //        navigationParameters: undefined
            //    }
            //    this._context.navigator.navigate("RepairOrderView", param);
            //}


            //without sync
            RepairOrderHelper.SaveRepairOrderAsync(this._context, header).then((num: number) => {
                if (num >= 0) {
                    MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !").then(() => {
                        let param: IRepairOrderViewModelOptions = {
                            navigationParameters: undefined
                        }
                        this._context.navigator.navigate("RepairOrderView", param);
                    });
                }
            });
        }
    }

    //App Bar Button Click
    public VoidCommandButtonExecute(): void {
        let param: IRepairOrderViewModelOptions = {
            navigationParameters: undefined
        }
        this._context.navigator.navigate("RepairOrderView", param);
    }

    //App Bar Button Click
    public GoToHomeCommandButtonExecute(): void {
        //related Code on that command
        this._context.navigator.navigateToPOSView("HomeView", undefined);
    }

    //App Bar Search Button Click (Without async )
    public SearchCommandButtonExecute = async () => {
        let arr: NimKeyValue[] = await RepairOrderHelper.GetRepairOdrNumbers(this._context);
        let dialog: RepairOrderNumberSelectModule = new RepairOrderNumberSelectModule();
        let selectedItem = await dialog.open(arr);
        if (selectedItem != undefined) {
            let reporderInfo: RepairOrderHeader = await RepairOrderHelper.GetRepairOrderAsync(this._context, selectedItem.Key.toString());
            // console.log("txnInfo", txnInfo);
            this.IsCreatedMode(false);
            this.TRANSDATE(reporderInfo.TRANSDATE);
            this.DELIVERYDATE(reporderInfo.DELIVERYDATE);
            this.REPAIRORDERNUMBER(reporderInfo.REPAIRORDERNUMBER);
            this.CUSTACCOUNT(reporderInfo.CUSTACCOUNT);
            this.CUSTMOBILE(reporderInfo.CUSTMOBILE);
            this.CUSTNAME(reporderInfo.CUSTNAME); 
            this.GROSSTOTAL(reporderInfo.GROSSTOTAL);
            this.TAXTOTAL(reporderInfo.TAXTOTAL);
            //this.TOGGLESTATUS(reporderInfo.TOGGLESTATUS);
            this.TOTALCHARGES(reporderInfo.TOTALCHARGES);
            this.ListOfItem(reporderInfo.LstLines);

        }
    }

    //Custom button on page
    public AddItemClickHandler = async (d, e): Promise<void> => {
        if (this.IsCreatedMode()) {
            if (this.ITEMID() != "" || this.ITEMDESCRIPTION() != "" && this.REPAIRCHARGE() > 0 && this.TAXPERCENT() > 0) {
                // Create the new item object
                let obj: RepairOrderDetail = {
                    ITEMID: this.ITEMID(),
                    ITEMDESCRIPTION: this.ITEMDESCRIPTION(),
                    LINENUM: 0.00,
                    REPAIRCHARGE: this.REPAIRCHARGE(),
                    QUANTITY: this.QUANTITY(),
                    //DISCOUNTPERCENT: this.DISCOUNTPERCENT(),
                    //DISCOUNTAMOUNT: this.DISCOUNTAMOUNT(),
                    //UPDATEDNETTOTAL: this.UPDATEDNETTOTAL(),
                    TAXAMOUNT: this.TAXAMOUNT(),
                    TAXPERCENT: this.TAXPERCENT(),
                    TOTALAMOUNT: this.TOTALAMOUNT(),
                    NETTOTAL: this.NETTOTAL(),
                    //ITEMPERTOTAL: this.ITEMPERTOTAL(),
                    REPAIRORDERNUMBER: this.REPAIRORDERNUMBER()
                };

                // Push the new item to the list
                let Arr: RepairOrderDetail[] = this.ListOfItem();
                Arr.push(obj);
                this.ListOfItem(Arr);

                // Reset all fields after adding
                this.ITEMID("");
                this.ITEMDESCRIPTION("");
                this.REPAIRCHARGE(0.00);
                this.QUANTITY(0);
                this.TAXPERCENT(0.00);
                this.TAXAMOUNT(0.00);
                this.TOTALAMOUNT(0.00);
                this.NETTOTAL(0.00);
            } else {
                MessageHelpers.ShowWarningMessage(this._context, "Please fill required field value !");
            }
        }
        return Promise.resolve();
    };




    public CalculateBeforeItemAdd = async (): Promise<void> => {
        let _REPAIRCHARGE: number = (Common.IsNullOrUndefinedOrBlank(this.REPAIRCHARGE().toString()) == true) ? 0.00 : this.REPAIRCHARGE();
        let _QUANTITY: number = (Common.IsNullOrUndefinedOrBlank(this.QUANTITY().toString()) == true) ? 0.00 : this.QUANTITY();
        let _TAXPERCENT: number = (Common.IsNullOrUndefinedOrBlank(this.TAXPERCENT().toString()) == true) ? 0.00 : this.TAXPERCENT();
        let _NETTOTAL = _REPAIRCHARGE * _QUANTITY;
        let _TAXAMOUNT = _NETTOTAL * _TAXPERCENT * 0.01;
        let TOTALAMOUNT = _NETTOTAL + _TAXAMOUNT
        this.NETTOTAL(_NETTOTAL);
        this.TAXAMOUNT(_TAXAMOUNT);
        this.TOTALAMOUNT(TOTALAMOUNT);
        return Promise.resolve();
    };


    public CalculateAfterItemAdd = async (): Promise<void> => {
        // Sum up all relevant fields from the ListOfItem array
        let NetTotal = await ArrayExtensions.sum(this.ListOfItem(), (obj2: RepairOrderDetail) => {
            return Math.abs(Number(obj2.NETTOTAL));
        });
        let _TotalGross = await ArrayExtensions.sum(this.ListOfItem(), (obj2: RepairOrderDetail) => {
            return Math.abs(Number(obj2.TOTALAMOUNT));
        });

        let _TotalTax = await ArrayExtensions.sum(this.ListOfItem(), (obj2: RepairOrderDetail) => {
            return Math.abs(Number(obj2.TAXAMOUNT));
        });

        this.TOTALCHARGES(NetTotal);
        this.GROSSTOTAL(_TotalGross);
        this.TAXTOTAL(_TotalTax)


        //this.NETTOTAL(_UPDATEDNETTOTAL);
        return Promise.resolve();
    };

}
