import { AxiosInstance } from "axios";
import { getDeviceId, IDevice } from "../device";
import { getProjectId, IProject } from "../project";
import { RESTException } from "../RESTException";
import { IRecordedValue } from "./IRecordedValue";

export class OnlineRecorderEndpoint {
    constructor(private client: AxiosInstance) {}

    public async fetchSetting(project: string | IProject, device: number | IDevice): Promise<IRecordedValue[]> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const result = [] as IRecordedValue[];
        const response = await this.client.get(getOnlineRecorderSettingsURL(projectId, deviceId));
        if (response.status === 200) {
            response.data.onlineRecordingValue.forEach((value: IRecordedValue) => {
                result.push({ ...value });
            });
        } else if (response.status >= 400) {
            throw new RESTException(response.status, response.statusText);
        }
        return result;
    }

    public async writeSetting(
        project: string | IProject,
        device: number | IDevice,
        onlineRecordingValue: IRecordedValue[],
    ): Promise<void> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const data = JSON.stringify({ onlineRecordingValue });
        const response = await this.client.post(getOnlineRecorderSettingsURL(projectId, deviceId), data);
        if (response.status >= 400) {
            throw new RESTException(response.status, response.statusText);
        }
    }
}

function getOnlineRecorderSettingsURL(projectId: string, deviceId: number) {
    return `rest/1/projects/${projectId}/devices/${deviceId}/onlinerecord/settings`;
}
