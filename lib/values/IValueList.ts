import { ITimedValue } from "./ITimedValue";
import { IValueDescription } from "./IValueDescription";

export interface IValueList {
    valueDescription: IValueDescription;
    values: ITimedValue[];
}
