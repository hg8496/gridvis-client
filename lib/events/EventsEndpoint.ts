import { AxiosInstance } from "axios";
import * as qs from "qs";
import { getDeviceId, IDevice } from "../device";
import { getProjectId, IProject } from "../project";
import { RESTException } from "../RESTException";
import { EventTypes, IEvent } from "./IEvent";

export class EventsEndpoint {
    constructor(private client: AxiosInstance) {}

    /**
     * Returns all events in the specified timeframe of the given types.
     * @param project The name or the instance of a project.
     * @param device The id or the instance of a device.
     * @param types A list of {@link EventTypes} to fetch from server.
     * @param start The start time in format of the GridVis REST interface. For Example ```NAMED_Today```
     * @param end The end time in format of the GridVis REST interface.
     * @param timezone Supports all Java timezones
     */
    public async getEvents(
        project: string | IProject,
        device: number | IDevice,
        types: EventTypes[],
        start: string,
        end: string,
        timezone = "UTC",
    ): Promise<IEvent[]> {
        const projectId = getProjectId(project);
        const deviceId = getDeviceId(device);
        const result = [] as IEvent[];
        const url = getEventsURL(projectId, deviceId);
        const typeStrings = types.map((value) => EventTypes[value]);
        const response = await this.client.get(url, {
            params: { start, end, type: typeStrings, timezone },
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
        });
        if (response.status === 200) {
            response.data.event.forEach((event: IEvent) => {
                result.push({ ...event });
            });
        } else if (response.status >= 400) {
            throw new RESTException(response.status, response.statusText);
        }
        return result;
    }
}

function getEventsURL(projectId: string, deviceId: number) {
    return `rest/1/projects/${projectId}/devices/${deviceId}/hist/events`;
}
