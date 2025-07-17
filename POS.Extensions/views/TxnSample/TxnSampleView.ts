import ko from "knockout";
import * as Views from "PosApi/Create/Views";
import TxnSampleViewModel from "./TxnSampleViewModel";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ITxnSampleViewModelOptions } from "./NavigationContract";
import { TxnDetail } from "../../Entities/TxnSample";

export default class TxnSampleView extends Views.CustomViewControllerBase {
    public viewModel: TxnSampleViewModel;
    constructor(context: Views.ICustomViewControllerContext, options?: ITxnSampleViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "Transaction Entry",
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
                    }
                ]
            },
        };

        super(context, config);
        this.viewModel = new TxnSampleViewModel(context, this.state, options);
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
                ratio: 10,
                collapseOrder: 1,
                minWidth: 10,
                computeValue: (rowData: TxnDetail): string => rowData.ITEMID
            },
            {
                title: "DESCRIPTION",
                ratio: 20,
                collapseOrder: 2,
                minWidth: 20,
                computeValue: (rowData: TxnDetail): string => rowData.ITEMDESCRIPTION
            },
            {
                title: "MRP",
                ratio: 10,
                collapseOrder: 3,
                minWidth: 10,
                computeValue: (rowData: TxnDetail): string => rowData.MRP.toFixed(2)
            },
            {
                title: "DISC %",
                ratio: 10,
                collapseOrder: 4,
                minWidth: 10,
                computeValue: (rowData: TxnDetail): string => rowData.DISCPERCENT.toFixed(2)
            },
            {
                title: "DISC AMT.",
                ratio: 10,
                collapseOrder: 5,
                minWidth: 10,
                computeValue: (rowData: TxnDetail): string => rowData.DISCAMOUNT.toFixed(2)
            },
            {
                title: "NET AMT.",
                ratio: 10,
                collapseOrder: 6,
                minWidth: 10,
                computeValue: (rowData: TxnDetail): string => rowData.NETAMOUNT.toFixed(2)
            },
            {
                title: "TAX %",
                ratio: 10,
                collapseOrder: 7,
                minWidth: 10,
                computeValue: (rowData: TxnDetail): string => rowData.TAXPERCENT.toFixed(2)
            },
            {
                title: "TAX AMT.",
                ratio: 10,
                collapseOrder: 8,
                minWidth: 10,
                computeValue: (rowData: TxnDetail): string => rowData.TAXAMOUNT.toFixed(2)
            },
            {
                title: "TOTAL AMT.",
                ratio: 10,
                collapseOrder: 9,
                minWidth: 10,
                computeValue: (rowData: TxnDetail): string => rowData.TOTALAMOUNT.toFixed(2)
            }

        ];
        this.viewModel.DataListManager(this.viewModel.ListOfItem());
    }

    //It is required to dispose the data when leave the page
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}