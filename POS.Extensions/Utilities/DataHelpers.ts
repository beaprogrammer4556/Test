import * as PosExtension from "PosApi/TypeExtensions";
export namespace DataHelpers {

    
    export class EnumHelpers {

        //Key Value Pair as Object Array of property {name, value}
        static getNamesAndValues<T extends number>(e: any) {
            return this.getNames(e).map(n => ({ name: n, value: e[n] as T }));
        }

        //Array of string as names
        static getNames(e: any) {
            return this.getObjValues(e).filter(v => typeof v === 'string') as string[];
        }

        //Array of number as values
        static getValues<T extends number>(e: any) {
            return this.getObjValues(e).filter(v => typeof v === 'number') as T[];
        }

        private static getObjValues(e: any): (number | string)[] {
            return Object.keys(e).map(k => e[k]);
        }
    }

    export class NumberHelpers {

    }

    export class StringHelpers extends PosExtension.StringExtensions {

        /**
        * @returns cancate string only with comma and space (', ') seperator
        */
        static ConcateByCommaWithSpace = (firstval: string, ...restVal: Array<string>): string => {
            if (restVal.length == 0) {
                return firstval;
            }
            else {
                return firstval + ', ' + restVal.join(', ');
            }
        }

        /**
        * @returns cancate string only with comma(',') seperator
        */
        static ConcateByCommaWithoutSpace = (firstval: string, ...restVal: Array<string>): string => {
            if (restVal.length == 0) {
                return firstval;
            }
            else {
                return firstval + ',' + restVal.join(',');
            }
        }

        /**
        * @returns cancate string only with (' ') space seperator
        */
        static ConcateByWithSpace = (firstval: string, ...restVal: Array<string>): string => {
            if (restVal.length == 0) {
                return firstval;
            }
            else {
                return firstval + ' ' + restVal.join(' ');
            }
        }

        /**
        * @returns cancate string without any space and comma ('')
        */
        static ConcateByWithotSpace = (firstval: string, ...restVal: Array<string>): string => {
            if (restVal.length == 0) {
                return firstval;
            }
            else {
                return firstval + '' + restVal.join('');
            }
        }
    }

    export class DateHelpers extends PosExtension.DateExtensions {

        static GetDaysDifference = (date1, date2): number => {
            let dt1 = new Date(date1);
            let dt2 = new Date(date2);
            return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
        }

        static CheckFromGreaterThanTo = (tDate: Date, fDate: Date): boolean => {

            var diff = DateHelpers.GetDaysDifference(DataHelpers.DateHelpers.To_MMddyyyy(fDate, "/"), DataHelpers.DateHelpers.To_MMddyyyy(tDate, "/"));
            return (diff > 0) ? true : false;
        }

        static CheckFromGreaterThanToOrEqual = (tDate: Date, fDate: Date): boolean => {
            var diff = DateHelpers.GetDaysDifference(DataHelpers.DateHelpers.To_MMddyyyy(fDate, "/"), DataHelpers.DateHelpers.To_MMddyyyy(tDate, "/"));
            return (diff >= 0) ? true : false;
        }

