import { IBasicResponse, NimKeyValue } from "../Entities/Common";
import { RepairOrderEntities } from "../DataService/DataServiceRequests.g";
import { ClientEntities } from "PosApi/Entities";
import { RepairOrderHeader } from "../Entities/RepairOrderEntities";
import MessageHelpers from "./MessageHelpers";

export default class RepairOrderHelper {

    //Controller Implementation in typescript
    public static ExecuterepOrder = (context: any, requestStr: string, requestObjStr: string): Promise<IBasicResponse> => {
        let resp: IBasicResponse = { ErrorDetails: "", Message: "", Payload: undefined, Remarks: "", Status: 500 };
        let promise: Promise<IBasicResponse> = new Promise((resolve, reject) => {
            context.runtime.executeAsync(new RepairOrderEntities.ExecuteOperationOperationRequest(requestStr, requestObjStr))
                .then((value: ClientEntities.ICancelableDataResult<RepairOrderEntities.ExecuteOperationOperationResponse>) => {
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

    public static SaveRepairOrderAsync = async (context: any, repOrder: RepairOrderHeader): Promise<number> => {
        let request: string = await JSON.stringify({
            Opreration: "SAVEREPORDER"//,more property as per requirement
        });
        const resp = await RepairOrderHelper.ExecuterepOrder(context, request, JSON.stringify(repOrder));
        if (resp.Status == 200) {
            return Promise.resolve(<number>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(-1);
        }
    }
t
    public static GetRepairOrderAsync = async (context: any, RepairOrderNumber: string): Promise<RepairOrderHeader> => {
        let request: string = await JSON.stringify({
            Opreration: "GETREPORDERDETAIL"//,more property as per requirement
        });
        const resp = await RepairOrderHelper.ExecuterepOrder(context, request, RepairOrderNumber);
        if (resp.Status == 200) {
            return Promise.resolve(<RepairOrderHeader>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(undefined);
        }
    }

    public static GetRepairOdrNumbers = async (context: any): Promise<NimKeyValue[]> => {
        let request: string = await JSON.stringify({
            Opreration: "GETREPODRNUMBERS"//,more property as per requirement
        });
        const resp = await RepairOrderHelper.ExecuterepOrder(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<NimKeyValue[]>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve([]);
        }
    }

    public static GetCurrentRepairOrderNumbers = async (context: any): Promise<string> => {
        let request: string = await JSON.stringify({
            Opreration: "GENERATEREPORDNUMBER"//,more property as per requirement
        });
        const resp = await RepairOrderHelper.ExecuterepOrder(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<string>resp.Payload);
        }
        else {
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve("");
        }
    }

}