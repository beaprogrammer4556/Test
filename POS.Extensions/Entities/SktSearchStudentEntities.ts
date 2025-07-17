export interface studentsearcheader {
    STUDENTID: string;
    LstLines: studentsearchdetail[];
}
export interface studentsearchdetail {
    STUDENTID: string;
    STUDENTNAME: string;
    SUBJECT1: number;
    SUBJECT2: number;
    SUBJECT3: number;
    STUDENTMARKS: number;
}