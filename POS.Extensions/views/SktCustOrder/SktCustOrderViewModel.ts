








import ko from "knockout";
import * as Controls from "PosApi/Consume/Controls";
import { ICustomViewControllerBaseState, ICustomViewControllerContext } from "PosApi/Create/Views";
import { /*ArrayExtensions,*/ ObjectExtensions } from "PosApi/TypeExtensions";
import SktCustOrderNumberSelectModule from "../../Controls/SktCustOrder/SktCustOrderNumberSelectModule";
import { NimKeyValue } from "../../Entities/Common";
import { IDropDownV2, IDropDownV3, IInventLocation, SktCustOrderDetail, SktCustOrderHeader } from "../../Entities/SktCustOrderEntities";
import Common from "../../Utilities/Common";
import GenericStatic from "../../Entities/GenericStatic";
import { DataHelpers } from "../../Utilities/DataHelpers";
import MessageHelpers from "../../Utilities/MessageHelpers";
import SktCustomerOrderHelper from "../../Utilities/SktCustomerOrderHelper";
import KnockoutExtensionViewModelBase from "../BaseClasses/KnockoutExtensionViewModelBase";
import { ISktCustOrderViewModelOptions } from "./NavigationContract";

export default class SktCustOrderViewModel extends KnockoutExtensionViewModelBase {

    public title: ko.Observable<string>;
    public Msg: string = "";
    public IsCreatedMode: ko.Observable<boolean>;

    //Header
    public ORDERNUMBER: ko.Observable<string>;
    public CUSTACCOUNT: ko.Observable<string>;
    public CUSTNAME: ko.Observable<string>;
    public ORDERDATE: ko.Observable<string>;
    public DELIVERYDATE: ko.Observable<string>;
    public OFFERSTATUS: ko.Observable<number>;
    public FLOTINGSTATUS: ko.Observable<number>;
    public INVENTLOCATION: ko.Observable<string>;
    public SALESPERSON: ko.Observable<string>;
    public REMARKS: ko.Observable<string>;
    public TOTALMETALWT: ko.Observable<number>;
    public EXPDATE: ko.Observable<string>;
    public ITEMID: ko.Observable<string>;
    public ITEMDESCRIPTION: ko.Observable<string>;
    public PIECES: ko.Observable<number>;
    public TAXPERCENT: ko.Observable<number>;
    public TOTALAMOUNT: ko.Observable<number>;
    //Line
    public LINENUM: ko.Observable<number>;
    public GROSSWT: ko.Observable<number>;
    public CVALUE: ko.Observable<number>;
    public GROSSTOTAL: ko.Observable<number>;
    public NETTOTAL: ko.Observable<number>;
    public TOTALDISCOUNT: ko.Observable<number>;
    public TAXTOTAL: ko.Observable<number>;

    //DataList Start
    public ListOfItem: ko.ObservableArray<SktCustOrderDetail>;
    public SelectedItem: ko.Observable<SktCustOrderDetail>;

    public dataListLn: Controls.IDataList<SktCustOrderDetail>;
    public dataListElementId: HTMLDivElement;
    public dataListLineColumns: Commerce.Extensibility.IDataListColumn<SktCustOrderDetail>[];

    public SelectDrpDown: ko.ObservableArray<IDropDownV2>;
    public SelectDrpDownItem: ko.Observable<string>;

    public SelectInventLocation: ko.ObservableArray<IDropDownV2>;
    public SelectedInventLocation: ko.Observable<string>;

    public OrderNum: ko.Observable<string>;
    public LstOrderNum: ko.ObservableArray<IDropDownV3>;                                                                    

    public ToggleElementId: HTMLDivElement;
    public IsToggleValue: ko.Observable<boolean>;
    public ToggleElement: Controls.IToggle;

    public DatePickerElementId: HTMLDivElement;
    public DatePickerDate: ko.Observable<Date>;
    public DatePickerElement: Controls.IDatePicker;

    //DataList End

