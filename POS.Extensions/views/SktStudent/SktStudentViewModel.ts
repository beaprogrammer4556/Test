import ko from "knockout";
import { ICustomViewControllerBaseState, ICustomViewControllerContext } from "PosApi/Create/Views";
import KnockoutExtensionViewModelBase from "../BaseClasses/KnockoutExtensionViewModelBase";
import * as Controls from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { StudentResultDetail, StudentInfoHeader } from "../../Entities/SktStudentEntities";
import MessageHelpers from "../../Utilities/MessageHelpers";
import SktStudentHelper from "../../Utilities/SktStudentHelper";
import { ISktStudentViewModelOptions } from "../SktStudent/NavigationContract";
export default class SktStudentViewModel extends KnockoutExtensionViewModelBase {
 
    public title: ko.Observable<string>;
    public Msg: string = "";
    public IsCreatedMode: ko.Observable<boolean>;
    public IsEditable: ko.Observable<boolean>;
    public STUDENTID: ko.Observable<string>;
    public STUDENTNAME: ko.Observable<string>;
    public STUDENTCLASS: ko.Observable<string>;

    public SUBJECT1: ko.Observable<number>;
    public SUBJECT2: ko.Observable<number>;
    public SUBJECT3: ko.Observable<number>;



    //DataList Start  
    public ListOfItem: ko.ObservableArray<StudentResultDetail>;
    public SelectedItem: ko.Observable<StudentResultDetail>;

    public dataListLn: Controls.IDataList<StudentResultDetail>;
    public dataListElementId: HTMLDivElement;
    public dataListLineColumns: Commerce.Extensibility.IDataListColumn<StudentResultDetail>[];
    //DataList End

