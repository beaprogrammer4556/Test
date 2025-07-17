import * as Views from "PosApi/Create/Views";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { CustOrderDetail } from "../../Entities/CustOrder";
import ko from "knockout";
import CustOrderViewModel from "./CustOrderViewModel";
export default class CustOrderView extends Views.CustomViewControllerBase{
    public viewModel: CustOrderViewModel;


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
                computeValue: (rowData: CustOrderDetail): string => rowData.ITEMID
            },
            {
                title: "DESCRIPTION",
                ratio: 10,
                collapseOrder: 2,
                minWidth: 20,
                computeValue: (rowData: CustOrderDetail): string => rowData.ITEMDESCRIPTION
            },
            {
                title: "QUANTITY",
                ratio: 10,
                collapseOrder: 3,
                minWidth: 20,
                computeValue: (rowData: CustOrderDetail): string => Number(rowData.QUANTITY).toFixed(2),
            },
            {
                title: "MRP",
                ratio: 10,
                collapseOrder: 4,
                minWidth: 10,
                computeValue: (rowData: CustOrderDetail): string => Number(rowData.MRP).toFixed(2),
            },
            {
                title: "DISC %",
                ratio: 10,
                collapseOrder: 5,
                minWidth: 10,
                computeValue: (rowData: CustOrderDetail): string => Number(rowData.DISCPERCENT).toFixed(2)
            },
            {
                title: "DISC AMT.",
                ratio: 10,
                collapseOrder: 6,
                minWidth: 10,
                computeValue: (rowData: CustOrderDetail): string => Number(rowData.DISCAMOUNT).toFixed(2)
            },
            {
                title: "NET AMT.",
                ratio: 10,
                collapseOrder: 7,
                minWidth: 10,
                computeValue: (rowData: CustOrderDetail): string => Number(rowData.NETAMOUNT).toFixed(2)
            },
            {
                title: "TAX %",
                ratio: 10,
                collapseOrder: 8,
                minWidth: 10,
                computeValue: (rowData: CustOrderDetail): string => Number(rowData.TAXPERCENT).toFixed(2)
            },
            {
                title: "TAX AMT.",
                ratio: 10,
                collapseOrder: 9,
                minWidth: 10,
                computeValue: (rowData: CustOrderDetail): string => Number(rowData.TAXAMOUNT).toFixed(2)
            },
            {
                title: "TOTAL AMT.",
                ratio: 10,
                collapseOrder: 10,
                minWidth: 10,
                computeValue: (rowData: CustOrderDetail): string => Number(rowData.TOTALAMOUNT).toFixed(2)
            }

        ];
        this.viewModel.DataListManager(this.viewModel.ListOfItem());

    }

    //It is required to dispose the data when leave the page
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}



