export interface IEvents {
    EventType: string;
    EventDate: string;
    Name: string;
    Mobile: string;
    SalesMan: string;
    ParentName: string;
    EventVenue: string;
}

export enum EventTypeEnum {
    "--SELECT--" = 0,
    "Marriage" = 1,
    "Anniversary" = 2,
    "Birthday" = 3,
    "Others" = 4
}

export interface Performaces {
    initiatorType?: any;
    name: string;
}