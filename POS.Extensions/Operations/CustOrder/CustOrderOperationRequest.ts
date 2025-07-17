import { ExtensionOperationRequestBase } from "PosApi/Create/Operations";
import CustOrderOperationResponse from "./CustOrderOperationResponse";



export default class CustOrderOperationRequest<TResponse extends CustOrderOperationResponse> extends ExtensionOperationRequestBase<TResponse>{
    constructor(correlationId: string) {
        super(4055, correlationId);
    }
}


