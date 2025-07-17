import ko from "knockout";
import * as Controls from "PosApi/Consume/Controls";
import { ICustomViewControllerBaseState, ICustomViewControllerContext } from "PosApi/Create/Views";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import { TxnDetail, TxnHeader } from "../../Entities/TxnSample";
import { DataHelpers } from "../../Utilities/DataHelpers";
import MessageHelpers from "../../Utilities/MessageHelpers";
import RegexValidation from "../../Utilities/RegexValidation";
import TxnSampleHelper from "../../Utilities/TxnSampleHelper";
import KnockoutExtensionViewModelBase from "../BaseClasses/KnockoutExtensionViewModelBase";
import { ITxnSampleViewModelOptions } from "./NavigationContract";

export default class TxnSampleViewModel extends KnockoutExtensionViewModelBase {

    public title: ko.Observable<string>;
    public Msg: string = "";

    //Header 
    public TRANSACTIONID: ko.Observable<string>;
    public CUSTACCOUNT: ko.Observable<string>;
    public CUSTMOBILE: ko.Observable<string>;
    public CUSTNAME: ko.Observable<string>;
    public GROSSTOTAL: ko.Observable<number>;
    public TAXTOTAL: ko.Observable<number>;
    public NETTOTAL: ko.Observable<number>;

    //Line
    public ITEMID: ko.Observable<string>;
    public ITEMDESCRIPTION: ko.Observable<string>;
    public MRP: ko.Observable<number>;
    public DISCPERCENT: ko.Observable<number>;
    public DISCAMOUNT: ko.Observable<number>;
    public NETAMOUNT: ko.Observable<number>;
    public TAXPERCENT: ko.Observable<number>;
    public TAXAMOUNT: ko.Observable<number>;
    public TOTALAMOUNT: ko.Observable<number>;

    //DataList Start
    public ListOfItem: ko.ObservableArray<TxnDetail>;
    public SelectedItem: ko.Observable<TxnDetail>;

    public dataListLn: Controls.IDataList<TxnDetail>;
    public dataListElementId: HTMLDivElement;
    public dataListLineColumns: Commerce.Extensibility.IDataListColumn<TxnDetail>[];
    //DataList End

