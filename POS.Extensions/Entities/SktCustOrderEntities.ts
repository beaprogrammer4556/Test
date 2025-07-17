export interface SktCustOrderHeader {
    ORDERNUMBER: string;
    CUSTACCOUNT: string;
    CUSTNAME: string;
    ORDERDATE: string;
    DELIVERYDATE: string;
    OFFERSTATUS: number;
    FLOTINGSTATUS: number;
    INVENTLOCATION: string;
    SALESPERSON: string;
    REMARKS: string;
    TOTALMETALWT: number; 
    OFFODRADV: number;
    EXPDATE: string;
    ITEMID: string;
    PIECES: number;
    TAXPERCENT: number;
    TOTALAMOUNT: number;
    CVALUE: number;
    LstLines: SktCustOrderDetail[];
}

export interface SktCustOrderDetail {
    ORDERNUMBER: string;
    LINENUM: number;
    ITEMID: string;
    PIECES: number;
    CVALUE: number;
    GROSSTOTAL: number;
    NETTOTAL: number;
    TAXTOTAL: number;
   // TOTALDISCOUNT: number;
   /* LstLines2: SktCustOrderIngredient[];*/
}

//export interface SktCustOrderIngredient {
//    ORDERNUMBER: string;
//    LINENUM: number;
//    REFLINENUM: number;
//    ITEMID: string;
//    CONFIG: string;
//    COLOR: string;
//    SIZE: number;
//    PIECES: number;
//    NETWT: number;
//    RATE: number;
//    CVALUE: number;
//    MKTYPE: number;
//    MKRATE: number;
//    MKAMT: number;
//    WSTTYPE: string;
//    WSTRATE: string;
//    WSTAMT: number;
//    UNIT: string;
//}
export interface IDropDown {
    value: string;
}

export interface IDropDownV2 extends IDropDown {
    text: string;
}

export interface IDropDownV3 extends IDropDownV2 {
    value: string;
    text: string;
}

export interface IInventLocation extends IDropDownV2 {
    locationName: string; 
    locationCode: string; 
}