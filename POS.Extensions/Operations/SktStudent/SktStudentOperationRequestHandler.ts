import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import SktStudentOperationRequest from "./SktStudentOperationRequest";
import SktStudentOperationResponse from "./SktStudentOperationResponse";
import { ClientEntities } from "PosApi/Entities";
import { IRepairOrderViewModelOptions } from "../../Views/RepairOrder/NavigationContract";

export default class SktStudentOperationRequestHandler<STresponse extends SktStudentOperationResponse> extends ExtensionOperationRequestHandlerBase<STresponse>{

    public supportedRequestType(): ExtensionOperationRequestType<STresponse> {
        return SktStudentOperationRequest;
    }

    public executeAsync(request: SktStudentOperationRequest<STresponse>): Promise<ClientEntities.ICancelableDataResult<STresponse>> {
        this.context.logger.logInformational("Log message from ReportOperationRequestHandler executeAsync().");


        let response: ClientEntities.ICancelableDataResult<SktStudentOperationResponse> = {
            canceled: false,
            data: new SktStudentOperationResponse()
        };

        return new Promise((resolve: (value?: ClientEntities.ICancelableDataResult<STresponse>) => void) => {
            setTimeout(resolve, 2000);
        }).then((): ClientEntities.ICancelableDataResult<STresponse> => {

            let options: IRepairOrderViewModelOptions = {
                navigationParameters: undefined
            }
            this.context.navigator.navigate("SktStudentView", options);

            return response as ClientEntities.ICancelableDataResult<STresponse>;
        });
    }

}