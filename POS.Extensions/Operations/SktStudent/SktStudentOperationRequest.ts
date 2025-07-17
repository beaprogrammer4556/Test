import { ExtensionOperationRequestBase } from "PosApi/Create/Operations";
import SktStudentOperationResponse from "./SktStudentOperationResponse";

export default class SktStudentOperationRequest<STresponse extends SktStudentOperationResponse> extends ExtensionOperationRequestBase<STresponse>{
    constructor(correlationId: string) {
        super(4069, correlationId);
    }
}