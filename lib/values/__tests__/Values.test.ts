import axios from "axios";
import { HistoricalValuesEndpoint } from "../HistoricalValuesEndpoint";
import { RESTException } from "../../RESTException";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

const VT = {
    online: false,
    valueType: {
        type: "Overall",
        unit: "m³/GTZ",
        valueName: "result",
        typeName: "result",
        value: "UserDefined",
    },
    timebase: 3600,
    id: 0,
};

test("list by device ID", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            value: [
                VT,
                {
                    online: false,
                    valueType: { type: "L1", unit: "m^3", valueName: "A", typeName: "A", value: "UserDefined" },
                    timebase: 3600,
                    id: 1,
                },
                {
                    online: false,
                    valueType: { type: "L2", unit: "GT", valueName: "B", typeName: "B", value: "UserDefined" },
                    timebase: 3600,
                    id: 2,
                },
            ],
        },
    } as any);
    const historicalValuesEndpoint = new HistoricalValuesEndpoint(mockedAxios);
    const result = await historicalValuesEndpoint.list("JanHome", 1);
    expect(result.length).toBe(3);
});

test("list by device", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            value: [
                VT,
                {
                    online: false,
                    valueType: { type: "L1", unit: "m^3", valueName: "A", typeName: "A", value: "UserDefined" },
                    timebase: 3600,
                    id: 1,
                },
                {
                    online: false,
                    valueType: { type: "L2", unit: "GT", valueName: "B", typeName: "B", value: "UserDefined" },
                    timebase: 3600,
                    id: 2,
                },
            ],
        },
    } as any);
    const historicalValuesEndpoint = new HistoricalValuesEndpoint(mockedAxios);
    const result = await historicalValuesEndpoint.list("JanHome", { id: 1, type: "", typeDisplayName: "", name: "" });
    expect(result.length).toBe(3);
});

test("list by device ID", async () => {
    mockedAxios.get.mockResolvedValue({
        status: 200,
        data: {
            values: [
                {
                    avg: 50.009674072265625,
                    min: 49.986812591552734,
                    max: 50.02431869506836,
                    startTime: 1558272600192282000,
                    endTime: 1558273200192282000,
                },
                {
                    avg: 50.01185607910156,
                    min: 49.9913330078125,
                    max: 50.035423278808594,
                    startTime: 1558273200192282000,
                    endTime: 1558273800192282000,
                },
                {
                    avg: 50.004573822021484,
                    min: 49.977046966552734,
                    max: 50.03470230102539,
                    startTime: 1558273800192282000,
                    endTime: 1558274400192282000,
                },
            ],
        },
    } as any);
    const historicalValuesEndpoint = new HistoricalValuesEndpoint(mockedAxios);
    const result = await historicalValuesEndpoint.getValues("JanHome", 1, VT, "", "");
    expect(result.values.length).toBe(3);
});

test("list by device ID no content and timezone", async () => {
    mockedAxios.get.mockResolvedValue({
        status: 204,
        data: "",
    } as any);
    const historicalValuesEndpoint = new HistoricalValuesEndpoint(mockedAxios);
    const result = await historicalValuesEndpoint.getValues("JanHome", 1, VT, "", "", "myTZ");
    expect(result.values.length).toBe(0);
});

test("list by device ID internal error", async () => {
    mockedAxios.get.mockResolvedValue({
        status: 500,
        statusText: "Internal server error",
    } as any);
    const historicalValuesEndpoint = new HistoricalValuesEndpoint(mockedAxios);
    expect(historicalValuesEndpoint.getValues("JanHome", 1, VT, "", "")).rejects.toThrow(
        new RESTException(500, "Internal server error"),
    );
});
