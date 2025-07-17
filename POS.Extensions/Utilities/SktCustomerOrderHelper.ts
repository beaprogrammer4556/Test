import { IBasicResponse, NimKeyValue } from "../Entities/Common";
import { SktCustOrderEntities } from "../DataService/DataServiceRequests.g";
import { ClientEntities } from "PosApi/Entities";
import { SktCustOrderHeader } from "../Entities/SktCustOrderEntities";
import MessageHelpers from "./MessageHelpers";

export default class SktCustOrderHelper {

    //Controller Implementation in typescript
    public static ExecutecustOrder = (context: any, requestStr: string, requestObjStr: string): Promise<IBasicResponse> => {
        let resp: IBasicResponse = { ErrorDetails: "", Message: "", Payload: undefined, Remarks: "", Status: 500 };
        let promise: Promise<IBasicResponse> = new Promise((resolve, reject) => {
            context.runtime.executeAsync(new SktCustOrderEntities.ExecuteOperationOperationRequest(requestStr, requestObjStr))
                .then((value: ClientEntities.ICancelableDataResult<SktCustOrderEntities.ExecuteOperationOperationResponse>) => {
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

    public static SaveCustOrderAsync = async (context: any, custOrder: SktCustOrderHeader): Promise<number> => {
        let request: string = await JSON.stringify({
            Opreration: "SAVECUSTORDER"//,more property as per requirement
        });
        const resp = await SktCustOrderHelper.ExecutecustOrder(context, request, JSON.stringify(custOrder));
        if (resp.Status == 200) {
            return Promise.resolve(<number>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(-1);
        }
    }

    public static GetCustOrderAsync = async (context: any, CustOrderNumber: string): Promise<SktCustOrderHeader> => {
        let request: string = await JSON.stringify({
            Opreration: "GETCUSTORDERDETAIL"//,more property as per requirement
        });
        const resp = await SktCustOrderHelper.ExecutecustOrder(context, request, CustOrderNumber);
        if (resp.Status == 200) {
            return Promise.resolve(<SktCustOrderHeader>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(undefined);
        }
    }

    public static GetCustOdrNumbers = async (context: any): Promise<NimKeyValue[]> => {
        let request: string = await JSON.stringify({
            Opreration: "GETCUSTODRNUMBERS"//,more property as per requirement
        });
        const resp = await SktCustOrderHelper.ExecutecustOrder(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<NimKeyValue[]>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve([]);
        }
    }

    public static GetCurrentCustOrderNumbers = async (context: any): Promise<string> => {
        let request: string = await JSON.stringify({
            Opreration: "GENERATECUSTORDNUMBER"//,more property as per requirement
        });
        const resp = await SktCustOrderHelper.ExecutecustOrder(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<string>resp.Payload);
        }
        else {
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve("");
        }
    }

}