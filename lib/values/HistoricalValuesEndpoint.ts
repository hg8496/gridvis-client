import { AxiosInstance } from "axios";
import { getDeviceId, IDevice } from "../device";
import { getProjectId, IProject } from "../project";
import { ITimedValue } from "./ITimedValue";
import { IValueDescription } from "./IValueDescription";
import { IValueList } from "./IValueList";

export class HistoricalValuesEndpoint {
    constructor(private client: AxiosInstance) {}

    public async list(project: string | IProject, device: number | IDevice): Promise<IValueDescription[]> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const result = [] as IValueDescription[];
        const response = await this.client.get(getHistoricalValuesURL(projectId, deviceId));
        response.data.value.forEach((value: IValueDescription) => {
            result.push({ ...value });
        });
        return result;
    }

    public async getValues(
        project: string | IProject,
        device: number | IDevice,
        value: IValueDescription,
        start: string,
        end: string,
    ): Promise<IValueList> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const values = [] as ITimedValue[];
        const result = { valueDescription: value, values };
        const url =
            getHistoricalValuesURL(projectId, deviceId) +
            `/${value.valueType.value}/${value.valueType.type}/${value.timebase}`;
        const response = await this.client.get(url, { params: { start, end } });
        response.data.values.forEach((tvalue: ITimedValue) => {
            values.push({ ...tvalue });
        });
        return result;
    }
}

function getHistoricalValuesURL(projectId: string, deviceId: number) {
    return `rest/1/projects/${projectId}/devices/${deviceId}/hist/values`;
}