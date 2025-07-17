import ko from "knockout";
import {
    DualDisplayCustomControlBase,
    IDualDisplayCustomControlState,
    IDualDisplayCustomControlContext,
    CartChangedData,
    CustomerChangedData,
    LogOnStatusChangedData
} from "PosApi/Extend/DualDisplay";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import { ProxyEntities } from "PosApi/Entities";
export default class DualDisplayCustomControl extends DualDisplayCustomControlBase {
    private static readonly TEMPLATE_ID: string = "Microsoft_Pos_Extensibility_Samples_DualDisplay";

    // Computed values for binding against.

    public readonly cartTotalAmount: ko.Computed<number>;
    public readonly customerName: ko.Computed<string>;
    public readonly customerAccountNumber: ko.Computed<string>;
    public readonly isLoggedOn: ko.Computed<boolean>;
    public readonly employeeName: ko.Computed<string>;

    // Labels for binding against.

    public readonly cartTotalAmountLabel: string;
    public readonly customerNameLabel: string;
    public readonly customerAccountNumberLabel: string;
    public readonly employeeNameLabel: string;

    // Observable values used for keeping track of state.

    private readonly _cart: ko.Observable<ProxyEntities.Cart>;
    private readonly _cartLinesObservable: ko.ObservableArray<ProxyEntities.CartLine>;
    private readonly _customer: ko.Observable<ProxyEntities.Customer>;
    private readonly _loggedOn: ko.Observable<boolean>;
    private readonly _employee: ko.Observable<ProxyEntities.Employee>;
    constructor(id: string, context: IDualDisplayCustomControlContext) {
        super(id, context);
        console.log("Duel Display Log - Constructor");
        // Initializes labels.

        this.cartTotalAmountLabel = this.context.resources.getString("string_5");
        this.customerNameLabel = this.context.resources.getString("string_6");
        this.customerAccountNumberLabel = this.context.resources.getString("string_7");
        this.employeeNameLabel = this.context.resources.getString("string_8");

        // Initializes observable and computed values.

        this._cart = ko.observable(null);
        this._cartLinesObservable = ko.observableArray([]);
        this._customer = ko.observable(null);
        this._loggedOn = ko.observable(false);
        this._employee = ko.observable(null);

        this.cartTotalAmount = ko.computed(() => {
            return ObjectExtensions.isNullOrUndefined(this._cart()) ? 0.00 : this._cart().TotalAmount;
        });

        this.customerName = ko.computed(() => {
            return ObjectExtensions.isNullOrUndefined(this._customer()) ? StringExtensions.EMPTY : this._customer().Name;
        });

        this.customerAccountNumber = ko.computed(() => {
            return ObjectExtensions.isNullOrUndefined(this._customer()) ? StringExtensions.EMPTY : this._customer().AccountNumber;
        });

        this.isLoggedOn = ko.computed(() => {
            return this._loggedOn();
        });
        this.employeeName = ko.computed(() => {
            return ObjectExtensions.isNullOrUndefined(this._employee()) ? StringExtensions.EMPTY : this._employee().Name;
        });

        this.cartChangedHandler = (data: CartChangedData) => {
            console.log("Duel Display Log - cartChangedHandler");
            this._cart(data.cart);
            this._cartLinesObservable(ObjectExtensions.isNullOrUndefined(data.cart) ? [] : data.cart.CartLines)
        };

        this.customerChangedHandler = (data: CustomerChangedData) => {
            console.log("Duel Display Log - customerChangedHandler");
            this._customer(data.customer);
        };

        this.logOnStatusChangedHandler = (data: LogOnStatusChangedData) => {
            console.log("Duel Display Log - logOnStatusChangedHandler");
            // Displays the busy indicator here, even though it's not necessary, in order to showcase and test the scenario.
            this.isProcessing = true;
            window.setTimeout(() => {
                this.isProcessing = false;
            }, 1000);
            this._loggedOn(data.loggedOn);
            this._employee(data.employee);
        }

        // Logs the completion of constructing the DualDisplayCustomControl.

        this.context.logger.logInformational("DualDisplayCustomControl constructed", this.context.logger.getNewCorrelationId());
    }

    /**
    * Binds the control to the specified element.
    * @param {HTMLElement} element The element to which the control should be bound.
    */

    public onReady(element: HTMLElement): void {
        console.log("Duel Display Log - ReadOnly");
        ko.applyBindingsToNode(element, {
            template: {
                name: DualDisplayCustomControl.TEMPLATE_ID,
                data: this
            }
        });
    }

    /**
    * Initializes the control.
    * @param {IDualDisplayCustomControlState} state The initial state of the page used to initialize the control.
    */

    public init(state: IDualDisplayCustomControlState): void {
        console.log("Duel Display Log - Init");
        this._cart(state.cart);
        this._customer(state.customer);
        this._loggedOn(state.loggedOn);
        this._employee(state.employee)
    }
}