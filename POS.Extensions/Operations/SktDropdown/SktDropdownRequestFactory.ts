import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import SktDropdownRequest from "./SktDropdownRequest";
import SktDropdownOperationResponse from "./SktDropdownOperationResponse";
import { ClientEntities } from "PosApi/Entities";


let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<SktDropdownOperationResponse> =
    function (
        context: IOperationContext,
        operationId: number,
        actionParameters: string[],
        correlationId: string
    ): Promise<ClientEntities.ICancelableDataResult<SktDropdownRequest<SktDropdownOperationResponse>>> {

        let operationRequest: SktDropdownRequest<SktDropdownOperationResponse> =
            new SktDropdownRequest<SktDropdownOperationResponse>(correlationId);

        return Promise.resolve(<ClientEntities.ICancelableDataResult<SktDropdownRequest<SktDropdownOperationResponse>>>{

            canceled: false,
            data: operationRequest

        });

    };
export default getOperationRequest;

