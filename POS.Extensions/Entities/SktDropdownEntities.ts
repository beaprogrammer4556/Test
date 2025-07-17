export interface SktDropdownHeader {
    ITEMID: string;
    LstLines: SktDropdownDetail[];
}

export interface SktDropdownDetail {
    LINENUM: number;
    ITEMID: string;
    MRP: number;
}
export interface IDropDown {
    value: string;
}

export interface IDropDownV2 extends IDropDown {
    text: string;
    value: string;
}
