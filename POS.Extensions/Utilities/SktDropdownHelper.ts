import { IBasicResponse, NimKeyValue } from "../Entities/Common";
import { SktDropdownEntities } from "../DataService/DataServiceRequests.g";
import { ClientEntities } from "PosApi/Entities";
import { SktDropdownHeader } from "../Entities/SktDropdownEntities";
import MessageHelpers from "./MessageHelpers";
import { SktDropdownDataService } from "./SktDropdownDataService";                                                                                                                                          

export default class SktDropdownHelper {

    // Controller Implementation in typescript
    public static ExecutedropdownOrder = (context: any, requestStr: string, requestObjStr: string): Promise<IBasicResponse> => {
        let resp: IBasicResponse = { ErrorDetails: "", Message: "", Payload: undefined, Remarks: "", Status: 500 };
        let promise: Promise<IBasicResponse> = new Promise((resolve, reject) => {
            context.runtime.executeAsync(new SktDropdownEntities.ExecuteOperationOperationRequest(requestStr, requestObjStr))
                .then((value: ClientEntities.ICancelableDataResult<SktDropdownEntities.ExecuteOperationOperationResponse>) => {
                    if ((!value.canceled) && (value.data.result)) {
                        resolve(<IBasicResponse>JSON.parse(value.data.result.DataResult));
                    }
                    else {
                        resolve(resp);
                    }
                }).
                catch((reason: any) => {
                    resp.Message = reason;
                    resolve(resp);
                });
        });
        return promise;
    }

    // Get Dropdown Details (item details for selected itemID)
    public static GetDropdownDetailAsync = async (context: any, ItemIDNumber: string): Promise<SktDropdownHeader> => {
        let request: string = await JSON.stringify({
            Opreration: "GETITEMDETAIL"
        });
        const resp = await SktDropdownHelper.ExecutedropdownOrder(context, request, ItemIDNumber);
        if (resp.Status == 200) {
            return Promise.resolve(<SktDropdownHeader>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(undefined);
        }
    }

    // Get ItemID numbers (to populate the dropdown options)
    public static GetItemIDNumbers = async (context: any): Promise<NimKeyValue[]> => {
        let request: string = await JSON.stringify({
            Opreration: "GETITEMIDUMBERS"
        });
        const resp = await SktDropdownHelper.ExecutedropdownOrder(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<NimKeyValue[]>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve([]);
        }
    }

    // Save Dropdown Data (Save selected item details)
    public static SaveDropdownAsync = async (context: any, dropdownOrder: SktDropdownHeader): Promise<number> => {
        let request: string = await JSON.stringify({
            Opreration: "SAVEDROPDOWNDETAIL"
        });
        const resp = await SktDropdownHelper.ExecutedropdownOrder(context, request, JSON.stringify(dropdownOrder));
        if (resp.Status == 200) {
            return Promise.resolve(<number>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(-1);
        }
    }

}