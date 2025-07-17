import ko from "knockout";
import * as Controls from "PosApi/Consume/Controls";
import { ICustomViewControllerBaseState, ICustomViewControllerContext } from "PosApi/Create/Views";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import { IDropDownV2 } from "../../Entities/RepairOrderEntities";
import { SKtEstimationDetail, SKtEstimationHeader, SKtEstimationIngredient } from "../../Entities/SktEstimationEntities";
import MessageHelpers from "../../Utilities/MessageHelpers";
import SktEstimationHelper from "../../Utilities/SktEstimationHelper";
import KnockoutExtensionViewModelBase from "../BaseClasses/KnockoutExtensionViewModelBase";
import { ISktEstimationViewModelOptions } from "./NavigationContract";

export default class SktEstimationViewModel extends KnockoutExtensionViewModelBase {

    public title: ko.Observable<string>;
    public Msg: string = "";
    public IsCreatedMode: ko.Observable<boolean>;

    //Header
    public VOUCHERNO: ko.Observable<string>;
    public SKUNUMBER: ko.Observable<string>;
    public GROSSWT: ko.Observable<number>;
    public NETWT: ko.Observable<number>;
    public ITEMNAME: ko.Observable<string>;
    public INGREDIENT: ko.Observable<number>;

    public ITEMDETAIL: ko.Observable<string>;
    public INGGROSSWT: ko.Observable<string>;

    public ListOfItem: ko.ObservableArray<SKtEstimationDetail>;
    public ListOfItem2: ko.ObservableArray<SKtEstimationIngredient>;

    public SelectedItem: ko.Observable<SKtEstimationDetail>;
    public SelectedItem2: ko.Observable<SKtEstimationIngredient>;


    public dataListLn: Controls.IDataList<SKtEstimationDetail>;
    public dataListElementId: HTMLDivElement;
    public dataListLineColumns: Commerce.Extensibility.IDataListColumn<SKtEstimationDetail>[];

    public dataListLn2: Controls.IDataList<SKtEstimationIngredient>;
    public dataListElementId2: HTMLDivElement;
    public dataListLineColumns2: Commerce.Extensibility.IDataListColumn<SKtEstimationIngredient>[];

    public selectDropdown: ko.ObservableArray<IDropDownV2>;
    public selectDropdownItem: ko.Observable<string>;





    //DataList End

