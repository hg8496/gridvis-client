/** Types an event can have. */
export enum EventTypes {
    /** Voltage has been above limit. */
    VoltageOver,
    /** Voltage has been below limit. */
    VoltageUnder,
    /** Voltage has been near zero. */
    VoltageOutage,
    /** Voltage has changed unreasonable fast. Aka rapid voltage change */
    VoltageFastChange,
    /** Current was over specified limit. */
    CurrentOver,
    /** Device lost it's supply power. */
    PowerFailure,
    /** Device supply power returned. */
    PowerRecovery,
}

type EventTypeStrings = keyof typeof EventTypes;

/** Definition of an event.
 */
export interface IEvent {
    /** Start time of event in nano seconds in UTC */
    startTime: number;
    /** End time of event in nano seconds in UTC */
    endTime: number;
    /** Type of the recorded event. */
    eventType: EventTypeStrings;
    /** Name of the input of the event. */
    input: string;
    /** The limit that was configured as the event hit the limit. */
    limit?: number;
    /** Minimum value that occurred during the event. */
    min?: number;
    /** Avg value that occurred during the event. */
    avg?: number;
    /** Maximum value that occurred during the event. */
    max?: number;
}
