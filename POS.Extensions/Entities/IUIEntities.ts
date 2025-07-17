export interface IEnumSelectBox {
    name: string;
    value: number;
}

export interface INormalSelectBox {
    name: string;
    value: string;
}

export interface IWharehouseSelectBox extends INormalSelectBox {
    id: string;
    dtype: string;
}

export interface IImageDetails {
    RealBase64: string;
    CustomBase64: string;
    SizeInByte: number;
    SizeInKB: number;
    SizeInMB: number;
    Type: string;
    Extension: string;
    ByteArray?: any;
    Prefix: string;
    File: any;  // 18-01-2024
}

export enum LocationTypeEnum {
    WAREHOUSE = 1,
    VENDOR = 2
}

export interface IOrderRetailParameter {
    MinOrderAdvance: number;
    OrderRateFreeze: number;
    MinOfferOrder: number;
    StoreDeliveryDays: number;
}

export interface IProductSpecification {
    value: string;
}

export interface IProductSpecificationItem extends IProductSpecification{
    text: string;
}

export interface ICompanyAndLocation {
    Companies: IProductSpecificationItem[];
    Locations: IProductSpecificationItem[];
}

export interface IMakingWastageResponse {
    MakingRate  : string;
    MakingType  : string;
    MakingVal   : string;
    WastageRate : string;
    WastageType : string;
    WastageVal  : string;
}