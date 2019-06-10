import axios from "axios";
import { DevicesEndpoint } from "../DevicesEndpoint";
import { RESTException } from "../../RESTException";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

test("simple succeeding connection test", async () => {
    mockedAxios.get.mockResolvedValue({
        status: 200,
        data: {
            serialNumber: "7000-0084",
            status: "OK",
            firmware: "5.008 2018-08-23 14:30:00",
            hardware: "-001 Ethernet differential current Profibus",
            statusMsg: "Connection test successful",
        },
    } as any);
    const devicesEndpoint = new DevicesEndpoint(mockedAxios);
    const result = await devicesEndpoint.connectionTest("JanHome", 1);
    expect(result.serialNr).toBe("7000-0084");
});

test("fail with internal server error", async () => {
    mockedAxios.get.mockResolvedValue({
        data: "",
        status: 500,
        statusText: "Internal server error",
    } as any);
    const devicesEndpoint = new DevicesEndpoint(mockedAxios);
    await expect(devicesEndpoint.connectionTest("test", 1)).rejects.toThrow(
        new RESTException(500, "Internal server error"),
    );
});
