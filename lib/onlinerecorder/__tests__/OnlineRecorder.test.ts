import axios from "axios";
import { RESTException } from "../../RESTException";
import { OnlineRecorderEndpoint } from "../OnlineRecorderEndpoint";
import { IRecordedValue } from "../IRecordedValue";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

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
        data: {
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
            ] as IRecordedValue[],
        },
        status: 200,
    } as any);
    const endpoint = new OnlineRecorderEndpoint(mockedAxios);
    const result = await endpoint.fetchSetting("default", 1);
    expect(result.length).toBe(1);
});
