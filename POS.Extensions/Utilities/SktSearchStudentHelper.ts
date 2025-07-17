import { ClientEntities } from "PosApi/Entities";
import { SktSearchStudentEntities } from "../DataService/DataServiceRequests.g";
import { IBasicResponse } from "../Entities/Common";
import { studentsearcheader } from "../Entities/SktSearchStudentEntities";
import { IDropDownV2 } from "../Entities/TxnSample";
import MessageHelpers from "./MessageHelpers";

export default class SktSearchStudentHelper {

    //Controller Implementation in typescript
    //public static ExecuteSearchStudents = (context: any, requestStr: string, requestObjStr: string): Promise<IBasicResponse> => {
    //    let resp: IBasicResponse = { ErrorDetails: "", Message: "", Payload: undefined, Remarks: "", Status: 500 };
    //    let promise: Promise<IBasicResponse> = new Promise((resolve, reject) => {
    //        context.runtime.executeAsync(new SktSearchStudentEntities.ExecuteOperationOperationRequest(requestStr, requestObjStr))
    //            .then((value: ClientEntities.ICancelableDataResult<SktSearchStudentEntities.ExecuteOperationOperationResponse>) => {
    //                if ((!value.canceled) && (value.data.result)) {
    //                    resolve(<IBasicResponse>JSON.parse(value.data.result.DataResult));
    //                }
    //                else {
    //                    resolve(resp);
    //                }
    //            }).
    //            catch((reason: any) => {
    //                resp.Message = reason;
    //                resolve(resp);
    //            });
    //    });
    //    return promise;
    //}
    public static ExecuteSearchStudents = (context: any, requestStr: string, requestObjStr: string): Promise<IBasicResponse> => {
        let resp: IBasicResponse = { ErrorDetails: "", Message: "", Payload: undefined, Remarks: "", Status: 500 };
        let promise: Promise<IBasicResponse> = new Promise((resolve, reject) => {
            console.log("Request Data Sent:", requestStr, requestObjStr);

            context.runtime.executeAsync(new SktSearchStudentEntities.ExecuteOperationOperationRequest(requestStr, requestObjStr))
                .then((value: ClientEntities.ICancelableDataResult<SktSearchStudentEntities.ExecuteOperationOperationResponse>) => {
                    console.log("Response Data:", value);
                    if ((!value.canceled) && (value.data.result)) {
                        try {
                            const result = JSON.parse(value.data.result.DataResult);
                            resolve(<IBasicResponse>result);
                        } catch (error) {
                            console.error("Error parsing response data:", error);
                            resolve(resp);
                        }
                    } else {
                        resolve(resp);
                    }
                })
                .catch((reason: any) => {
                    console.error("Request failed:", reason);
                    resp.Message = reason;
                    resolve(resp);
                });
        });
        return promise;
    };


    public static GetStudentDetailSearch = async (context: any, STUDENTID: string): Promise<studentsearcheader[]> => {
        let request: string = await JSON.stringify({
            Opreration: "GETSTUDENTDETAIL"

        });
        const resp = await SktSearchStudentHelper.ExecuteSearchStudents(context, request, STUDENTID);
        if (resp.Status == 200) {
            return Promise.resolve(<studentsearcheader[]>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve(undefined);
        }
    }


    public static GetStdNumbers = async (context: any): Promise<IDropDownV2[]> => {
        let request: string = await JSON.stringify({
            Opreration: "GETSTUDENTID"
        });
        const resp = await SktSearchStudentHelper.ExecuteSearchStudents(context, request, "");
        if (resp.Status == 200) {
            return Promise.resolve(<IDropDownV2[]>resp.Payload);
        }
        else {
            console.log(resp);
            MessageHelpers.ShowWarningMessage(context, resp.Message);
            return Promise.resolve([]);
        }
    }


}




