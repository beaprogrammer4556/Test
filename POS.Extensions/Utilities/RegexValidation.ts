export default class RegexValidation {
    /**
     * @description {check whether the string value is empty or null}
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsNullOrEmpty = (input: string): boolean => {
        if (input == undefined) {
            return true;
        }
        else if (input.length == 0 || input == '') {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string value is alphabet only}
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsAllCharAlphabet = (input: string): boolean => {
        let letters = /^[A-Za-z]+$/;
        if (input.match(letters)) {
            return true;
        }
        return false;
    }

    /**
     * @description {An integer without an leading plus(+) or minus(-) sign}
     * @param {string} input integer value in string format
     * @returns {boolean} true or false
     */
    static IsInteger = (input: string): boolean => {
        var numbers = /^[0-9]+$/;
        if (input.match(numbers)) {
            return true;
        }
        return false;
    }

    /**
     * @description {An integer with an optional leading plus(+) or minus(-) sign}
     * @param {string} input integer value in string format
     * @returns {boolean} true or false
     */
    static IsIntegerPlusMinus = (input: string): boolean => {
        var numbers = /^[-+]?[0-9]+$/;
        if (input.match(numbers)) {
            return true;
        }
        return false;
    }

    /**
     * @description {Javascript function to check whether a field input contains a number with no exponent, mandatory integer and fraction and optional sign}
     * @param {string} input decimal value with (.) in string format 
     * @returns {boolean} true or false
     */
    static IsDeimal = (input: string): boolean => {
        var decimal = /^[-+]?[0-9]+\.[0-9]+$/;
        if (input.match(decimal)) {
            return true;
        }
        return false;
    }

    /**
     * @description {Javascript function to check whether a field input contains a number with no exponent, mandatory sign (+-), integer, and fraction}
     * @param {string} input decimal value with (.) in string format 
     * @returns {boolean} true or false
     */
    static IsDeimalPlusMinus = (input: string): boolean => {
        var decimal = /[-+][0-9]+\.[0-9]+$/;
        if (input.match(decimal)) {
            return true;
        }
        return false;
    }

    /**
     * @description {Javascript function to check whether a field input contains a number starting with mandatory sign (+-), exponent, integer, fraction}
     * @param {string} input decimal value with (.) in string format 
     * @returns {boolean} true or false
     */
    static IsDeimalExponentPlusMinus = (input: string): boolean => {
        var decimal = /^[-+][0-9]+\.[0-9]+[eE][-+]?[0-9]+$/;
        if (input.match(decimal)) {
            return true;
        }
        return false;
    }

    /**
     * @description {To check the givent input string length between minimum and manimum}
     * @param {string} input decimal value with (.) in string format 
     * @param {number} minlength minimum length checker for the string
     * @param {number} maxlength maximum length checker for the string
     * @returns {boolean} true or false
     */
    static IsValidStringLength = (input: string, minlength: number, maxlength: number): boolean => {
        if (input.length >= minlength && input.length <= maxlength) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid email format or not}
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidEmail = (input: string): boolean => {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (input.match(mailformat)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid 10 digit phone number format without comma, space and punctuation }
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidPhoneNumber = (input: string): boolean => {
        var phoneno = /^\d{10}$/;
        if (input.match(phoneno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid phone number in the format like  XXX-XXX-XXXX or XXX.XXX.XXXX or XXX XXX XXXX }
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidPhoneNumberFormat = (input: string): boolean => {
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (input.match(phoneno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid phone number in the format like  +XX-XXXX-XXXX or +XX.XXXX.XXXX or +XX XXXX XXXX }
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidPhoneNumberFormat2 = (input: string): boolean => {
        var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
        if (input.match(phoneno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid IP Address or not }
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidIPAddress = (input: string): boolean => {
        var ipAddress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (input.match(ipAddress)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid American Express Credit Card Number. Example validate a American Express credit card starting with 34 or 37, length 15 digits. }
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidAmericanExpressCC = (input: string): boolean => {
        var cardno = /^(?:3[47][0-9]{13})$/;

        if (input.match(cardno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid VISA Credit Card Number. Example validate a Visa card starting with 4, length 13 or 16 digits.}
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidVISACC = (input: string): boolean => {
        var cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;

        if (input.match(cardno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid Master Card. Example validate a MasterCard starting with 51 through 55, length 16 digits}
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidMasterCard = (input: string): boolean => {
        var cardno = /^(?:5[1-5][0-9]{14})$/;

        if (input.match(cardno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid Discover Card. Example validate a Discover Card starting with 6011, length 16 digits or starting with 5, length 15 digits.}
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidDiscoverCard = (input: string): boolean => {
        var cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;

        if (input.match(cardno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid Diners Club Card. Example validate a Diners Club card starting with 300 through 305, 36, or 38, length 14 digits.}
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidDinersClubCard = (input: string): boolean => {
        var cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;

        if (input.match(cardno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check whether the string is valid JCB Card. Example validate a JCB card starting with 2131 or 1800, length 15 digits or starting with 35, length 16.}
     * @param {string} input string value
     * @returns {boolean} true or false
     */
    static IsValidJCBCard = (input: string): boolean => {
        var cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;

        if (input.match(cardno)) {
            return true;
        }
        return false;
    }

    /**
     * @description {check file size in KB.}
     * @param {number} input number value real size of file
     * @param {number} input number Require Maximum size
     * @returns {boolean} true or false
     */
    static IsValidFileSizeInKB = (RealSize: number, RequireMaxSize: number): boolean => {
        let kbSize: number = RealSize / 1024;
        if (kbSize <= RequireMaxSize) {
            return true;
        }
        return false;
    }

    /**
     * @description {check file size in MB.}
     * @param {number} input number value real size of file
     * @param {number} input number Require Maximum size
     * @returns {boolean} true or false
     */
    static IsValidFileSizeInMB = (RealSize: number, RequireMaxSize: number): boolean => {
        let mbSize: number = (RealSize / 1024) / 1024;
        if (mbSize <= RequireMaxSize) {
            return true;
        }
        return false;
    }

    /**
     * @description {check file size in Byte.}
     * @param {number} input number value real size of file
     * @param {number} input number Require Maximum size
     * @returns {boolean} true or false
     */
    static IsValidFileSizeInByte = (RealSize: number, RequireMaxSize: number): boolean => {
        let bSize: number = RealSize;
        if (bSize <= RequireMaxSize) {
            return true;
        }
        return false;
    }

    static IsValidIndianBankAccNo = (input: string): boolean => {
        let letters = /^\d{9,18}$/;
        if (input.match(letters)) {
            return true;
        }
        return false;
    }

    static IsValidIFSCCode = (input: string): boolean => {
        let letters = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/;
        if (input.match(letters)) {
            return true;
        }
        return false;
    }

    static IsValidAadharCard = (input: string): boolean => {
        let letters = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
        if (input.match(letters)) {
            return true;
        }
        return false;
    }

    static IsValidPanCard = (input: string): boolean => {
        let letters = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
        if (input.match(letters)) {
            return true;
        }
        return false;
    }

    static IsValidVoterid = (input: string): boolean => {
        let letters = /^([a-zA-Z]){3}([0-9]){7}?$/;
        if (input.match(letters)) {
            return true;
        }
        return false;
    }

    static IsValidDrivingLicense = (input: string): boolean => {
        let letters = /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
        if (input.match(letters)) {
            return true;
        }
        return false;
    }

    static IsValidPassportNo = (input: string): boolean => {
        //let letters = /^[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]$/;
        let letters = /^[a-zA-Z0-9]+$/;
        if (input.match(letters)) {
            if (input.length >= 8)
                return true;
            else
                return false;
        }
        return false;
    }
}