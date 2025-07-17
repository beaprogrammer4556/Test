import { ClientEntities } from "PosApi/Entities";
import { IBasicResponse, NimKeyValue } from "../Entities/Common";
import { CustOrderHeader } from "../Entities/CustOrder";
import MessageHelpers from "./MessageHelpers";
import { CustOrderEntities } from "../DataService/DataServiceRequests.g";
export default class CustOrderHelper {

    //Controller Implementation in typescript
    public static ExecuteOrdSample = (context: any, requestStr: string, requestObjStr: string): Promise<IBasicResponse> => {
        let resp: IBasicResponse = { ErrorDetails: "", Message: "", Payload: undefined, Remarks: "", Status: 500 };
        let promise: Promise<IBasicResponse> = new Promise((resolve, reject) => {
            context.runtime.executeAsync(new CustOrderEntities.ExecuteCustOrderOperationRequest(requestStr, requestObjStr))
                .then((value: ClientEntities.ICancelableDataResult<CustOrderEntities.ExecuteCustOrderOperationResponse>) => {
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



    public static GetCurrentOrderNumber = async (context: any): Promise<string> => {
        let request: string = await JSON.stringify({
            Opreration: "GENERATEORDID"//,more property as per requirement
        });
        const resp = await CustOrderHelper.ExecuteOrdSample(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<string>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve("");
        }
    }

    public static SaveCustOrder = async (context: any, CustOrder: CustOrderHeader): Promise<number> => {
        let request: string = await JSON.stringify({
            Opreration: "SAVEORD"//,more property as per requirement
        });
        const resp = await CustOrderHelper.ExecuteOrdSample(context, request, JSON.stringify(CustOrder));
        if (resp.Status == 200) {
            return Promise.resolve(<number>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(-1);
        }
    }

    public static GetOrdSample = async (context: any, ORDERNUMBER: string): Promise<CustOrderHeader> => {
        let request: string = await JSON.stringify({
            Opreration: "GETORDDETAIL"//,more property as per requirement
        });
        const resp = await CustOrderHelper.ExecuteOrdSample(context, request, ORDERNUMBER);
        if (resp.Status == 200) {
            return Promise.resolve(<CustOrderHeader>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(undefined);
        }
    }

    public static GetOrdNumbers = async (context: any): Promise<NimKeyValue[]> => {
        let request: string = await JSON.stringify({
            Opreration: "GETORDNUMBERS"//,more property as per requirement
        });
        const resp = await CustOrderHelper.ExecuteOrdSample(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<NimKeyValue[]>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve([]);
        }
    }



}




