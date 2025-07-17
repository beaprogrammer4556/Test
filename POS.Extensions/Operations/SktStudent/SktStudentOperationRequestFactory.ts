import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import SktStudentOperationRequest from "./SktStudentOperationRequest";
import SktStudentOperationResponse from "./SktStudentOperationResponse";
import { ClientEntities } from "PosApi/Entities";


let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<SktStudentOperationResponse> =
    function (
        context: IOperationContext,
        operationId: number,
        actionParameters: string[],
        correlationId: string
    ): Promise<ClientEntities.ICancelableDataResult<SktStudentOperationRequest<SktStudentOperationResponse>>> {

        let operationRequest: SktStudentOperationRequest<SktStudentOperationResponse> =
            new SktStudentOperationRequest<SktStudentOperationResponse>(correlationId);

        return Promise.resolve(<ClientEntities.ICancelableDataResult<SktStudentOperationRequest<SktStudentOperationResponse>>>{

            canceled: false,
            data: operationRequest

        });

    };
export default getOperationRequest;

