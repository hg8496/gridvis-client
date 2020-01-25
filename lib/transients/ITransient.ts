import {IValueType} from "../values/IValueType";

export interface ITransient {
    startTime: number;
    endTime: number;
    type: "Absolute" | "Envelope" | "Slope";
    energy? : number;
    max?: number;
    valueType: IValueType;
}
