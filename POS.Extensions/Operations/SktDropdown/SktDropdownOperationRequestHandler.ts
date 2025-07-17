import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import SktDropdownRequest from "./SktDropdownRequest";
import SktDropdownOperationResponse from "./SktDropdownOperationResponse";
import { ClientEntities } from "PosApi/Entities";
import { IDropdownViewModelOptions } from "../../Views/SktDropdown/NavigationContract";

export default class SktDropdownOperationResponseHandler<SCresponse extends SktDropdownOperationResponse> extends ExtensionOperationRequestHandlerBase<SCresponse>{

    public supportedRequestType(): ExtensionOperationRequestType<SCresponse> {
        return SktDropdownRequest;
    }

    public executeAsync(request: SktDropdownRequest<SCresponse>): Promise<ClientEntities.ICancelableDataResult<SCresponse>> {
        this.context.logger.logInformational("Log message from ReportOperationRequestHandler executeAsync().");


        let response: ClientEntities.ICancelableDataResult<SktDropdownOperationResponse> = {
            canceled: false,
            data: new SktDropdownOperationResponse()
        };

        return new Promise((resolve: (value?: ClientEntities.ICancelableDataResult<SCresponse>) => void) => {
            setTimeout(resolve, 2000);
        }).then((): ClientEntities.ICancelableDataResult<SCresponse> => {

            let options: IDropdownViewModelOptions = {
                navigationParameters: undefined
            }
            this.context.navigator.navigate("SktDropdownView", options);

            return response as ClientEntities.ICancelableDataResult<SCresponse>;
        });
    }

}
