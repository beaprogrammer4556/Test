import ko from "knockout";
import * as Views from "PosApi/Create/Views";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { studentsearchdetail } from "../../Entities/SktSearchStudentEntities";
import { ISktSearchStudentViewModelOptions } from "./NavigationContract";
import SktSearchStudentViewModel from "./SktSearchStudentViewModel";

export default class SktStudentSearchView extends Views.CustomViewControllerBase {
    public viewModel: SktSearchStudentViewModel;
    constructor(context: Views.ICustomViewControllerContext, options?: ISktSearchStudentViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "Student Search",
            commandBar: {
                //App bar button (vary as per requirements)
                commands: [
                    {
                        name: "VoidCommand",
                        label: "Void",
                        icon: Views.Icons.Cancel,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.VoidCommandButtonExecute();
                        }
                    },
                    {
                        name: "GoToHomeCommand",
                        label: "GoToHome",
                        icon: Views.Icons.Go,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.GoToHomeCommandButtonExecute();
                        }
                    }
                ]
            },
        };

        super(context, config);
        this.viewModel = new SktSearchStudentViewModel(context, this.state, options);
        this.state.title = this.viewModel.title();
    }

    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        //Toggle Button Binding

        //Data List Binding
        this.viewModel.dataListElementId = element.querySelector("#dataListLn") as HTMLDivElement;
        this.viewModel.dataListLineColumns = [
            {
                title: "STUDENTID",
                ratio: 20,
                collapseOrder: 1,
                minWidth: 20,
                computeValue: (rowData: studentsearchdetail): string => rowData.STUDENTID,
            },
            {
                title: "STUDENTNAME",
                ratio: 20,
                collapseOrder: 2,
                minWidth: 20,
                computeValue: (rowData: studentsearchdetail): string => rowData.STUDENTNAME,
            },
            {
                title: "SUBJECT1",
                ratio: 15,
                collapseOrder: 3,
                minWidth: 15,
                computeValue: (rowData: studentsearchdetail): string => Number(rowData.SUBJECT1).toFixed(2),
            },
            {
                title: "SUBJECT2",
                ratio: 15,
                collapseOrder: 4,
                minWidth: 15,
                computeValue: (rowData: studentsearchdetail): string => Number(rowData.SUBJECT2).toFixed(2),
            },
            {
                title: "SUBJECT3",
                ratio: 15,
                collapseOrder: 5,
                minWidth: 15,
                computeValue: (rowData: studentsearchdetail): string => Number(rowData.SUBJECT3).toFixed(2),
            },
            {
                title: "STUDENTMARKS",
                ratio: 15,
                collapseOrder: 6,
                minWidth: 15,
                computeValue: (rowData: studentsearchdetail): string => Number(rowData.STUDENTMARKS).toFixed(2),
            },
        ];
        this.viewModel.DataListManager(this.viewModel.ListOfItem());

    }

    //It is required to dispose the data when leave the page
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}