    private _context: ICustomViewControllerContext;
    private _state: ICustomViewControllerBaseState;

    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options: ITxnSampleViewModelOptions) {
        super();

        this._context = context;
        this._state = state;

        ////
        //Field initialisation
        this.title = ko.observable("Transaction Entry"); //Page title/header
        this._state.isProcessing = true;
        this.TRANSACTIONID = ko.observable("");
        this.CUSTACCOUNT = ko.observable("");
        this.CUSTMOBILE = ko.observable("");
        this.CUSTNAME = ko.observable("");
        this.GROSSTOTAL = ko.observable(0.00);
        this.TAXTOTAL = ko.observable(0.00);
        this.NETTOTAL = ko.observable(0.00);

        this.ITEMID = ko.observable("");
        this.ITEMDESCRIPTION = ko.observable("");
        this.MRP = ko.observable(0.00);
        this.DISCPERCENT = ko.observable(0.00);
        this.DISCAMOUNT = ko.observable(0.00);
        this.NETAMOUNT = ko.observable(0.00);
        this.TAXPERCENT = ko.observable(0.00);
        this.TAXAMOUNT = ko.observable(0.00);
        this.TOTALAMOUNT = ko.observable(0.00);     

        this.ListOfItem = ko.observableArray([]); //DataList
        this.SelectedItem = ko.observable(undefined);//DataList

        console.log(this._context);   
        ////End Field initialisation

        ////----Load Event
        TxnSampleHelper.GetCurrentTransactionNumber(this._context).then((str: string) => {
            this.TRANSACTIONID(str);
        });
        ////----End Load Event

        //Field Value changed
        this.MRP.subscribe((newValArr) => {
            this.CalculateBeforeItemAdd();
        });

        this.TAXPERCENT.subscribe((newValArr) => {
            this.CalculateBeforeItemAdd();
        });

        this.DISCPERCENT.subscribe((newValArr) => {
            this.CalculateBeforeItemAdd();
        });


        //DataList
        this.ListOfItem.subscribe((newValArr) => {
            this.DataListManager(newValArr);
            this.CalculateAfterItemAdd();
        });

        this._state.isProcessing = false;
    }

    //DataList
    public DataListManager = (dataArray: TxnDetail[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<TxnDetail> = {
                columns: this.dataListLineColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataListLn.addEventListener("SelectionChanged", (eventData: { items: TxnDetail[] }) => {
                this.ItemChanged(eventData.items);
            });
        }
    }

    //Data List Item selection
    public ItemChanged(items: TxnDetail[]): void {
        this._context.logger.logVerbose("Items selected:");
        this.SelectedItem(undefined);
        if (items.length > 0) {
            this.SelectedItem(items[0]);
        }
    }

    //App Bar Button Click
    public AppBarCommandButtonExecute = async () => {
        let _date: string = DataHelpers.DateHelpers.To_yyyyMMdd(new Date(), "-");
        let header: TxnHeader = {
            CUSTACCOUNT: this.CUSTACCOUNT(),
            CUSTMOBILE: this.CUSTMOBILE(),
            CUSTNAME: this.CUSTNAME(),
            GROSSTOTAL: this.GROSSTOTAL(),
            NETTOTAL: this.NETTOTAL(),
            TAXTOTAL: this.TAXTOTAL(),
            TRANSACTIONID: this.TRANSACTIONID(),
            TRANSDATE: _date,
            LstLines: this.ListOfItem()
        }

        let num: number = await TxnSampleHelper.SaveTxnSample(this._context, header);
        if (num >= 0) {
            await MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !");
            let param: ITxnSampleViewModelOptions = {
                navigationParameters: undefined
            }
            this._context.navigator.navigate("TxnSampleView", param);
        }
    }

    //App Bar Button Click
    public GoToHomeCommandButtonExecute(): void {
        //related Code on that command 
        this._context.navigator.navigateToPOSView("HomeView", undefined);
    }

    //Custom button on page
    public AddItemClickHandler = async (d, e): Promise<void> => {
        if (this.ITEMID() != "" || this.ITEMDESCRIPTION() != "" && this.MRP() > 0 && this.TAXPERCENT() > 0 && this.DISCPERCENT() > 0) {
            //Business logic start
            let obj: TxnDetail = {
                DISCAMOUNT: this.DISCAMOUNT(),
                DISCPERCENT: this.DISCPERCENT(),
                ITEMDESCRIPTION: this.ITEMDESCRIPTION(),
                ITEMID: this.ITEMID(),
                LINENUM: 0.00,
                MRP: this.MRP(),
                NETAMOUNT: this.NETAMOUNT(),
                TAXAMOUNT: this.TAXAMOUNT(),
                TAXPERCENT: this.TAXPERCENT(),
                TOTALAMOUNT: this.TOTALAMOUNT(),
                TRANSACTIONID: this.TRANSACTIONID()
            }

            this.ListOfItem().push(obj);
        }
        else {
            MessageHelpers.ShowWarningMessage(this._context, "Please fill requied field value !");
        }
        //Business Logic End
        return Promise.resolve();
    }

    public CalculateBeforeItemAdd = async (): Promise<void> => {
        let _MRP: number = (RegexValidation.IsDeimal(this.MRP().toString()) == true) ? this.MRP() : 0.00;
        let _DISCPERCENT: number = (RegexValidation.IsDeimal(this.DISCPERCENT().toString()) == true) ? this.DISCPERCENT() : 0.00;
        let _TAXPERCENT: number = (RegexValidation.IsDeimal(this.TAXPERCENT().toString()) == true) ? this.TAXPERCENT() : 0.00;
        let _DISCAMOUNT = _MRP * _TAXPERCENT * 0.01;
        let _NETAMOUNT = _MRP - _DISCPERCENT;
        let _TAXAMOUNT = _NETAMOUNT * _TAXPERCENT * 0.01;
        let _TOTALAMOUNT = _NETAMOUNT + _TAXAMOUNT;

        this.DISCAMOUNT(_DISCAMOUNT);
        this.NETAMOUNT(_NETAMOUNT);
        this.TAXAMOUNT(_TAXAMOUNT);
        this.TOTALAMOUNT(_TOTALAMOUNT);

        return Promise.resolve();
    }

    public CalculateAfterItemAdd = async (): Promise<void> => {
        let _TotalTax = await ArrayExtensions.sum(this.ListOfItem(), (obj2: TxnDetail) => {
            return Math.abs(Number(obj2.TAXAMOUNT));
        });
        let _TotalNet = await ArrayExtensions.sum(this.ListOfItem(), (obj2: TxnDetail) => {
            return Math.abs(Number(obj2.NETAMOUNT));
        });
        let _TotalGross = await ArrayExtensions.sum(this.ListOfItem(), (obj2: TxnDetail) => {
            return Math.abs(Number(obj2.TOTALAMOUNT));
        });

        this.GROSSTOTAL(_TotalGross);
        this.NETTOTAL(_TotalNet);
        this.TAXTOTAL(_TotalTax);
        return Promise.resolve();
    }

}