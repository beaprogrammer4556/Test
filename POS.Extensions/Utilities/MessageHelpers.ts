import MessageDialog from "../Controls/Dialogs/MessageDialog";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";

/**
 * Message method helpers.
 */
export default class MessageHelpers {
    /**
     * Shows the message dialog.
     * @param {IExtensionContext} context The runtime context within the message is shown
     * @param {string} title The title to display
     * @param {string} message The message to display
     * @returns Promise<void> The promise (always success) after the message has been shown
     */
    public static ShowMessage(context: IExtensionContext, title: string, message: string): Promise<void> {
        return MessageDialog.show(context, title, message);
    }

    /**
     * Shows the error message dialog.
     * @param {IExtensionContext} context The runtime context within the message is shown
     * @param {string} message The message to display
     * @param {string} error The error object
     * @returns Promise<void> The promise after the message has been shown as success
     */
    public static ShowErrorMessage(context: IExtensionContext, message: string, error: any): Promise<void> {
        //  let title: string = context.resources.getString("string_70"); // Error:\n

        let title: string = "Error"; //context.resources.getString(message);
        return MessageDialog.show(context, title, message).then(() => {
            return Promise.reject(error);
        }).catch(() => {
            return Promise.reject(error);
        });
    }

    //Start V2

    public static ShowSuccessMessage(context: IExtensionContext, message: string): Promise<void> {
        let title: string = "Success!";
        return MessageDialog.show(context, title, message);
    }

    public static ShowWarningMessage(context: IExtensionContext, message: string): Promise<void> {
        let title: string = "Warning!";
        return MessageDialog.show(context, title, message);
    }

    //End V2
}