    private _context: ICustomViewControllerContext;
    private _state: ICustomViewControllerBaseState;


    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options: ISktStudentViewModelOptions) {
        super();

        this._context = context;
        this._state = state;

        this.title = ko.observable("Student Entry"); //Page title/header
        this._state.isProcessing = true;
        console.log(this._context);
        ////
        //Field initialisation
        this.IsCreatedMode = ko.observable(true);
        this.IsEditable = ko.observable(true);
        this.ListOfItem = ko.observableArray([]);
        this.SelectedItem = ko.observable(undefined);

        this.STUDENTID = ko.observable("");
        this.STUDENTNAME = ko.observable("");
        this.STUDENTCLASS = ko.observable("");
        this.SUBJECT1 = ko.observable(0.00);
        this.SUBJECT2 = ko.observable(0.00);
        this.SUBJECT3 = ko.observable(0.00);
        ////

        ////----Load Event
        SktStudentHelper.GetCurrentStudentIdNumbers(this._context).then((str: string) => {
            this.STUDENTID(str);
        });
        ////----End Load Event

        //DataList
        this.ListOfItem.subscribe((newValArr) => {
            this.DataListManager(newValArr);
        });

        this._state.isProcessing = false;
    }

    //DataList
    public DataListManager = (dataArray: StudentResultDetail[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<StudentResultDetail> = {
                columns: this.dataListLineColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect,
            };

            this.dataListLn = this._context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataListLn.addEventListener("SelectionChanged", (eventData: { items: StudentResultDetail[] }) => {
                this.ItemChanged(eventData.items);
            });
        }
    }

    //Data List Item selection           
    public ItemChanged(items: StudentResultDetail[]): void {
        this._context.logger.logVerbose("Items selected:");
        this.SelectedItem(undefined);
        if (items.length > 0) {
            this.SelectedItem(items[0]);
        }
    }



    //App Bar Button Click
    public VoidCommandButtonExecute(): void {
        let param: ISktStudentViewModelOptions = {
            navigationParameters: undefined
        }
        this._context.navigator.navigate("SktStudentView", param);
    }

    //Custom button on page
    public AddItemClickHandler = async (d, e): Promise<void> => {
        if (this.IsCreatedMode()) {
            if (isNaN(this.SUBJECT1())) {
                MessageHelpers.ShowWarningMessage(this._context, "Please enter a valid numeric values for subject 1!");
                return;
            }
            if (isNaN(this.SUBJECT2())) {
                MessageHelpers.ShowWarningMessage(this._context, "Please enter a valid numeric values for subject 2!");
                return;
            }
            if (isNaN(this.SUBJECT3())) {
                MessageHelpers.ShowWarningMessage(this._context, "Please enter a valid numeric values for subject 3!");
                return;
            }
            if (this.SUBJECT1() <= 0 || this.SUBJECT2() <= 0 || this.SUBJECT3() <= 0 || this.SUBJECT1() > 100 || this.SUBJECT2() > 100 || this.SUBJECT3() > 100) {
                if (this.SUBJECT1() <= 0 || this.SUBJECT1() > 100) {
                    MessageHelpers.ShowWarningMessage(this._context, "Please enter a valid number for Subject 1!");
                } else if (this.SUBJECT2() <= 0 || this.SUBJECT2() > 100) {
                    MessageHelpers.ShowWarningMessage(this._context, "Please enter a valid number for Subject 2!");
                } else if (this.SUBJECT3() <= 0 || this.SUBJECT3 > 100) {
                    MessageHelpers.ShowWarningMessage(this._context, "Please enter a valid number for Subject 3!");
                }
                return;
            }

            // Create the new item object
            let obj: StudentResultDetail = {
                STUDENTID: this.STUDENTID(),
                SUBJECT1: this.SUBJECT1(),
                LINENUM: 0.00,
                SUBJECT2: this.SUBJECT2(),
                SUBJECT3: this.SUBJECT3(),
            };

            let Arr: StudentResultDetail[] = this.ListOfItem();
            Arr.push(obj);
            this.ListOfItem(Arr);
            this.IsEditable(false);
            // Reset all fields after adding
            this.SUBJECT1(0.00);
            this.SUBJECT2(0.00);
            this.SUBJECT3(0.00);              
        }
        return Promise.resolve();
    };


    //App Bar Button Click
    public AppBarCommandButtonExecute = async () => {   
        if (this.IsCreatedMode()) {
            // Validate the student name and class
            if (!this.STUDENTNAME() || this.STUDENTNAME().trim() === "" || !isNaN(Number(this.STUDENTNAME()))) {
                MessageHelpers.ShowWarningMessage(this._context, "Please enter a  valid student name!");
                return;
            }

            if (!this.STUDENTCLASS() || this.STUDENTCLASS().trim() === "" || this.STUDENTCLASS() <= 0 || this.STUDENTCLASS() > 12) {
                MessageHelpers.ShowWarningMessage(this._context, "Please enter a valid student class!");
                return;
            }

            let header: StudentInfoHeader = {
                STUDENTID: this.STUDENTID(),
                STUDENTNAME: this.STUDENTNAME(),
                STUDENTCLASS: this.STUDENTCLASS(),
                LstLines: this.ListOfItem()
            };


            SktStudentHelper.SaveStudentDetailAsync(this._context, header).then((num: number) => {
                if (num >= 0) {
                    MessageHelpers.ShowSuccessMessage(this._context, "Data saved successfully!").then(() => {
                        // Reset the form fields after successful save
                        this.STUDENTNAME('');
                        this.STUDENTCLASS('');
                        this.ListOfItem([]);
                        this.IsEditable(true);
                        let param: ISktStudentViewModelOptions = {
                            navigationParameters: undefined
                        };
                        this._context.navigator.navigate("SktStudentView", param);
                    });
                }
            });
        }
    };


    ////App Bar Search Button Click (Without async )
    //public SearchCommandButtonExecute = async () => {
    //    let arr: NimKeyValue[] = await SktStudentHelper.GetStdNumbers(this._context);
    //    let dialog: StsStudentSelectModule = new StsStudentSelectModule();
    //    let selectedItem = await dialog.open(arr);
    //    if (selectedItem != undefined) {
    //        let ordInfo: STUDENT = await SktStudentHelper.GetStudentDetail(this._context, selectedItem.Key.toString());
    //        // console.log("ordInfo", ordInfo);


    //        this.IsCreatedMode(false);

    //        this.STUDENTID(ordInfo.STUDENTID);
    //        this.STUDENTNAME(ordInfo.STUDENTNAME);
    //        this.CLASS(ordInfo.CLASS);

    //        this.ListOfItem(ordInfo.LstLines);
    //    }
    //}



    //App Bar Button Click  
    public GoToHomeCommandButtonExecute(): void {
        //related Code on that command 
        this._context.navigator.navigateToPOSView("HomeView", undefined);
    }
}