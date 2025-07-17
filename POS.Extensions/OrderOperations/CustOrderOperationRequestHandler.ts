import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import { ClientEntities } from "PosApi/Entities";
import CustOrderOperationResponse from "./CustOrderOperationResponse";
import CustOrderOperationRequest from "./CustOrderOperationRequest";

export default class CustOrderOperationRequestHandler<TResponse extends CustOrderOperationResponse> extends ExtensionOperationRequestHandlerBase<TResponse>{

    public supportedRequestType(): ExtensionOperationRequestType<TResponse> {
        return CustOrderOperationRequest;
    }

    public executeAsync(request: CustOrderOperationRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>> {
        this.context.logger.logInformational("Log message from ReportOperationRequestHandler executeAsync().");


        let response: ClientEntities.ICancelableDataResult<CustOrderOperationResponse> = {
            canceled: false,
            data: new CustOrderOperationResponse()
        };

        return new Promise((resolve: (value?: ClientEntities.ICancelableDataResult<TResponse>) => void) => {
            setTimeout(resolve, 2000);
        }).then((): ClientEntities.ICancelableDataResult<TResponse> => {


            return response as ClientEntities.ICancelableDataResult<TResponse>;
        });
    }

}








