import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import { ClientEntities } from "PosApi/Entities";
import CustOrderOperationRequest from "./CustOrderOperationRequest";
import CustOrderOperationResponse from "./CustOrderOperationResponse";



let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<CustOrderOperationResponse> =
    function (
        context: IOperationContext,
        operationId: number,
        actionParameters: string[],
        correlationId: string
    ): Promise<ClientEntities.ICancelableDataResult<CustOrderOperationRequest<CustOrderOperationResponse>>> {

        let operationRequest: CustOrderOperationRequest<CustOrderOperationResponse> =
            new CustOrderOperationRequest<CustOrderOperationResponse>(correlationId);

        return Promise.resolve(<ClientEntities.ICancelableDataResult<CustOrderOperationRequest<CustOrderOperationResponse>>>{

            canceled: false,
            data: operationRequest

        });

    };
export default getOperationRequest;






