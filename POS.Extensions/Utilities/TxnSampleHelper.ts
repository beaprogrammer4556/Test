import { IBasicResponse, NimKeyValue } from "../Entities/Common";
import { SampleEntities } from "../DataService/DataServiceRequests.g";
import { ClientEntities } from "PosApi/Entities";
import { TxnHeader } from "../Entities/TxnSample";
import MessageHelpers from "./MessageHelpers";

export default class TxnSampleHelper {

    //Controller Implementation in typescript
    public static ExecuteTxnSample = (context: any, requestStr: string, requestObjStr: string): Promise<IBasicResponse> => {
        let resp: IBasicResponse = { ErrorDetails: "", Message: "", Payload: undefined, Remarks: "", Status: 500 };
        let promise: Promise<IBasicResponse> = new Promise((resolve, reject) => {
            context.runtime.executeAsync(new SampleEntities.ExecuteOperationOperationRequest(requestStr, requestObjStr))
                .then((value: ClientEntities.ICancelableDataResult<SampleEntities.ExecuteOperationOperationResponse>) => {
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


    public static GetCurrentTransactionNumber = async (context: any): Promise<string> => {
        let request: string = await JSON.stringify({
            Opreration: "GENERATETXNID"//,more property as per requirement
        });
        const resp = await TxnSampleHelper.ExecuteTxnSample(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<string>resp.Payload);
        }
        else {
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve("");
        }
    }

    public static SaveTxnSample = async (context: any, txnSample: TxnHeader): Promise<number> => {
        let request: string = await JSON.stringify({
            Opreration: "SAVETXN"//,more property as per requirement
        });
        const resp = await TxnSampleHelper.ExecuteTxnSample(context, request, JSON.stringify(txnSample));
        if (resp.Status == 200) {
            return Promise.resolve(<number>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(-1);
        }
    }

    public static GetTxnSample = async (context: any, TransactionId: string): Promise<TxnHeader> => {
        let request: string = await JSON.stringify({
            Opreration: "GETTXNDETAIL"//,more property as per requirement
        });
        const resp = await TxnSampleHelper.ExecuteTxnSample(context, request, TransactionId);
        if (resp.Status == 200) {
            return Promise.resolve(<TxnHeader>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(undefined);
        }
    }

    public static GetTxnNumbers = async (context: any): Promise<NimKeyValue[]> => {
        let request: string = await JSON.stringify({
            Opreration: "GETTXNNUMBERS"//,more property as per requirement
        });
        const resp = await TxnSampleHelper.ExecuteTxnSample(context, request, "");
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