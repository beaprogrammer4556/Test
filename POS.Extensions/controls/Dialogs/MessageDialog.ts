
import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse, IMessageDialogOptions } from "PosApi/Consume/Dialogs";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ClientEntities } from "PosApi/Entities";

export default class MessageDialog {

    public static show(context: IExtensionContext, title: string, message: string): Promise<void> {
        let messageDialogOptions: IMessageDialogOptions = {
            title: title,
            message: message,
            showCloseX: true,
            button1: {
                id: "Button1Close",
                label: "OK", // OK
                result: "OKResult"
            }
        };

        let dialogRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
            new ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>(messageDialogOptions);

        return context.runtime.executeAsync(dialogRequest).then((value: ClientEntities.ICancelableDataResult<ShowMessageDialogClientResponse>) => {
            return Promise.resolve();
        });
    }
}