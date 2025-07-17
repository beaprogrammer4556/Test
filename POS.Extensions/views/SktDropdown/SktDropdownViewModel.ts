import ko from "knockout";
import { ICustomViewControllerBaseState, ICustomViewControllerContext } from "PosApi/Create/Views";
import KnockoutExtensionViewModelBase from "../BaseClasses/KnockoutExtensionViewModelBase";
import { ISktDropdownViewModelOptions } from "./NavigationContract";
import * as Controls from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { IDropDownV2, SktDropdownDetail, SktDropdownHeader } from "../../Entities/SktDropdownEntities";
import SktDropdownHelper from "../../Utilities/SktDropdownHelper";
import MessageHelpers from "../../Utilities/MessageHelpers";
import { NimKeyValue } from "../../Entities/Common";

export default class SktDropdownViewModel extends KnockoutExtensionViewModelBase {

    public title: ko.Observable<string>;
    public Msg: string = "";
    public IsCreatedMode: ko.Observable<boolean>;


    public ORDERNUMBER: ko.Observable<string>;
    public LstOrderNum: ko.ObservableArray<IDropDownV2>;

    public ITEMID: ko.Observable<string>;
    public LINENUM: ko.Observable<number>;
    public PRICE: ko.Observable<number>;



    //DataList Start
    public ListOfItem: ko.ObservableArray<SktDropdownDetail>;
    public SelectedItem: ko.Observable<SktDropdownDetail>;

    public dataListLn: Controls.IDataList<SktDropdownDetail>;
    public dataListElementId: HTMLDivElement;
    public dataListLineColumns: Commerce.Extensibility.IDataListColumn<SktDropdownDetail>[];
    //DataList End

    private _context: ICustomViewControllerContext;
    private _state: ICustomViewControllerBaseState;


    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options: ISktDropdownViewModelOptions) {
        super();

        this._context = context;
        this._state = state;

        this.title = ko.observable("Receved Entry");
        this._state.isProcessing = true;
        console.log(this._context);
        ////
        //Field initialisation
        this.IsCreatedMode = ko.observable(true);
        this.ListOfItem = ko.observableArray([]);
        this.SelectedItem = ko.observable(undefined);
        this.ORDERNUMBER = ko.observable("");
        this.ITEMID = ko.observable("");
        this.LINENUM = ko.observable(0.00);
        this.PRICE = ko.observable(0.00);
        ////


        //DataList
        //this.ListOfItem.subscribe((newValArr) => {
        //    this.DataListManager(newValArr);

        //});


        this._state.isProcessing = false;
    }

    //DataList
    public DataListManager = (dataArray: SktDropdownDetail[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<SktDropdownDetail> = {
                columns: this.dataListLineColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataListLn.addEventListener("SelectionChanged", (eventData: { items: SktDropdownDetail[] }) => {
                this.ItemChanged(eventData.items);
            });
        }
    }

    //Data List Item selection
    public ItemChanged(items: SktDropdownDetail[]): void {
        this._context.logger.logVerbose("Items selected:");
        this.SelectedItem(undefined);
        if (items.length > 0) {
            this.SelectedItem(items[0]);
        }
    }


    //App Bar Button Click
    public AppBarCommandButtonExecute = async () => {
        if (this.IsCreatedMode()) {

            let header: SktDropdownHeader = {
                ITEMID: this.ITEMID(),
                LstLines: this.ListOfItem()
            }

            //without sync
            SktDropdownHelper.SaveDropdownAsync(this._context, header).then((num: number) => {
                if (num >= 0) {
                    MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !").then(() => {
                        let param: ISktDropdownViewModelOptions = {
                            navigationParameters: undefined
                        }
                        this._context.navigator.navigate("SktDropdownView", param);
                    });
                }
            });
        }
    }



    public SearchItemIdExecute = async () => {
        let arr: NimKeyValue[] = await SktDropdownHelper.GetItemIDNumbers(this._context);
        let selectedItem = await dialog.open(arr);
        if (selectedItem != undefined) {
            let dropdownInfo: SktDropdownHeader = await SktDropdownHelper.GetItemIDNumbers(this._context, selectedItem.Key.toString());
            // console.log("txnInfo", txnInfo);
            this.IsCreatedMode(false);
            this.ITEMID(dropdownInfo.ITEMID);
            this.ListOfItem(dropdownInfo.LstLines);


        }
    }
}

