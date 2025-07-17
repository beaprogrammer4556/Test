import ko from "knockout";
import * as Views from "PosApi/Create/Views";
import * as Controls from "PosApi/Consume/Controls";
import SktCustOrderViewModel from "./SktCustOrderViewModel";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ISktCustOrderViewModelOptions } from "./NavigationContract";
import { SktCustOrderDetail } from "../../Entities/SktCustOrderEntities";

export default class SktCustOrderView extends Views.CustomViewControllerBase {
    public viewModel: SktCustOrderViewModel;
    constructor(context: Views.ICustomViewControllerContext, options?: ISktCustOrderViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "Customer Order Entry",
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
                        name: "SearchCommand",
                        label: "Search Txn",
                        icon: Views.Icons.Search,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.SearchCommandButtonExecute();
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
        this.viewModel = new SktCustOrderViewModel(context, this.state, options);
        this.state.title = this.viewModel.title();
    }

    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        //Toggle Button Binding
        this.viewModel.ToggleElementId = element.querySelector("#offerToggle") as HTMLDivElement;
        this.viewModel.ToggleElementId.innerHTML = "";
        let toggleOptions: Controls.IToggleOptions = {
            title: "Toggle Button",
            enabled: true,
            checked: this.viewModel.IsToggleValue(),
            labelOff: "No",
            labelOn: "Yes",
            tabIndex: 1
        };
        this.viewModel.ToggleElement = this.context.controlFactory.create("", "Toggle", toggleOptions, this.viewModel.ToggleElementId);
        this.viewModel.ToggleElement.addEventListener("CheckedChanged", (eventData: { checked: boolean }) => {
            this.viewModel.IsToggleValue(eventData.checked);
            this.viewModel.OFFERSTATUS(eventData.checked ? 1 : 0);
        });

        this.viewModel.ToggleElementId = element.querySelector("#floatingToggle") as HTMLDivElement;
        this.viewModel.ToggleElementId.innerHTML = "";
        let toggleOptions2: Controls.IToggleOptions = {
            title: "Toggle Button",
            enabled: true,
            checked: this.viewModel.IsToggleValue(),
            labelOff: "No",
            labelOn: "Yes",
            tabIndex: 2
        };
        this.viewModel.ToggleElement = this.context.controlFactory.create("", "Toggle", toggleOptions2, this.viewModel.ToggleElementId);
        this.viewModel.ToggleElement.addEventListener("CheckedChanged", (eventData: { checked: boolean }) => {
            this.viewModel.IsToggleValue(eventData.checked);
            this.viewModel.FLOTINGSTATUS(eventData.checked ? 1 : 0);
        });

        //Date Picker
        this.viewModel.DatePickerElementId = element.querySelector("#datePickerSelectDate") as HTMLDivElement;
        this.viewModel.DatePickerElementId.innerHTML = "";
        let datePickerOptions: Controls.IDatePickerOptions = {
            date: this.viewModel.DatePickerDate(),
            enabled: true
        };
        this.viewModel.DatePickerElement = this.context.controlFactory.create("", "DatePicker", datePickerOptions, this.viewModel.DatePickerElementId);
        this.viewModel.DatePickerElement.addEventListener("DateChanged", (eventData: { date: Date }) => {
            const day = (eventData.date.getDate() < 10 ? '0' : '') + eventData.date.getDate();
            const month = (eventData.date.getMonth() < 9 ? '0' : '') + (eventData.date.getMonth() + 1);
            const year = eventData.date.getFullYear();

            const formattedDate = `${day}-${month}-${year}`;
            this.viewModel.DELIVERYDATE(formattedDate);
        });

        //Data List Binding
        this.viewModel.dataListElementId = element.querySelector("#dataListLn") as HTMLDivElement;
        this.viewModel.dataListLineColumns = [
            {
                title: "ITEMID",
                ratio: 20,
                collapseOrder: 1,
                minWidth: 20,
                computeValue: (rowData: SktCustOrderDetail): string => rowData.ITEMID,
            },
            {
                title: "CURRENT VALUE",
                ratio: 20,
                collapseOrder: 2,
                minWidth: 20,
                computeValue: (rowData: SktCustOrderDetail): string => Number(rowData.CVALUE).toFixed(2),
            },
            {
                title: "PIECES",
                ratio: 10,
                collapseOrder: 3,
                minWidth: 10,
                computeValue: (rowData: SktCustOrderDetail): string => Number(rowData.PIECES).toFixed(2),
            },

            {
                title: "NET TOTAL",
                ratio: 20,
                collapseOrder: 4,
                minWidth: 20,
                computeValue: (rowData: SktCustOrderDetail): string => Number(rowData.NETTOTAL).toFixed(2),
            },
            {
                title: "TAX TOTAL",
                ratio: 10,
                collapseOrder: 5,
                minWidth: 10,
                computeValue: (rowData: SktCustOrderDetail): string => Number(rowData.TAXTOTAL).toFixed(2),
            },
            {
                title: "TOTAL DISCOUNT",
                ratio: 10,
                collapseOrder: 6,
                minWidth: 10,
                computeValue: (rowData: SktCustOrderDetail): string => Number(rowData.TOTALDISCOUNT).toFixed(2),
            },
            {
                title: "GROSS TOTAL",
                ratio: 10,
                collapseOrder: 7,
                minWidth: 10,
                computeValue: (rowData: SktCustOrderDetail): string => Number(rowData.GROSSTOTAL).toFixed(2),
            },
        ];
        this.viewModel.DataListManager(this.viewModel.ListOfItem());
    }

    //It is required to dispose the data when leave the page
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}
