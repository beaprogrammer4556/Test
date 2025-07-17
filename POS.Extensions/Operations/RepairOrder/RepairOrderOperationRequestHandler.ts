import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import RepairOrderOperationRequest from "./RepairOrderOperationRequest";
import RepairOrderOperationResponse from "./RepairOrderOperationResponse";
import { ClientEntities } from "PosApi/Entities";
import { IRepairOrderViewModelOptions } from "../../Views/RepairOrder/NavigationContract";

export default class RepairOrderOperationResponseHandler<ROresponse extends RepairOrderOperationResponse> extends ExtensionOperationRequestHandlerBase<ROresponse>{

    public supportedRequestType(): ExtensionOperationRequestType<ROresponse> {
        return RepairOrderOperationRequest;
    }

    public executeAsync(request: RepairOrderOperationRequest<ROresponse>): Promise<ClientEntities.ICancelableDataResult<ROresponse>> {
        this.context.logger.logInformational("Log message from ReportOperationRequestHandler executeAsync().");
        

        let response: ClientEntities.ICancelableDataResult<RepairOrderOperationResponse> = {
            canceled: false,
            data: new RepairOrderOperationResponse()
        };

        return new Promise((resolve: (value?: ClientEntities.ICancelableDataResult<ROresponse>) => void) => {
            setTimeout(resolve, 2000);
        }).then((): ClientEntities.ICancelableDataResult<ROresponse> => {

            let options: IRepairOrderViewModelOptions = {
                navigationParameters: undefined
            }
            this.context.navigator.navigate("RepairOrderView", options);

            return response as ClientEntities.ICancelableDataResult<ROresponse>;
        });
    }

}