import { ObjectExtensions } from "PosApi/TypeExtensions";

export default class EnumHelpers {

    static getNameOfValue(e: any, v: number | string) {
        if (typeof v === 'string') {
            return ObjectExtensions.isNullOrUndefined(e) || e.length == 0 ? "" : e.filter(f => f.value === v)[0].text;
        }
        return EnumHelpers.getNamesAndValues(e).filter(f => f.value === v)[0].name;
    }

    static getNamesAndValues<T extends number>(e: any) {
        return EnumHelpers.getNames(e).map(n => ({ name: n, value: e[n] as T }));
    }

    static getNames(e: any) {
        return EnumHelpers.getObjValues(e).filter(v => typeof v === 'string') as string[];
    }

    static getValues<T extends number>(e: any) {
        return EnumHelpers.getObjValues(e).filter(v => typeof v === 'number') as T[];
    }

    private static getObjValues(e: any): (number | string)[] {
        return Object.keys(e).map(k => e[k]);
    }
}