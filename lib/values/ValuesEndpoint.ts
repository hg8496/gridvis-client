import { AxiosInstance } from "axios";
import * as qs from "qs";
import { getDeviceId, IDevice } from "../device";
import { getProjectId, IProject } from "../project";
import { RESTException } from "../RESTException";
import { IOnlineValue } from "./IOnlineValue";
import { ITimedValue } from "./ITimedValue";
import { IValueDescription } from "./IValueDescription";
import { IValueList } from "./IValueList";
import { IValueType } from "./IValueType";

export class ValuesEndpoint {
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

    public async listOnline(project: string | IProject, device: number | IDevice): Promise<IValueType[]> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const result = [] as IValueType[];
        const response = await this.client.get(getOnlineValueTypessURL(projectId, deviceId));
        response.data.valuetype.forEach((value: IValueType) => {
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
        timezone: string = "UTC",
    ): Promise<IValueList> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const values = [] as ITimedValue[];
        const url =
            getHistoricalValuesURL(projectId, deviceId) +
            `/${value.valueType.value}/${value.valueType.type}/${value.timebase}`;
        const response = await this.client.get(url, { params: { start, end, timezone } });
        if (response.status === 200) {
            response.data.values.forEach((tvalue: ITimedValue) => {
                values.push({ ...tvalue });
            });
        } else if (response.status >= 400) {
            throw new RESTException(response.status, response.statusText);
        }
        return { valueDescription: value, values };
    }

    public async getOnlineValues(
        project: string | IProject,
        device: number | IDevice,
        values: IValueType[],
    ): Promise<Map<IValueType, IOnlineValue>> {
        const result = new Map<IValueType, IOnlineValue>();
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const url = getOnlineValuesURL(projectId);
        const valueStrings = [] as string[];
        values.forEach(value => valueStrings.push(`${deviceId};${value.value};${value.type}`));
        const response = await this.client.get(url, {
            params: { value: valueStrings },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
        });
        if (response.status === 200) {
            values.forEach((vType: IValueType) => {
                const key = `${deviceId}.${vType.value}.${vType.type}`;
                const oValue = {
                    time: response.data.time[key],
                    value: response.data.value[key],
                } as IOnlineValue;
                result.set(vType, oValue);
            });
        } else if (response.status >= 400) {
            throw new RESTException(response.status, response.statusText);
        }
        return result;
    }
}

function getHistoricalValuesURL(projectId: string, deviceId: number) {
    return `rest/1/projects/${projectId}/devices/${deviceId}/hist/values`;
}

function getOnlineValueTypessURL(projectId: string, deviceId: number) {
    return `rest/1/projects/${projectId}/devices/${deviceId}/online/values`;
}

function getOnlineValuesURL(projectId: string) {
    return `rest/1/projects/${projectId}/onlinevalues`;
}
