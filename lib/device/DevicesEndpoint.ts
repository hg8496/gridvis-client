import {AxiosInstance} from "axios";
import {IProject} from "..";
import {IDevice} from "./IDevice";

function getProjectId(project: string|IProject): string {
    return typeof project === 'string'? project : project.name;
}

export class DevicesEndpoint {

    constructor(private client: AxiosInstance) {};

    public async list(project: string|IProject): Promise<IDevice[]> {
        const projectId = getProjectId(project);
        const result = [] as IDevice[];
        const response = await this.client.get(`rest/1/projects/${projectId}/devices`);
        response.data.device.forEach((device: IDevice) => {
            result.push({ ...device });
        });
        return result;
    }
}
