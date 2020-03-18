import axios from "axios";
import { GridVisClient } from "../Client";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

test("getVersion", async () => {
    mockedAxios.get.mockResolvedValue({
        data: { name: "version", value: "Janitza-GridVis Service 7.4.0(137)" },
    } as any);
    const client = new GridVisClient({ url: "" });
    const result = await client.fetchGridVisVersion();
    expect(result).toBe("Janitza-GridVis Service 7.4.0(137)");
});

test("getVersion Fail", async () => {
    mockedAxios.get.mockRejectedValue({} as any);
    const client = new GridVisClient({ url: "", username: "", password: "" });
    const result = await client.fetchGridVisVersion();
    expect(result).toBe("");
});
