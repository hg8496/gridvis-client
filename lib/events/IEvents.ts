import { IValueType } from "../values/IValueType";

export enum EventTypes {
    VoltageOver,
    VoltageUnder,
    VoltageOutage,
    VoltageFastChange,
    CurrentOver,
    PowerFailure,
    PowerRecovery,
}

type EventTypeStrings = keyof typeof EventTypes;

export interface IEvents {
    startTime: number;
    endTime: number;
    eventType: EventTypeStrings;
    input: string;
    limit?: number;
    min?: number;
    avg?: number;
    max?: number;
}
