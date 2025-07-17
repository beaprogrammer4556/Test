import ko from "knockout";
import * as Views from "PosApi/Create/Views";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { SktDropdownDetail } from "../../Entities/SktDropdownEntities";
import { ISktDropdownViewModelOptions } from "./NavigationContract";
import SktDropdownViewModel from "./SktDropdownViewModel";


export default class SktDropdownView extends Views.CustomViewControllerBase {
    public viewModel: SktDropdownViewModel;
    constructor(context: Views.ICustomViewControllerContext, options?: ISktDropdownViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "Fetch Item",
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
        this.viewModel = new SktDropdownViewModel(context, this.state, options);
        this.state.title = this.viewModel.title();
    }

    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        //Toggle Button Binding

        //Data List Binding
        this.viewModel.dataListElementId = element.querySelector("#dataListLn") as HTMLDivElement;
        this.viewModel.dataListLineColumns = [
            {
                title: "ITEMID",
                ratio: 50,
                collapseOrder: 1,
                minWidth: 50,
                computeValue: (rowData: SktDropdownDetail): string => rowData.ITEMID,
            },
            {
                title: "PRICE",
                ratio: 50,
                collapseOrder: 2,
                minWidth: 50,
                computeValue: (rowData: SktDropdownDetail): string => Number(rowData.MRP).toFixed(2),
            },
        ];
        this.viewModel.DataListManager(this.viewModel.ListOfItem());

    }

    //It is required to dispose the data when leave the page
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}