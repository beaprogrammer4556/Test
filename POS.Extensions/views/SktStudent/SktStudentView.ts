import ko from "knockout";
import * as Views from "PosApi/Create/Views";
/*import * as Controls from "PosApi/Consume/Controls";*/
import SktStudentViewModel from "./SktStudentViewModel";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ISktStudentViewModelOptions } from "./NavigationContract";
import { StudentResultDetail } from "../../Entities/SktStudentEntities";

export default class SktStudentView extends Views.CustomViewControllerBase {
    public viewModel: SktStudentViewModel;
    constructor(context: Views.ICustomViewControllerContext, options?: ISktStudentViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "Student Entry",
            commandBar: { 
                //App bar button (vary as per requirements)
                commands: [
                    {
                        name: "AppBarCommand",
                        label: "Checkout",
                        icon: Views.Icons.Add,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.AppBarCommandButtonExecute();
                        }
                    },
                    {
                        name: "GoToHomeCommand",
                        label: "Go to Home",
                        icon: Views.Icons.Go,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.GoToHomeCommandButtonExecute();
                        }
                    },
                    //{
                    //    name: "SearchCommand",
                    //    label: "Search Txn",
                    //    icon: Views.Icons.Search,
                    //    isVisible: true,
                    //    canExecute: true,
                    //    execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                    //        this.viewModel.SearchCommandButtonExecute();
                    //    }
                    //},
                    {
                        name: "VoidCommand",
                        label: "Void",
                        icon: Views.Icons.Cancel,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.VoidCommandButtonExecute();
                        }
                    }
                ]
            },
        };

        super(context, config);
        this.viewModel = new SktStudentViewModel(context, this.state, options);
        this.state.title = this.viewModel.title();
    }

    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);


        //Data List Binding
        this.viewModel.dataListElementId = element.querySelector("#dataListLn") as HTMLDivElement;
        this.viewModel.dataListLineColumns = [
            {
                title: "SUBJECT1",
                ratio: 40,
                collapseOrder: 1,
                minWidth: 40,
                computeValue: (rowData: StudentResultDetail): string => Number(rowData.SUBJECT1).toFixed(2),
            },

            {
                title: "SUBJECT2",
                ratio: 30,
                collapseOrder: 2,
                minWidth: 30,
                computeValue: (rowData: StudentResultDetail): string => Number(rowData.SUBJECT2).toFixed(2),
            },
            {
                title: "SUBJECT3",
                ratio: 30,
                collapseOrder: 3,
                minWidth: 30,
                computeValue: (rowData: StudentResultDetail): string => Number(rowData.SUBJECT3).toFixed(2),
            }

        ];
        this.viewModel.DataListManager(this.viewModel.ListOfItem());
    }

    //It is required to dispose the data when leave the page
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}