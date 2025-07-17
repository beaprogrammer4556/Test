
export interface CustOrderHeader {
    ORDERNUMBER: string;
    TRANSDATE: string;
    DELIVERYDATE: string;
    CUSTACCOUNT: string;
    CUSTMOBILE: string;
    CUSTNAME: string;
    GROSSTOTAL: number;
    TAXTOTAL: number;
    NETTOTAL: number;
    LstLines: CustOrderDetail[];
}

export interface CustOrderDetail {
    ORDERNUMBER: string;
    LINENUM: number;
    ITEMID: string;
    ITEMDESCRIPTION: string;
    QUANTITY: number;
    MRP: number;
    DISCPERCENT: number;
    DISCAMOUNT: number;
    NETAMOUNT: number;
    TAXPERCENT: number;
    TAXAMOUNT: number;
    TOTALAMOUNT: number;
}



