export interface TxnHeader {
    TRANSACTIONID: string;
    TRANSDATE: string;
    CUSTACCOUNT: string;
    CUSTMOBILE: string;
    CUSTNAME: string;
    GROSSTOTAL: number;
    TAXTOTAL: number;
    NETTOTAL: number;
    LstLines: TxnDetail[];
}

export interface TxnDetail {
    TRANSACTIONID: string;
    LINENUM: number;
    ITEMID: string;
    ITEMDESCRIPTION: string;
    MRP: number;
    DISCPERCENT: number;
    DISCAMOUNT: number;
    NETAMOUNT: number;
    TAXPERCENT: number;
    TAXAMOUNT: number;
    TOTALAMOUNT: number;
}