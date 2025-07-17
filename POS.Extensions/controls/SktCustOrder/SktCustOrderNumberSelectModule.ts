import ko from "knockout";
import * as Dialogs from "PosApi/Create/Dialogs";
import * as Controls from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { NimKeyValue } from "../../Entities/Common";

type MessageDialogResolve = (value: NimKeyValue) => void;
type MessageDialogReject = (reason: any) => void;

export default class StkCustOrderNumberSelectModule extends Dialogs.ExtensionTemplatedDialogBase {

    private resolve: MessageDialogResolve;

    public ReferenceNumber: ko.Observable<string>;
    public ReferenceNumberList: ko.ObservableArray<NimKeyValue>;
    public AllReferenceNumberList: ko.ObservableArray<NimKeyValue>;
    public SelectedReferenceNumber: ko.Observable<NimKeyValue>;

    public dataList: Controls.IDataList<NimKeyValue>;
    public dataListElementId: HTMLDivElement;
    public dataListColumns: Commerce.Extensibility.IDataListColumn<NimKeyValue>[];

    constructor() {
        super();
        this.ReferenceNumber = ko.observable("");
        this.ReferenceNumberList = ko.observableArray([]);
        this.AllReferenceNumberList = ko.observableArray([]);
        this.SelectedReferenceNumber = ko.observable(undefined);

        this.ReferenceNumber.subscribe((newVal) => {
            if (newVal.length >= 5) {
                let arr = this.AllReferenceNumberList().filter((obj) => {
                    return obj.INVENTBATCHID.indexOf(this.ReferenceNumber()) >= 0
                });
                if (arr != null && arr != undefined && arr.length > 0) {
                    this.ReferenceNumberList(arr);
                }
            }
        });

        this.ReferenceNumberList.subscribe((nv) => {
            this.DataListManager(nv);
        });
    }

    public selectionChangedInterReceipt(items: NimKeyValue[]): void {
        this.SelectedReferenceNumber(undefined);
        if (items.length > 0) {
            this.SelectedReferenceNumber(items[0]);
        }
    }

    public onReady(el: HTMLElement): void {
        ko.applyBindings(this, el);
        this.dataListElementId = el.querySelector("#dataList") as HTMLDivElement;
        this.dataListColumns = [
            {
                title: "CustomerOrder Number",
                ratio: 100,
                collapseOrder: 1,
                minWidth: 100,
                computeValue: (rowData: NimKeyValue): string => rowData.Key.toString()
            }
        ];
        this.DataListManager(this.ReferenceNumberList());

    }

    private DataListManager = (dataArray: NimKeyValue[]) => {
        if (!ObjectExtensions.isNullOrUndefined(this.dataListElementId)) {
            this.dataListElementId.innerHTML = "";
            let dataListOptions: Controls.IDataListOptions<NimKeyValue> = {
                columns: this.dataListColumns,
                data: dataArray,
                interactionMode: Controls.DataListInteractionMode.SingleSelect
            };

            this.dataList = this.context.controlFactory.create("", "DataList", dataListOptions, this.dataListElementId);
            this.dataList.addEventListener("SelectionChanged", (eventData: { items: NimKeyValue[] }) => {
                this.selectionChangedInterReceipt(eventData.items);
            });
        }
    }

    public open(items: NimKeyValue[]): Promise<NimKeyValue> {

        this.ReferenceNumberList(items);
        this.AllReferenceNumberList(items);

        let promise: Promise<NimKeyValue> = new Promise((resolve: MessageDialogResolve, reject: MessageDialogReject) => {
            this.resolve = resolve;
            let option: Dialogs.ITemplatedDialogOptions = {
                title: "CustomerOrder Selection",
                subTitle: "",
                onCloseX: this.onCloseX.bind(this),
                button1: {
                    id: "Button1",
                    label: "OK",
                    isPrimary: true,
                    onClick: this.button1ClickHandler.bind(this)
                },
                button2: {
                    id: "Button2",
                    label: "CANCEL",
                    isPrimary: false,
                    onClick: this.button2ClickHandler.bind(this)
                }
            };

            this.openDialog(option);
        });

        return promise;
    }

    private onCloseX(): boolean {
        this.resolvePromise(undefined);
        return false;
    }

    private button2ClickHandler(): boolean {
        this.resolvePromise(undefined);
        return false;
    }

    private button1ClickHandler(): boolean {
        if (this.SelectedReferenceNumber() != undefined) {
            this.resolvePromise({
                ...this.SelectedReferenceNumber()
            });
            return true;
        }
        else {
            return false;
        }
    }

    private resolvePromise(result: NimKeyValue): void {
        if (ObjectExtensions.isFunction(this.resolve)) {
            this.resolve(result);
            this.resolve = null;
        }
    }
}
