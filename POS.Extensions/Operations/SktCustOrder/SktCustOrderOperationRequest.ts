import { ExtensionOperationRequestBase } from "PosApi/Create/Operations";
import SktCustOrderOperationResponse from "./SktCustOrderOperationResponse";

export default class SktCustOrderOperationRequest<SCresponse extends SktCustOrderOperationResponse> extends ExtensionOperationRequestBase<SCresponse>{
    constructor(correlationId: string) {
        super(4059, correlationId);
    }
}