    private _context: ICustomViewControllerContext;
    private _state: ICustomViewControllerBaseState;

    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options: ISktCustOrderViewModelOptions) {
        super();

        this._context = context;
        this._state = state;

        //Field initialisation
        this.title = ko.observable("CUSTOMER ORDER ENTRY"); //Page title/header
        this._state.isProcessing = true;
        this.IsCreatedMode = ko.observable(true);
        this.ORDERDATE = ko.observable(DataHelpers.DateHelpers.To_ddMMyyyy(new Date(), "-"));
        this.DELIVERYDATE = ko.observable("");
        this.EXPDATE = ko.observable("");
        this.ORDERNUMBER = ko.observable("");
        this.CUSTACCOUNT = ko.observable(GenericStatic.SktCustAccount);
        this.CUSTNAME = ko.observable(GenericStatic.SktCustName);
        this.OFFERSTATUS = ko.observable((0));
        this.FLOTINGSTATUS = ko.observable((0));
        this.INVENTLOCATION = ko.observable("");
        this.SALESPERSON = ko.observable("");
        this.REMARKS = ko.observable("");
        this.TOTALMETALWT = ko.observable(0.00);
        this.ITEMID = ko.observable("");
        this.ITEMDESCRIPTION = ko.observable("");
        this.PIECES = ko.observable(0.00);
        this.TAXPERCENT = ko.observable(0.00);
        this.GROSSTOTAL = ko.observable(0.00);
        this.NETTOTAL = ko.observable(0.00);
        this.TOTALDISCOUNT = ko.observable(0.00);
        this.CVALUE = ko.observable(0.00);
        this.TAXTOTAL = ko.observable(0.00);
        this.TOTALAMOUNT = ko.observable(0.00);


        //this.ITEMID = ko.observable("");
        //this.ITEMDESCRIPTION = ko.observable("");
        //this.REPAIRCHARGE = ko.observable(0.00 
        //this.QUANTITY = ko.observable(0);
        //this.NETTOTAL = ko.observable(0.00);
        //this.TAXPERCENT = ko.observable(0.00);
        //this.TAXAMOUNT = ko.observable(0.00);
        //this.TOTALAMOUNT = ko.observable(0.00);

        this.ListOfItem = ko.observableArray([]); //DataList
        this.SelectedItem = ko.observable(undefined);//DataList

        this.SelectDrpDown = ko.observableArray([{ value: "", text: "--SELECT--" }]);
        this.SelectDrpDown = ko.observableArray<IDropDownV2>([
            { text: "--SELECT--", value: "" },
            { text: "SAIKAT", value: "1" },
            { text: "SANTOSH", value: "2" },
            { text: "MEGHA", value: "3" }
        ]);
        this.SelectDrpDownItem = ko.observable("");

        this.SelectInventLocation = ko.observableArray<IInventLocation>([
            { text: "Site 1-Main Warhouse", value: "LOC001" },
            { text: "Site 2-Main Warhouse 2", value: "LOC002" },
            { text: "Site 3-Main Warhouse 3", value: "LOC003" }
        ]);
        this.SelectedInventLocation = ko.observable("");

        this.IsToggleValue = ko.observable(false);

        this.DatePickerDate = ko.observable(new Date());

        //End Field initialisation

        //----Load Event
        SktCustomerOrderHelper.GetCurrentCustOrderNumbers(this._context).then((str: string) => {
            this.ORDERNUMBER(str);
        });
        //----End Load Event

        //Field Value changed
        //this.TOTALMETALWT.subscribe((newValArr) => {
        //    this.CalculateBeforeItemAdd();
        //});

        //this.PIECES.subscribe((newValArr) => {
        //    this.CalculateBeforeItemAdd();
        //});

        //this.TAXTOTAL.subscribe((newValArr) => {
        //    this.CalculateBeforeItemAdd();
        //});

        //this.OFFODRADV.subscribe((newValArr) => {
        //    this.CalculateBeforeItemAdd();
        //});

        //this.TOTALAMOUNT.subscribe((newValArr) => {
        //    this.CalculateBeforeItemAdd();
        //});
        //this.NETTOTAL.subscribe((newValArr) => {
        //    this.CalculateAfterItemAdd();
        //});
        //this.TAXTOTAL.subscribe((newValArr) => {
        //    this.CalculateAfterItemAdd();
        //});
        //this.GROSSTOTAL.subscribe((newValArr) => {
        //    this.CalculateAfterItemAdd();
        //});
        //this.SelectDrpDownItem.subscribe((newVal) => {
        //    console.log(newVal + "|" + this.SelectDrpDownItem());
        //});


        //DataList
        this.ListOfItem.subscribe((newValArr) => {
            this.DataListManager(newValArr);
            /* this.CalculateAfterItemAdd();*/
        });
        if (GenericStatic.SktCustOrderProduct != undefined) {
            this.ITEMID(GenericStatic.SktCustOrderProduct.ItemId);
            this.ITEMDESCRIPTION(GenericStatic.SktCustOrderProduct.Description);
            this.CVALUE(GenericStatic.SktCustOrderProduct.MRP);
        }
        this._state.isProcessing = false;
    }

    //DataList
    public DataListManager = (dataArray: SktCustOrderDetail[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<SktCustOrderDetail> = {
                columns: this.dataListLineColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataListLn.addEventListener("SelectionChanged", (eventData: { items: SktCustOrderDetail[] }) => {
                this.ItemChanged(eventData.items);
            });
        }
    }

    //Data List Item selection
    public ItemChanged(items: SktCustOrderDetail[]): void {
        this._context.logger.logVerbose("Items selected:");
        this.SelectedItem(undefined);
        if (items.length > 0) {
            this.SelectedItem(items[0]);
        }
    }

    //App Bar Button Click
    public AppBarCommandButtonExecute = async () => {
        if (this.IsCreatedMode()) {

            let header: SktCustOrderHeader = {
                CUSTACCOUNT: this.CUSTACCOUNT(),
                CUSTNAME: this.CUSTNAME(),
                OFFERSTATUS: this.OFFERSTATUS(),
                FLOTINGSTATUS: this.FLOTINGSTATUS(),
                ORDERNUMBER: this.ORDERNUMBER(),
                ORDERDATE: this.ORDERDATE(),
                DELIVERYDATE: this.DELIVERYDATE(),
                INVENTLOCATION: this.INVENTLOCATION(),
                SALESPERSON: this.SALESPERSON(),
                REMARKS: this.REMARKS(),
                TOTALMETALWT: this.TOTALMETALWT(),
                ITEMID: this.ITEMID(),
                ITEMDESCRIPTION: this.ITEMDESCRIPTION(),
                PIECES: this.PIECES(),
                TAXPERCENT: this.TAXPERCENT(),
                TOTALAMOUNT: this.TOTALAMOUNT(),
                CVALUE: this.CVALUE(),
                LstLines: this.ListOfItem()
            }

            //with sync
            //let num: number = await SktCustomerOrderHelper.SaveTxnSample(this._context, header);
            //if (num >= 0) {
            //    await MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !");
            //    let param: ISktCustOrderViewModelOptions = {
            //        navigationParameters: undefined
            //    }
            //    this._context.navigator.navigate("StkCustOrderView", param);
            //}


            //without sync
            SktCustomerOrderHelper.SaveCustOrderAsync(this._context, header).then((num: number) => {
                if (num >= 0) {
                    MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !").then(() => {
                        let param: ISktCustOrderViewModelOptions = {
                            navigationParameters: undefined
                        }
                        this._context.navigator.navigate("SktCustOrderView", param);
                    });
                }
            });
        }
    }

    //App Bar Button Click
    public VoidCommandButtonExecute(): void {
        let param: ISktCustOrderViewModelOptions = {
            navigationParameters: undefined
        }
        this._context.navigator.navigate("SktCustOrderView", param);
    }

    //App Bar Button Click
    public GoToHomeCommandButtonExecute(): void {
        //related Code on that command
        this._context.navigator.navigateToPOSView("HomeView", undefined);
    }

    //App Bar Search Button Click (Without async )
    public SearchCommandButtonExecute = async () => {
        let arr: NimKeyValue[] = await SktCustomerOrderHelper.GetCustOdrNumbers(this._context);
        let dialog: SktCustOrderNumberSelectModule = new SktCustOrderNumberSelectModule();
        let selectedItem = await dialog.open(arr);
        if (selectedItem != undefined) {
            let reporderInfo: SktCustOrderHeader = await SktCustomerOrderHelper.GetCustOrderAsync(this._context, selectedItem.Key.toString());
            this.IsCreatedMode(false);
            this.ORDERDATE(reporderInfo.ORDERDATE);
            this.DELIVERYDATE(reporderInfo.DELIVERYDATE);
            this.ORDERNUMBER(reporderInfo.ORDERNUMBER);
            this.CUSTACCOUNT(reporderInfo.CUSTACCOUNT);
            this.CUSTNAME(reporderInfo.CUSTNAME);
            this.OFFERSTATUS(reporderInfo.OFFERSTATUS);
            this.FLOTINGSTATUS(reporderInfo.FLOTINGSTATUS);
            this.ITEMID(reporderInfo.ITEMID);
            this.ITEMDESCRIPTION(reporderInfo.ITEMDESCRIPTION);
            this.PIECES(reporderInfo.PIECES);
            this.TAXPERCENT(reporderInfo.TAXPERCENT);
            this.ListOfItem(reporderInfo.LstLines);
        }
    }

    //Custom button on page
    public AddItemClickHandler = async (d, e): Promise<void> => {
        if (this.IsCreatedMode()) {
            if (this.ITEMID() != "" || this.TAXPERCENT() > 0 && this.PIECES() > 0) {
                await this.CalculateBeforeItemAdd();
                //Business logic start
                let obj: SktCustOrderDetail = {
                    ITEMID: this.ITEMID(),
                    LINENUM: 0.00,
                    PIECES: this.PIECES(),
                    GROSSTOTAL: this.GROSSTOTAL(),
                    CVALUE: this.CVALUE(),
                    NETTOTAL: this.NETTOTAL(),
                    TAXTOTAL: this.TAXTOTAL(),
                    ORDERNUMBER: this.ORDERNUMBER(),
                }
                console.log("obj", obj);
                let Arr: SktCustOrderDetail[] = this.ListOfItem();
                Arr.push(obj)
                console.log("Arr", Arr);
                this.ListOfItem(Arr);

                this.DataListManager(this.ListOfItem());
                console.log("this.ListOfItem()", this.ListOfItem());

  
                this.ITEMID("");
                this.ITEMDESCRIPTION("");
                this.CVALUE(0.00);
                this.PIECES(0);
                this.NETTOTAL(0.00);  
                this.GROSSTOTAL(0.00);
                this.TAXTOTAL(0.00);
                this.TOTALAMOUNT(0.00);
                this.TOTALMETALWT(0.00);

                console.log(this.ListOfItem());
            }
            else {
                MessageHelpers.ShowWarningMessage(this._context, "Please fill requied field value !");
            }
        }           
        //Business Logic End
        return Promise.resolve();
    }

    public CalculateBeforeItemAdd = async (): Promise<void> => {
        let _METALWT: number = (Common.IsNullOrUndefinedOrBlank(this.TOTALMETALWT.toString()) == true) ? 0.00 : this.TOTALMETALWT();
        let _PIECES: number = (Common.IsNullOrUndefinedOrBlank(this.PIECES().toString()) == true) ? 0.00 : this.PIECES();
        let _CVALUE: number = (Common.IsNullOrUndefinedOrBlank(this.CVALUE().toString()) == true) ? 0.00 : this.CVALUE();
        let _TAXPERCENT: number = (Common.IsNullOrUndefinedOrBlank(this.TAXPERCENT().toString()) == true) ? 0.00 : this.TAXPERCENT();


        let _NETTOTAL = _CVALUE * _METALWT * _PIECES;
        let _TAXTOTAL = _NETTOTAL * _TAXPERCENT * 0.01;
        let _GROSSTOTAL = _NETTOTAL + _TAXTOTAL;

        this.TOTALAMOUNT(_GROSSTOTAL);
        this.CVALUE(_CVALUE);
        this.TAXTOTAL(_TAXTOTAL);
        this.NETTOTAL(_NETTOTAL);
        this.GROSSTOTAL(_GROSSTOTAL);

        // console.log(_PIECES, "-", _TAXPERCENT, "-", TAXAMOUNT, "-", _TOTALAMOUNT);
        return Promise.resolve();
    }

    //public CalculateAfterItemAdd = async (): Promise<void> => {

    //    let NetTotal = await ArrayExtensions.sum(this.ListOfItem(), (obj2: SktCustOrderDetail) => {
    //        return Math.abs(Number(obj2.NETTOTAL));
    //    });
    //    let _TotalTax = await ArrayExtensions.sum(this.ListOfItem(), (obj2: SktCustOrderDetail) => {
    //        return Math.abs(Number(obj2.TAXTOTAL));
    //    });
    //    let _TotalGross = await ArrayExtensions.sum(this.ListOfItem(), (obj2: SktCustOrderDetail) => {
    //        return Math.abs(Number(obj2.GROSSTOTAL));
    //    });
    //    let currentvalue = await ArrayExtensions.sum(this.ListOfItem(), (obj2: SktCustOrderDetail) => {
    //        return Math.abs(Number(obj2.CVALUE));
    //    });

    //    this.NETTOTAL(NetTotal);
    //    this.GROSSTOTAL(_TotalGross);
    //    this.TAXTOTAL(_TotalTax);
    //    this.CVALUE(currentvalue);
    //    return Promise.resolve();
    //}


}