import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import SktCustOrderOperationRequest from "./SktCustOrderOperationRequest";
import SktCustOrderOperationResponse from "./SktCustOrderOperationResponse";
import { ClientEntities } from "PosApi/Entities";


let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<SktCustOrderOperationResponse> =
    function (
        context: IOperationContext,
        operationId: number,
        actionParameters: string[],
        correlationId: string
    ): Promise<ClientEntities.ICancelableDataResult<SktCustOrderOperationRequest<SktCustOrderOperationResponse>>> {

        let operationRequest: SktCustOrderOperationRequest<SktCustOrderOperationResponse> =
            new SktCustOrderOperationRequest<SktCustOrderOperationResponse>(correlationId);

        return Promise.resolve(<ClientEntities.ICancelableDataResult<SktCustOrderOperationRequest<SktCustOrderOperationResponse>>>{

            canceled: false,
            data: operationRequest

        });

    };
export default getOperationRequest;

