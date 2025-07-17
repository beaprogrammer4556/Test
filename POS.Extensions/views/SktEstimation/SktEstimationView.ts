import ko from "knockout";
import * as Views from "PosApi/Create/Views";
import SktEstimationViewModel from "./SktEstimationViewModel";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ISktEstimationViewModelOptions } from "./NavigationContract";
import { SKtEstimationDetail, SKtEstimationIngredient } from "../../Entities/SktEstimationEntities";

export default class SktEstimationView extends Views.CustomViewControllerBase {
    public viewModel: SktEstimationViewModel;
    constructor(context: Views.ICustomViewControllerContext, options?: ISktEstimationViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "ESTIMATION",
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
        this.viewModel = new SktEstimationViewModel(context, this.state, options);
        this.state.title = this.viewModel.title();
    }

    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        // Data List Binding
        this.viewModel.dataListElementId = element.querySelector("#dataListLn") as HTMLDivElement;
        this.viewModel.dataListLineColumns = [
            {
                title: "SKUNO",
                ratio: 20,
                collapseOrder: 1,
                minWidth: 20,
                computeValue: (rowData: SKtEstimationDetail): string => rowData.SKUNUMBER
            },
            {
                title: "ITEMNAME",
                ratio: 20,
                collapseOrder: 2,
                minWidth: 20,
                computeValue: (rowData: SKtEstimationDetail): string => rowData.ITEMNAME
            },
            {
                title: "GROSS WEIGHT",
                ratio: 20,
                collapseOrder: 3,
                minWidth: 20,
                computeValue: (rowData: SKtEstimationDetail): string => Number(rowData.GROSSWT).toFixed(2),
            },
            {
                title: "NET WEIGHT",
                ratio: 20,
                collapseOrder: 4,
                minWidth: 20,
                computeValue: (rowData: SKtEstimationDetail): string => Number(rowData.NETWT).toFixed(2),
            },

            {
                title: "ING",
                ratio: 20,
                collapseOrder: 5,
                minWidth: 20,
                computeValue: (rowData: SKtEstimationDetail): string => Number(rowData.INGREDIENT).toFixed(2),
            },
        ];

        // Refresh DataList with updated ListOfItem
        this.viewModel.DataListManager(this.viewModel.ListOfItem());

        this.viewModel.dataListElementId2 = element.querySelector("#dataListLn2") as HTMLDivElement;
        this.viewModel.dataListLineColumns2 = [
            {
                title: "ITEM DETAIL",
                ratio: 50,
                collapseOrder: 1,
                minWidth: 20,
                computeValue: (rowData: SKtEstimationIngredient): string => rowData.ITEMDETAIL
            },
            {
                title: "ING GROSS WT",
                ratio: 50,
                collapseOrder: 2,
                minWidth: 20,
                computeValue: (rowData: SKtEstimationIngredient): string => Number(rowData.INGGROSSWT).toFixed(2),
            },
        ];

        this.viewModel.DataListManager2(this.viewModel.ListOfItem2());

    }


    //It is required to dispose the data when leave the page
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}