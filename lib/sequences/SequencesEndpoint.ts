import { AxiosInstance } from "axios";
import { getDeviceId, IDevice } from "../device";
import { getProjectId, IProject } from "../project";
import { RESTException } from "../RESTException";
import { ISequence, SequenceTypes } from "./ISequence";

export class SequencesEndpoint {
    constructor(private client: AxiosInstance) {}

    public async getSequences(
        project: string | IProject,
        device: number | IDevice,
        type: SequenceTypes,
        start: string,
        end: string,
        timezone = "UTC",
    ): Promise<ISequence[]> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const result = [] as ISequence[];
        const url = getSequencesURL(projectId, deviceId, SequenceTypes[type]);
        const response = await this.client.get(url, { params: { start, end, timezone } });
        if (response.status === 200) {
            response.data.sequence.forEach((sequence: ISequence) => {
                result.push({ ...sequence });
            });
        } else if (response.status >= 400) {
            throw new RESTException(response.status, response.statusText);
        }
        return result;
    }
}

function getSequencesURL(projectId: string, deviceId: number, seqType: string) {
    return `rest/1/projects/${projectId}/devices/${deviceId}/hist/sequences/${seqType}`;
}
