import { AxiosInstance } from "axios";
import { getProjectId, IProject } from "../project";
import { getDeviceId, IDevice } from "../device";
import { RESTException } from "../RESTException";
import { ITransient } from "./ITransient";

export class TransientsEndpoint {
    constructor(private client: AxiosInstance) {}

    public async getTransients(
        project: string | IProject,
        device: number | IDevice,
        start: string,
        end: string,
        timezone: string = "UTC",
    ): Promise<ITransient[]> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const result = [] as ITransient[];
        const url = getTransientsURL(projectId, deviceId);
        const response = await this.client.get(url, { params: { start, end, timezone } });
        if (response.status === 200) {
            response.data.transient.forEach((transient: ITransient) => {
                result.push({ ...transient });
            });
        } else if (response.status >= 400) {
            throw new RESTException(response.status, response.statusText);
        }
        return result;
    }
}

function getTransientsURL(projectId: string, deviceId: number) {
    return `rest/1/projects/${projectId}/devices/${deviceId}/hist/transients`;
}