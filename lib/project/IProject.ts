export interface IProject {
    /** Name of the project. */
    name: string;
    /** Status of the project. */
    status: string;
    /** Display name of project status. In locale of the server. */
    displayStatus: string;
    /** Number of devices in the project. Only when project is in state Ready. */
    numberOfDevices?: number;
    /** Path to project on the server. */
    path?: string;
}
