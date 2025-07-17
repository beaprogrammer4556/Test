export interface RepairOrderHeader {
    TRANSDATE: string;
    REPAIRORDERNUMBER: string;
    DELIVERYDATE: string;
    CUSTACCOUNT: string;
    CUSTMOBILE: string;
    CUSTNAME: string;
    TOTALCHARGES: number;
    GROSSTOTAL: number;
    TAXTOTAL: number;
    //TOGGLESTATUS: number;  
    LstLines: RepairOrderDetail[];
}

export interface RepairOrderDetail {
    REPAIRORDERNUMBER: string;
    LINENUM: number;
    ITEMID: string;
    ITEMDESCRIPTION: string;
    QUANTITY: number;
    REPAIRCHARGE: number;
    NETTOTAL: number;
    TAXPERCENT: number;
    TAXAMOUNT: number;
    TOTALAMOUNT: number;
}

export interface IDropDown {
    value: string;
}

export interface IDropDownV2 extends IDropDown {
    text: string;
}