import axios from "axios";
import { RESTException } from "../../RESTException";
import { EventsEndpoint } from "../EventsEndpoint";
import { EventTypes } from "../IEvent";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

test("list transients for yesterday", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            event: [
                {
                    input: "L1",
                    limit: 241.50001525878906,
                    min: 241.53753662109375,
                    max: 241.57252502441406,
                    startTime: 1549782701459690752,
                    endTime: 1549782701499745024,
                    avg: 241.55503845214844,
                    eventType: "VoltageOver",
                },
                {
                    input: "L1",
                    limit: 241.50001525878906,
                    min: 241.52984619140625,
                    max: 241.59353637695312,
                    startTime: 1549782701579653120,
                    endTime: 1549782701639857408,
                    avg: 241.5511932373047,
                    eventType: "VoltageOver",
                },
                {
                    input: "L1",
                    limit: 241.50001525878906,
                    min: 241.53515625,
                    max: 241.53515625,
                    startTime: 1549782701719764992,
                    endTime: 1549782701739918080,
                    avg: 241.53515625,
                    eventType: "VoltageOver",
                },
            ],
        },
        status: 200,
    });
    const eventsEndpoint = new EventsEndpoint(mockedAxios);
    const result = await eventsEndpoint.getEvents("default", 1, [EventTypes.VoltageOver], "NAMED_Today", "Named_Today");
    expect(result.length).toBe(3);
});

test("list transients for yesterday no content", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 204,
    });
    const eventsEndpoint = new EventsEndpoint(mockedAxios);
    const result = await eventsEndpoint.getEvents("default", 1, [EventTypes.VoltageOver], "NAMED_Today", "Named_Today");
    expect(result.length).toBe(0);
});

test("list transients for yesterday not found", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 404,
        statusText: "Not found",
    });
    const eventsEndpoint = new EventsEndpoint(mockedAxios);
    await expect(
        eventsEndpoint.getEvents(
            "default",
            1,
            [EventTypes.VoltageOver, EventTypes.VoltageUnder],
            "NAMED_Today",
            "Named_Today",
        ),
    ).rejects.toThrow(new RESTException(404, "Not found"));
});

test("list transients for yesterday not found with timezone", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 404,
        statusText: "Not found",
    });
    const eventsEndpoint = new EventsEndpoint(mockedAxios);
    await expect(
        eventsEndpoint.getEvents("default", 1, [EventTypes.VoltageOver], "NAMED_Today", "Named_Today", "MyTZ"),
    ).rejects.toThrow(new RESTException(404, "Not found"));
});