        /**
        * @returns date as string in the format of dd-MM-yyyy
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_ddMMyyyy = (date: Date, seperator: string): string => {
            if (date === undefined || date == null) {
                return '';
            }
            else {
                return ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString())
                    + seperator
                    + (((date.getMonth() + 1).toString().length > 1) ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString())
                    + seperator
                    + date.getFullYear().toString();
            }
        }

        /**
        * @returns date as string in the format of yyyy-MM-mm
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_yyyyMMdd = (date: Date, seperator: string): string => {

            if (date === undefined || date == null) {
                return '';
            }
            else {
                return date.getFullYear().toString()
                    + seperator
                    + (((date.getMonth() + 1).toString().length > 1) ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString())
                    + seperator
                    + ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString());
            }
        }

        /**
        * @returns date as string in the format of yyyy-MM-mm
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_MMddyyyy = (date: Date, seperator: string): string => {

            if (date === undefined || date == null) {
                return '';
            }
            else {
                return (((date.getMonth() + 1).toString().length > 1) ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString())
                    + seperator
                    + ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString())
                    + seperator
                    + date.getFullYear().toString();
            }
        }

        /**
        * @returns date as string in the format of dd-MMM-yyyy
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_ddMMMyyyy = (date: Date, seperator: string): string => {
            console.log(date);
            console.log(date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString());
            if (date === undefined || date == null) {
                return '';
            }
            else {
                return ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString())
                    + seperator
                    + DateHelpers.getMMM(date.getMonth() + 1)
                    + seperator
                    + date.getFullYear().toString();
            }
        }



        /**
        * @returns date as string in the format of yyyy-MMM-dd
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_yyyyMMMdd = (date: Date, seperator: string): string => {
            if (date === undefined || date == null) {
                return '';
            }
            else {
                return date.getFullYear().toString()
                    + seperator
                    + DateHelpers.getMMM(date.getMonth() + 1)
                    + seperator
                    + ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString());
            }
        }

        /**
        * @returns date as string in the format of dd-MM-yyyy hh:mm:ss
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_ddMMyyyy_hhmmss = (date: Date, seperator: string): string => {
            if (date === undefined || date == null) {
                return '';
            }
            else {
                return ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString())
                    + seperator
                    + (((date.getMonth() + 1).toString().length > 1) ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString())
                    + seperator
                    + date.getFullYear().toString()
                    + seperator
                    + date.getHours().toString()
                    + seperator
                    + date.getMinutes() +
                    + seperator
                    + date.getSeconds();
            }
        }

        /**
        * @returns date as string in the format of yyyy-MM-mm hh:mm:ss
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_yyyyMMdd_hhmmss = (date: Date, seperator: string): string => {
            if (date === undefined || date == null) {
                return '';
            }
            else {
                return date.getFullYear().toString()
                    + seperator
                    + (((date.getMonth() + 1).toString().length > 1) ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString())
                    + seperator
                    + ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString())
                    + seperator
                    + date.getHours().toString()
                    + seperator
                    + date.getMinutes() +
                    + seperator
                    + date.getSeconds();
            }
        }

        /**
        * @returns date as string in the format of dd-MMM-yyyy hh:mm:ss
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_ddMMMyyyy_hhmmss = (date: Date, seperator: string): string => {
            if (date === undefined || date == null) {
                return '';
            }
            else {
                return ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString())
                    + seperator
                    + DateHelpers.getMMM((date.getMonth() + 1))
                    + seperator
                    + date.getFullYear().toString()
                    + seperator
                    + date.getHours().toString()
                    + seperator
                    + date.getMinutes() +
                    + seperator
                    + date.getSeconds();
            }
        }

        /**
        * @returns date as string in the format of yyyy-MMM-dd hh:mm:ss
        * date = your input date
        * seperator = -(dash) or /(forward slash)
        */
        static To_yyyyMMMdd_hhmmss = (date: Date, seperator: string): string => {
            if (date === undefined || date == null) {
                return '';
            }
            else {
                return date.getFullYear().toString()
                    + seperator
                    + DateHelpers.getMMM((date.getMonth() + 1))
                    + seperator
                    + ((date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString())
                    + seperator
                    + date.getHours().toString()
                    + seperator
                    + date.getMinutes() +
                    + seperator
                    + date.getSeconds();
            }
        }

        /**
        * @returns The Difference Between Two Days in json 
        * { "Days" : 0, "Months" : 0, "Year" : 0, "Full" : '0 years 0 months and 0 days' }
        */
        static GetDifferences = (startingDate: string, endingDate: string): any => {
            var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
            if (!endingDate) {
                endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
            }
            var endDate = new Date(endingDate);
            if (startDate > endDate) {
                var swap = startDate;
                startDate = endDate;
                endDate = swap;
            }
            var startYear = startDate.getFullYear();
            var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
            var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            var yearDiff = endDate.getFullYear() - startYear;
            var monthDiff = endDate.getMonth() - startDate.getMonth();
            if (monthDiff < 0) {
                yearDiff--;
                monthDiff += 12;
            }
            var dayDiff = endDate.getDate() - startDate.getDate();
            if (dayDiff < 0) {
                if (monthDiff > 0) {
                    monthDiff--;
                } else {
                    yearDiff--;
                    monthDiff = 11;
                }
                dayDiff += daysInMonth[startDate.getMonth()];
            }

            let full = yearDiff + ' years ' + monthDiff + ' months and ' + dayDiff + ' days';
            let obj = { Days: dayDiff, Months: monthDiff, Year: yearDiff, Full: full };

            return obj;
        }

        private static getMMM = (month: number): string => {

            let maonthName: string = '';
            switch (month) {
                case 1: {
                    maonthName = 'Jan';
                    break;
                }
                case 2: {
                    maonthName = 'Feb';
                    break;
                }
                case 0: {
                    maonthName = 'Mar';
                    break;
                }
                case 4: {
                    maonthName = 'Apr';
                    break;
                }
                case 5: {
                    maonthName = 'May';
                    break;
                }
                case 6: {
                    maonthName = 'Jun';
                    break;
                }
                case 7: {
                    maonthName = 'Jul';
                    break;
                }
                case 8: {
                    maonthName = 'Aug';
                    break;
                }
                case 9: {
                    maonthName = 'Sep';
                    break;
                }
                case 10: {
                    maonthName = 'Oct';
                    break;
                }
                case 11: {
                    maonthName = 'Nov';
                    break;
                }
                case 12: {
                    maonthName = 'Dec';
                    break;
                }
            }
            return maonthName;
        }

    }

    export class ArrayHelpers extends PosExtension.ArrayExtensions {

    }

    export class ObjectHelpers extends PosExtension.ObjectExtensions {

    }

    export class ImageHelper {
    }

    export interface Validation {
        Status: number,
        Message: string
    }

    export class ValidationHelper {

        public static ValidateNotEmpty = (input: string): boolean => {
            if (input == null ||
                input == undefined ||
                input.length == 0) {
                return false;
            }
            else {
                return true;
            }
        }

        //public static ValidateNotEmpty = (input: string, controlLabel: string): string => {
        //    if (input == null ||
        //        input == undefined ||
        //        input.length == 0) {
        //        return "'Item ID'::Require::*\n";
        //    }
        //    else {
        //        return "";
        //    }
        //}

        //public static ValidateEmail = (input: string): boolean => {
        //    let EMAIL: RegExp = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;  
        //    return EMAIL.test(input);
        //}

        //public static ValidateEmail = (input: string): Validation => {

        //    let EMAIL: RegExp = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;  
        //    return EMAIL.test(input);
        //}
    }
}