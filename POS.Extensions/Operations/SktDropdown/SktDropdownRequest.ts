import { ExtensionOperationRequestBase } from "PosApi/Create/Operations";
import SktCustOrderOperationResponse from "./SktCustOrderOperationResponse";

export default class SktDropdownRequest<SCresponse extends SktCustOrderOperationResponse> extends ExtensionOperationRequestBase<SCresponse>{
    constructor(correlationId: string) {
        super(4063, correlationId);
    }
}