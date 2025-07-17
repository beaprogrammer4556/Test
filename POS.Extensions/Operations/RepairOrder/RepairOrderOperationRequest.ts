import { ExtensionOperationRequestBase } from "PosApi/Create/Operations";
import RepairOrderOperationResponse from "./RepairOrderOperationResponse";

export default class RetailOrderOperationRequest<ROresponse extends RepairOrderOperationResponse> extends ExtensionOperationRequestBase<ROresponse>{
    constructor(correlationId: string) {
        super(4053, correlationId);
    }
}