    private _context: ICustomViewControllerContext;
    private _state: ICustomViewControllerBaseState;

    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options: ISktEstimationViewModelOptions) {
        super();

        this._context = context;
        this._state = state;

        //
        //Field initialisation
        this.title = ko.observable("ESTIMATION"); //Page title/header
        this._state.isProcessing = true;
        this.IsCreatedMode = ko.observable(true);
        this.VOUCHERNO = ko.observable("");
        this.SKUNUMBER = ko.observable("");
        this.GROSSWT = ko.observable(0.00);
        this.NETWT = ko.observable(0.00);
        this.ITEMNAME = ko.observable("");
        this.INGREDIENT = ko.observable(0.00);

        this.ITEMDETAIL = ko.observable("");
        this.INGGROSSWT = ko.observable(0.00);

        this.IsCreatedMode = ko.observable(true);
        this.ListOfItem = ko.observableArray([]);
        this.ListOfItem2 = ko.observableArray([]);

        this.SelectedItem = ko.observable(undefined);
        this.SelectedItem2 = ko.observable(undefined);

        ////End Field initialisation

        //----Load Event
        SktEstimationHelper.GetCurrentVoucherNumbers(this._context).then((str: string) => {
            this.VOUCHERNO(str);
        });

        this.selectDropdown = ko.observableArray([]);
        this.selectDropdownItem = ko.observable("");

        this.LoadSkuNumbers();

        this.selectDropdownItem.subscribe((newVal) => {
            console.log(newVal + "|" + this.selectDropdownItem());
            this.LoadSkuDetails();
        });

        this.SelectedItem2.subscribe((newVal) => {
            if (newVal) {
                console.log("Selected SKU:", newVal.SKUNUMBER());
                this.LoadSkuIngredients();// Fetch ingredient details
            }
        });
        this._state.isProcessing = false;
    }



    private LoadSkuNumbers = async () => {
        let data = await SktEstimationHelper.GetSkuNumbers(this._context);
        this.selectDropdown(data);
        if (data.length > 0)
            this.selectDropdownItem(data[0].value);
    }

    ////private LoadSkuDetails = async () => {
    ////    if (!StringExtensions.isNullOrWhitespace(this.selectDropdownItem()) || this.selectDropdownItem() != undefined) {
    ////        let skuInfo: SKtEstimationHeader = await SktEstimationHelper.GetEstimatationDetail(this._context, this.selectDropdownItem());
    ////        this.IsCreatedMode(false);
    ////        this.ListOfItem.push(skuInfo.LstLines);
    ////        this.DataListManager(skuInfo.LstLines);
    ////    }
    ////}

    private LoadSkuDetails = async () => {
        if (!StringExtensions.isNullOrWhitespace(this.selectDropdownItem()) || this.selectDropdownItem() != undefined) {
            let skuInfo: SKtEstimationHeader = await SktEstimationHelper.GetEstimatationDetail(this._context, this.selectDropdownItem());
            this.IsCreatedMode(false);

            let currentList = this.ListOfItem();  // Get current list
            let newItems = skuInfo.LstLines;  // Get new SKU details

            if (newItems && newItems.length > 0) {
                this.ListOfItem([...currentList, ...newItems]);  // Append current list and new list
            }
            this.DataListManager(this.ListOfItem());
        }
    }


    private LoadSkuIngredients = async () => {
        let ingredientData: SKtEstimationDetail = await SktEstimationHelper.GetEstimatationIngredient(this._context, this.ListOfItem.SKUNUMBER());
        this.IsCreatedMode(false);
        this.ListOfItem2(ingredientData.LstLines2);
        this.DataListManager2(ingredientData.LstLines2);
    }




    //DataList
    public DataListManager = (dataArray: SKtEstimationDetail[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<SKtEstimationDetail> = {
                columns: this.dataListLineColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataListLn.addEventListener("SelectionChanged", (eventData: { items: SKtEstimationDetail[] }) => {
                this.ItemChanged(eventData.items);
            });
        }
    }

    public DataListManager2 = (dataArray: SKtEstimationIngredient[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId2)) {
            this.dataListElementId2.innerHTML = "";

            let dataListOptions: Controls.IDataListOptions<SKtEstimationIngredient> = {
                columns: this.dataListLineColumns2,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn2 = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId2);
        }
    };

    // Data List Item selection
    public ItemChanged(items: SKtEstimationDetail[]): void                                                                    
        this._context.logger.logVerbose("Items selected:");
        this.SelectedItem(undefined);

        if (items.length > 0) {
            this.SelectedItem(items[0]);
            console.log('Details SKU number is', items[0].SKUNUMBER);
            this.LoadSkuIngredients();
        } else {
            // No item selected, clear the ingredient grid
            this.ListOfItem2([]);
            this.DataListManager2([]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        }~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                                                                                                                                                          
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        



    public IngDetail(items: SKtEstimationIngredient[]): void {
        this._context.logger.logVerbose("Items selected:");
        this.SelectedItem2(undefined);

        if (items.length > 0) {
            let selectedItem2 = items[0];
            this.SelectedItem2(selectedItem2);

        }
    }



    //App Bar Button Click
    public AppBarCommandButtonExecute = async () => {
        //if (this.IsCreatedMode()) { 

        //    let header: SKtEstimationHeader = {
        //        VOUCHERNO: this.VOUCHERNO(),
        //        SKUNO: this.SKUNUMBER(),
        //        LstLines: this.ListOfItem()
        //    }


        //    //without sync
        //    RepairOrderHelper.SaveRepairOrderAsync(this._context, header).then((num: number) => {
        //        if (num >= 0) {
        //            MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully !").then(() => {
        //                let param: ISktEstimationViewModelOptions = {
        //                    navigationParameters: undefined
        //                }
        //                this._context.navigator.navigate("RepairOrderView", param);
        //            });
        //        }
        //    });
        //}
    }

    //Add Item button click
    public AddItemClickHandler = async (d, e): Promise<void> => {
        //let arr: SKtEstimationIngredient[] = await SktEstimationHelper.GetEstimatationIngredient(this._context, this.SKUNUMBER);

        //let skunumber: SKtEstimationDetail = {
        //    SKUNUMBER: this.SKUNUMBER(),
        //    VOUCHERNO: this.VOUCHERNO(),
        //    GROSSWT: this.GROSSWT(),
        //    NETWT: this.NETWT(),
        //    INGREDIENT: this.INGREDIENT(),
        //    LINENUM: 0.00,
        //    ITEMNAME: this.ITEMNAME(),
        //    LstLines2: [],
        //}
        console.log("grid skunumber is", this.SKUNUMBER());
        //let Arr: SKtEstimationIngredient[] = this.ListOfItem2();
        //       Arr.push(obj);
        //       this.ListOfItem(Arr);
        //if (this.IsCreatedMode()) {
        //    if () {
        //        // Create the new item object
        //        let ingredientData: SKtEstimationDetail = await SktEstimationHelper.GetEstimatationIngredient(this._context, this.SKUNUMBER());

        //        //let obj: SKtEstimationIngredient = {
        //        //    ITEMID: this.ITEMID(),
        //        //    ITEMDESCRIPTION: this.ITEMDESCRIPTION(),
        //        //    LINENUM: 0.00,
        //        //    REPAIRCHARGE: this.REPAIRCHARGE(),
        //        //    QUANTITY: this.QUANTITY(),
        //        //    //DISCOUNTPERCENT: this.DISCOUNTPERCENT(),
        //        //    //DISCOUNTAMOUNT: this.DISCOUNTAMOUNT(),
        //        //    //UPDATEDNETTOTAL: this.UPDATEDNETTOTAL(),
        //        //    TAXAMOUNT: this.TAXAMOUNT(),
        //        //    TAXPERCENT: this.TAXPERCENT(),
        //        //    TOTALAMOUNT: this.TOTALAMOUNT(),
        //        //    NETTOTAL: this.NETTOTAL(),
        //        //    //ITEMPERTOTAL: this.ITEMPERTOTAL(),
        //        //    REPAIRORDERNUMBER: this.REPAIRORDERNUMBER(),
        //        //    SKUNUMBER: this.SKUNUMBER(),

        //        //};

        //        // Push the new item to the list
        //        //let Arr: SKtEstimationIngredient[] = this.ListOfItem();
        //        //Arr.push(obj);
        //        //this.ListOfItem(Arr);

        //        // Reset all fields after adding
        //        //this.ITEMID("");
        //        //this.ITEMDESCRIPTION("");
        //        //this.REPAIRCHARGE(0.00);
        //        //this.QUANTITY(0);
        //        //this.TAXPERCENT(0.00);
        //        //this.TAXAMOUNT(0.00);
        //        //this.TOTALAMOUNT(0.00);
        //        //this.NETTOTAL(0.00);
        //    } else {
        //        MessageHelpers.ShowWarningMessage(this._context, "Please fill required field value !");
        //    }
        //}
        return Promise.resolve();
    };

    // Show Ingredient Button Click
    public ShowIngredientClickHandler = async (): Promise<void> => {
        // Ensure an item is selected in the first grid
        if (!this.SelectedItem() || !this.SelectedItem().SKUNUMBER) {
            MessageHelpers.ShowWarningMessage(this._context, "Please select an SKU from the first grid."); 
            return;
        }

        let selectedSkuNumber = this.SelectedItem().SKUNUMBER;
        console.log("Fetching ingredients for SKU:", selectedSkuNumber);
        console.log("Hello");
        try {
            // Fetch ingredient details based on the selected SKU
            let ingredientData: SKtEstimationDetail = await SktEstimationHelper.GetEstimatationIngredient(this._context, selectedSkuNumber                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            if (ingredientData && ingredientData.LstLines2.length > 0) {
                // Update second grid with fetched ingredient details
                this.ListOfItem2(ingredientData.LstLines2);
                this.DataListManager2(ingredientData.LstLines2);
            } else {
                MessageHelpers.ShowWarningMessage(this._context, "No ingredient details found for the selected SKU.");
            }
        } catch (error) {
            console.error("Error fetching ingredient details:", error);
        }
    };

    //App Bar Button Click
    public VoidCommandButtonExecute(): void {
        let param: ISktEstimationViewModelOptions = {
            navigationParameters: undefined
        }
        this._context.navigator.navigate("SktEstimationView", param);
    }

    //App Bar Button Click
    public GoToHomeCommandButtonExecute(): void {
        //related Code on that command
        this._context.navigator.navigateToPOSView("HomeView", undefined);
    }


}
