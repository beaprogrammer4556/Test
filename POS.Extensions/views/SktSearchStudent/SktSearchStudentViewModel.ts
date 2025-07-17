import ko from "knockout";                                                                                                                      
import { ICustomViewControllerBaseState, ICustomViewControllerContext } from "PosApi/Create/Views";
import KnockoutExtensionViewModelBase from "../BaseClasses/KnockoutExtensionViewModelBase";
import * as Controls from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ISktSearchStudentViewModelOptions } from "./NavigationContract";
import { studentsearchdetail, studentsearcheader } from "../../Entities/SktSearchStudentEntities";
import SktSearchStudentHelper from "../../Utilities/SktSearchStudentHelper";
import { IDropDownV2 } from "../../Entities/SktDropdownEntities";

export default class SktSearchStudentViewModel extends KnockoutExtensionViewModelBase {
    public title: ko.Observable<string>;
    public Msg: string = "";
    public IsCreatedMode: ko.Observable<boolean>;

    public STUDENTID: ko.Observable<string>;
    public STUDENTNAME: ko.Observable<string>;     
    public SUBJECT1: ko.Observable<number>;
    public SUBJECT2: ko.Observable<number>;
    public SUBJECT3: ko.Observable<number>;
    public STUDENTMARKS: ko.Observable<number>;

    public ListOfItem: ko.ObservableArray<studentsearchdetail>;
    public SelectedItem: ko.Observable<studentsearchdetail>;

    public dataListLn: Controls.IDataList<studentsearchdetail>;
    public dataListElementId: HTMLDivElement;
    public dataListLineColumns: Commerce.Extensibility.IDataListColumn<studentsearchdetail>[];

    public selectDropdown: ko.ObservableArray<IDropDownV2>;
    public selectDropdownItem: ko.Observable<string>;

    private _context: ICustomViewControllerContext;
    private _state: ICustomViewControllerBaseState;

    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options: ISktSearchStudentViewModelOptions) {
        super();

        this._context = context;
        this._state = state;

        this.title = ko.observable("Student Search");
        this.IsCreatedMode = ko.observable(true);
                                                               
        this.ListOfItem = ko.observableArray([]);
        this.SelectedItem = ko.observable(undefined);

        this.STUDENTID = ko.observable("");
        this.STUDENTNAME = ko.observable("");
        this.SUBJECT1 = ko.observable(0.00);
        this.SUBJECT2 = ko.observable(0.00);
        this.SUBJECT3 = ko.observable(0.00);
        this.STUDENTMARKS = ko.observable(0.00);

        this.selectDropdown = ko.observableArray([]);
        this.selectDropdownItem = ko.observable("");

        this.selectDropdownItem.subscribe((newVal) => {
            console.log(newVal + "|" + this.selectDropdownItem());
            this.LoadStudentDetails();
        });

        this.selectDropdown.subscribe((newVal) => {
            this.DataListManager(this.selectDropdown());
        });

        this.LoadStudentIds();
        this._state.isProcessing = false;
    }

    private LoadStudentIds = async () => {
        let data = await SktSearchStudentHelper.GetStdNumbers(this._context);
        this.selectDropdown(data);
        if (data.length > 0)
            this.selectDropdownItem(data[0].value);
    }

    private LoadStudentDetails = async () => {
        let stdInfo: studentsearcheader[] = await SktSearchStudentHelper.GetStudentDetailSearch(this._context, this.selectDropdownItem());
        this.IsCreatedMode(false);
        this.ListOfItem(stdInfo);
    }


    public DataListManager = (dataArray: studentsearchdetail[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<studentsearchdetail> = {
                columns: this.dataListLineColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataListLn.addEventListener("SelectionChanged", (eventData: { items: studentsearchdetail[] }) => {
                this.ItemChanged(eventData.items);
            });
        }
    }

    public ItemChanged(items: studentsearchdetail[]): void {
        this.SelectedItem(undefined);
        if (items.length > 0) {
            this.SelectedItem(items[0]);
            this.STUDENTNAME(items[0].STUDENTNAME);
            this.SUBJECT1(items[0].SUBJECT1);
            this.SUBJECT2(items[0].SUBJECT2);
            this.SUBJECT3(items[0].SUBJECT3);
            this.STUDENTMARKS(items[0].STUDENTMARKS);
        }
    }


    public VoidCommandButtonExecute(): void {
        let param: ISktSearchStudentViewModelOptions = {
            navigationParameters: undefined,
        };
        this._context.navigator.navigate("SktSearchStudentView", param);
    }

    public GoToHomeCommandButtonExecute(): void {

    }
}




