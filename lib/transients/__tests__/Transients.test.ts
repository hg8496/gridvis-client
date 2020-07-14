import axios from "axios";
import { TransientsEndpoint } from "../TransientsEndpoint";
import { RESTException } from "../../RESTException";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

test("list transients for yesterday", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            transient: [
                {
                    type: "Slope",
                    max: "NaN",
                    startTime: 1579128608568987000,
                    endTime: 1579128608568987000,
                    valueType: {
                        type: "L1",
                        unit: "V",
                        valueName: "Spannung effektiv",
                        typeName: "L1",
                        value: "U_Effective",
                    },
                    energy: "NaN",
                },
                {
                    type: "Slope",
                    max: "NaN",
                    startTime: 1579444399959290000,
                    endTime: 1579444399959290000,
                    valueType: {
                        type: "L1",
                        unit: "V",
                        valueName: "Spannung effektiv",
                        typeName: "L1",
                        value: "U_Effective",
                    },
                    energy: "NaN",
                },
                {
                    type: "Slope",
                    max: "NaN",
                    startTime: 1579875866401336000,
                    endTime: 1579875866401336000,
                    valueType: {
                        type: "L1",
                        unit: "V",
                        valueName: "Spannung effektiv",
                        typeName: "L1",
                        value: "U_Effective",
                    },
                    energy: "NaN",
                },
            ],
        },
        status: 200,
    });
    const transientsEndpoint = new TransientsEndpoint(mockedAxios);
    const result = await transientsEndpoint.getTransients("default", 1, "NAMED_Today", "Named_Today");
    expect(result.length).toBe(3);
});

test("list transients for yesterday no content", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 204,
    });
    const transientsEndpoint = new TransientsEndpoint(mockedAxios);
    const result = await transientsEndpoint.getTransients("default", 1, "NAMED_Today", "Named_Today");
    expect(result.length).toBe(0);
});

test("list transients for yesterday not found", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 404,
        statusText: "Not found",
    });
    const transientsEndpoint = new TransientsEndpoint(mockedAxios);
    await expect(transientsEndpoint.getTransients("default", 1, "NAMED_Today", "Named_Today")).rejects.toThrow(
        new RESTException(404, "Not found"),
    );
});

test("list transients for yesterday not found with timezone", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 404,
        statusText: "Not found",
    });
    const transientsEndpoint = new TransientsEndpoint(mockedAxios);
    await expect(transientsEndpoint.getTransients("default", 1, "NAMED_Today", "Named_Today", "MyTZ")).rejects.toThrow(
        new RESTException(404, "Not found"),
    );
});
