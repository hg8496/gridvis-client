import { AxiosInstance } from "axios";
import { getProjectId, IProject } from "../project";
import { RESTException } from "../RESTException";
import { IConnectionTest } from "./IConnectionTest";
import { IDevice } from "./IDevice";
import { getDeviceId } from "./index";

export class DevicesEndpoint {
    constructor(private client: AxiosInstance) {}

    public async list(project: string | IProject): Promise<IDevice[]> {
        const projectId = getProjectId(project);
        const result = [] as IDevice[];
        const response = await this.client.get(`rest/1/projects/${projectId}/devices`);
        response.data.device.forEach((device: IDevice) => {
            result.push({ ...device });
        });
        return result;
    }

    public async connectionTest(project: string | IProject, device: number | IDevice): Promise<IConnectionTest> {
        const projectId = getProjectId(project);
        const deviceID = getDeviceId(device);
        const response = await this.client.get(`rest/1/projects/${projectId}/devices/${deviceID}/connectiontest`);
        if (response.status === 200) {
            return {
                firmware: response.data.firmware,
                hardware: response.data.hardware,
                serialNr: response.data.serialNumber,
                status: response.data.status,
                statusMessage: response.data.statusMsg,
            };
        } else {
            throw new RESTException(response.status, response.statusText);
        }
    }
}
