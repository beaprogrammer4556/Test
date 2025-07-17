import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import RepairOrderOperationRequest from "./RepairOrderOperationRequest";
import RepairOrderOperationResponse from "./RepairOrderOperationResponse";
import { ClientEntities } from "PosApi/Entities";


let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<RepairOrderOperationResponse> =
    function (
        context: IOperationContext,
        operationId: number,
        actionParameters: string[],
        correlationId: string
    ): Promise<ClientEntities.ICancelableDataResult<RepairOrderOperationRequest<RepairOrderOperationResponse>>> {

        let operationRequest: RepairOrderOperationRequest<RepairOrderOperationResponse> =
            new RepairOrderOperationRequest<RepairOrderOperationResponse>(correlationId);

        return Promise.resolve(<ClientEntities.ICancelableDataResult<RepairOrderOperationRequest<RepairOrderOperationResponse>>>{

            canceled: false,
            data: operationRequest

        });

    };
export default getOperationRequest;

