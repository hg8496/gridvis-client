import { IValueType } from "./IValueType";

export interface IValueDescription {
    id: number;
    online: boolean;
    timebase: number;
    valueType: IValueType;
}
