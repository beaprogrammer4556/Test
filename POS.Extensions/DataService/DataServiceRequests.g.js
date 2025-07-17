System.register(["PosApi/Entities", "./DataServiceEntities.g", "PosApi/Consume/DataService"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var Entities_1, DataServiceEntities_g_1, DataService_1, CustOrderEntities, PDCEntities, RepairOrderEntities, SampleEntities;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Entities_1_1) {
                Entities_1 = Entities_1_1;
            },
            function (DataServiceEntities_g_1_1) {
                DataServiceEntities_g_1 = DataServiceEntities_g_1_1;
            },
            function (DataService_1_1) {
                DataService_1 = DataService_1_1;
            }
        ],
        execute: function () {
            exports_1("ProxyEntities", Entities_1.ProxyEntities);
            exports_1("Entities", DataServiceEntities_g_1.Entities);
            (function (CustOrderEntities) {
                var ExecuteCustOrderOperationResponse = (function (_super) {
                    __extends(ExecuteCustOrderOperationResponse, _super);
                    function ExecuteCustOrderOperationResponse() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ExecuteCustOrderOperationResponse;
                }(DataService_1.DataServiceResponse));
                CustOrderEntities.ExecuteCustOrderOperationResponse = ExecuteCustOrderOperationResponse;
                var ExecuteCustOrderOperationRequest = (function (_super) {
                    __extends(ExecuteCustOrderOperationRequest, _super);
                    function ExecuteCustOrderOperationRequest(RequestVal, ObjStrVal) {
                        var _this = _super.call(this) || this;
                        _this._entitySet = "CustOrderEntities";
                        _this._entityType = "CustOrderEntities";
                        _this._method = "ExecuteCustOrderOperation";
                        _this._parameters = { RequestVal: RequestVal, ObjStrVal: ObjStrVal };
                        _this._isAction = true;
                        _this._returnType = DataServiceEntities_g_1.Entities.GenericStringDataModel;
                        _this._isReturnTypeCollection = false;
                        return _this;
                    }
                    return ExecuteCustOrderOperationRequest;
                }(DataService_1.DataServiceRequest));
                CustOrderEntities.ExecuteCustOrderOperationRequest = ExecuteCustOrderOperationRequest;
            })(CustOrderEntities || (CustOrderEntities = {}));
            exports_1("CustOrderEntities", CustOrderEntities);
            (function (PDCEntities) {
                var ExecutePDCOperationResponse = (function (_super) {
                    __extends(ExecutePDCOperationResponse, _super);
                    function ExecutePDCOperationResponse() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ExecutePDCOperationResponse;
                }(DataService_1.DataServiceResponse));
                PDCEntities.ExecutePDCOperationResponse = ExecutePDCOperationResponse;
                var ExecutePDCOperationRequest = (function (_super) {
                    __extends(ExecutePDCOperationRequest, _super);
                    function ExecutePDCOperationRequest(RequestVal, ObjStrVal) {
                        var _this = _super.call(this) || this;
                        _this._entitySet = "PDCEntities";
                        _this._entityType = "PDCEntities";
                        _this._method = "ExecutePDCOperation";
                        _this._parameters = { RequestVal: RequestVal, ObjStrVal: ObjStrVal };
                        _this._isAction = true;
                        _this._returnType = DataServiceEntities_g_1.Entities.GenericStringDataModel;
                        _this._isReturnTypeCollection = false;
                        return _this;
                    }
                    return ExecutePDCOperationRequest;
                }(DataService_1.DataServiceRequest));
                PDCEntities.ExecutePDCOperationRequest = ExecutePDCOperationRequest;
            })(PDCEntities || (PDCEntities = {}));
            exports_1("PDCEntities", PDCEntities);
            (function (RepairOrderEntities) {
                var ExecuteOperationOperationResponse = (function (_super) {
                    __extends(ExecuteOperationOperationResponse, _super);
                    function ExecuteOperationOperationResponse() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ExecuteOperationOperationResponse;
                }(DataService_1.DataServiceResponse));
                RepairOrderEntities.ExecuteOperationOperationResponse = ExecuteOperationOperationResponse;
                var ExecuteOperationOperationRequest = (function (_super) {
                    __extends(ExecuteOperationOperationRequest, _super);
                    function ExecuteOperationOperationRequest(RequestVal, ObjStrVal) {
                        var _this = _super.call(this) || this;
                        _this._entitySet = "RepairOrderEntities";
                        _this._entityType = "RepairOrderEntities";
                        _this._method = "ExecuteOperationOperation";
                        _this._parameters = { RequestVal: RequestVal, ObjStrVal: ObjStrVal };
                        _this._isAction = true;
                        _this._returnType = DataServiceEntities_g_1.Entities.GenericStringDataModel;
                        _this._isReturnTypeCollection = false;
                        return _this;
                    }
                    return ExecuteOperationOperationRequest;
                }(DataService_1.DataServiceRequest));
                RepairOrderEntities.ExecuteOperationOperationRequest = ExecuteOperationOperationRequest;
            })(RepairOrderEntities || (RepairOrderEntities = {}));
            exports_1("RepairOrderEntities", RepairOrderEntities);
            (function (SampleEntities) {
                var ExecuteOperationOperationResponse = (function (_super) {
                    __extends(ExecuteOperationOperationResponse, _super);
                    function ExecuteOperationOperationResponse() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ExecuteOperationOperationResponse;
                }(DataService_1.DataServiceResponse));
                SampleEntities.ExecuteOperationOperationResponse = ExecuteOperationOperationResponse;
                var ExecuteOperationOperationRequest = (function (_super) {
                    __extends(ExecuteOperationOperationRequest, _super);
                    function ExecuteOperationOperationRequest(RequestVal, ObjStrVal) {
                        var _this = _super.call(this) || this;
                        _this._entitySet = "SampleEntities";
                        _this._entityType = "SampleEntities";
                        _this._method = "ExecuteOperationOperation";
                        _this._parameters = { RequestVal: RequestVal, ObjStrVal: ObjStrVal };
                        _this._isAction = true;
                        _this._returnType = DataServiceEntities_g_1.Entities.GenericStringDataModel;
                        _this._isReturnTypeCollection = false;
                        return _this;
                    }
                    return ExecuteOperationOperationRequest;
                }(DataService_1.DataServiceRequest));
                SampleEntities.ExecuteOperationOperationRequest = ExecuteOperationOperationRequest;
            })(SampleEntities || (SampleEntities = {}));
            exports_1("SampleEntities", SampleEntities);
        }
    };
});
//# sourceMappingURL=C:/PracticeSDK/RetailPractice/POS.Extensions/DataService/DataServiceRequests.g.js.map