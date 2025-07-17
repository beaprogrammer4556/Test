export interface SKtEstimationHeader {
    VOUCHERNO: string;
    SKUNO: string;
    LstLines: SKtEstimationDetail[];
}

export interface SKtEstimationDetail {
    VOUCHERNO: string;
    SKUNO: string;
    LINENUM: number;
    GROSSWT: number;
    NETWT: number;
}

export interface SKtIngredientDetail {
    ITEMDETAIL: string;
    GROSSWEIGHT: number;
    NETWEIGHT: number;
}
