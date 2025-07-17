export interface IBasicResponse {
    Status: number;
    Message: string;
    Remarks: string;
    ErrorDetails: string;
    Payload: any;
}
export interface NimKeyValue {
    Key: any,
    Value: any
}