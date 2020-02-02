export interface IDevice {
    /** A summary of how to connect to the device. */
    connectionString?: string;
    /** The user given description of the device. */
    description?: string;
    /** GridVis internal id of the device. */
    id: number;
    /** The user given name of the device. */
    name: string;
    /** The serial number of the device in case it is known. */
    serialNr?: string;
    /** Internal name of the device type. */
    type: string;
    /** Device type to show to end users. */
    typeDisplayName: string;
}
