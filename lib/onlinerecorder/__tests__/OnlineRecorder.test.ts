import axios from "axios";
import { RESTException } from "../../RESTException";
import { OnlineRecorderEndpoint } from "../OnlineRecorderEndpoint";
import { IRecordedValue } from "../IRecordedValue";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

const recordingSetting = {
    onlineRecordingValue: [
        {
            timebase: 900,
            valueType: {
                type: "L1",
                typeName: "L1",
                unit: "V",
                value: "U_Effective",
                valueName: "Spannung effektiv",
            },
        },
    ] as IRecordedValue[]
}

test("list online recordings no content", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 204,
    } as any);
    const endpoint = new OnlineRecorderEndpoint(mockedAxios);
    const result = await endpoint.fetchSetting("default", 1);
    expect(result.length).toBe(0);
});

test("list online recordings", async () => {
    mockedAxios.get.mockResolvedValue({
        data: recordingSetting,
        status: 200,
    } as any);
    const endpoint = new OnlineRecorderEndpoint(mockedAxios);
    const result = await endpoint.fetchSetting("default", 1);
    expect(result.length).toBe(1);
});

test("list online recordings with failure", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 401,
        statusText: "Not authorized",
    } as any);
    const endpoint = new OnlineRecorderEndpoint(mockedAxios);;
    await expect(endpoint.fetchSetting("default", 1)).rejects.toThrow(new RESTException(401, "Not authorized"));
});

test("set online recordings with failure", async () => {
    mockedAxios.post.mockResolvedValue({
        data: {},
        status: 401,
        statusText: "Not authorized",
    } as any);
    const endpoint = new OnlineRecorderEndpoint(mockedAxios);;
    await expect(endpoint.writeSetting("default", 1, recordingSetting.onlineRecordingValue)).rejects.toThrow(new RESTException(401, "Not authorized"));
});
