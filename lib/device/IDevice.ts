import { IProject } from "..";

export interface IDevice {
    connectionString?: string;
    description?: string;
    id: number;
    name: string;
    project?: IProject;
    serialNumber?: string;
    type: string;
}