export interface StudentInfoHeader {
    STUDENTID: string;
    STUDENTNAME: string;
    STUDENTCLASS: string;
    LstLines: StudentResultDetail[];
}

export interface StudentResultDetail {
    STUDENTID: string;
    LINENUM: number;
    SUBJECT1: number;
    SUBJECT2: number;
    SUBJECT3: number;
}

