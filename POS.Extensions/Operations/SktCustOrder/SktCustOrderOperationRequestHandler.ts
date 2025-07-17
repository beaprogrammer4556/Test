import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import SktCustOrderOperationRequest from "./SktCustOrderOperationRequest";
import SktCustOrderOperationResponse from "./SktCustOrderOperationResponse";
import { ClientEntities } from "PosApi/Entities";
import { ISktCustOrderViewModelOptions } from "../../Views/SktCustOrder/NavigationContract";

export default class SktCustOrderOperationResponseHandler<SCresponse extends SktCustOrderOperationResponse> extends ExtensionOperationRequestHandlerBase<SCresponse>{

    public supportedRequestType(): ExtensionOperationRequestType<SCresponse> {
        return SktCustOrderOperationRequest;
    }

    public executeAsync(request: SktCustOrderOperationRequest<SCresponse>): Promise<ClientEntities.ICancelableDataResult<SCresponse>> {
        this.context.logger.logInformational("Log message from ReportOperationRequestHandler executeAsync().");


        let response: ClientEntities.ICancelableDataResult<SktCustOrderOperationResponse> = {
            canceled: false,
            data: new SktCustOrderOperationResponse()
        };

        return new Promise((resolve: (value?: ClientEntities.ICancelableDataResult<SCresponse>) => void) => {
            setTimeout(resolve, 2000);
        }).then((): ClientEntities.ICancelableDataResult<SCresponse> => {

            let options: ISktCustOrderViewModelOptions = {
                navigationParameters: undefined
            }
            this.context.navigator.navigate("SktCustOrderView", options);

            return response as ClientEntities.ICancelableDataResult<SCresponse>;
        });
    }

}
