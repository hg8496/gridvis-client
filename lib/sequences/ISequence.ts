import { IValueType } from "../values/IValueType";

export enum SequenceTypes {
    /** Effective values as half or fullwave values. */
    EffectiveValues,
    /** Waveform data. */
    Waveform,
}

type SequenceTypesStrings = keyof typeof SequenceTypes;

export interface ISequence {
    /** Start time of event in nano seconds in UTC */
    startTime: number;
    /** End time of event in nano seconds in UTC */
    endTime: number;
    /** Type of recorded sequence. */
    type: SequenceTypesStrings;
    /** The reason why the sequence has been recorded. */
    reason?: string;
    /** The number of values before the reason happened that triggered the recording. */
    pretrigger: number;
    /** The sample rate of the squence. */
    sampleRate: number;
    /** The values that make up the sequnce. */
    values: number[];
    /** The value the sequence represents. */
    valueType: IValueType;
}
