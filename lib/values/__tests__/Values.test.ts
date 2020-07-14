import axios from "axios";
import { ValuesEndpoint } from "../ValuesEndpoint";
import { RESTException } from "../../RESTException";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

const VT_FREQUENCY = {
    type: "Overall",
    unit: "Hz",
    valueName: "Frequenz",
    typeName: "",
    value: "Frequency",
};
const VT_VOLTAGES = [
    {
        type: "L1",
        unit: "V",
        valueName: "Spannung effektiv",
        typeName: "L1",
        value: "U_Effective",
    },
    {
        type: "L2",
        unit: "V",
        valueName: "Spannung effektiv",
        typeName: "L2",
        value: "U_Effective",
    },
    {
        type: "L3",
        unit: "V",
        valueName: "Spannung effektiv",
        typeName: "L3",
        value: "U_Effective",
    },
];

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
    });
    const valuesEndpoint = new ValuesEndpoint(mockedAxios);
    const result = await valuesEndpoint.list("JanHome", 1);
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
    });
    const valuesEndpoint = new ValuesEndpoint(mockedAxios);
    const result = await valuesEndpoint.list("JanHome", { id: 1, type: "", typeDisplayName: "", name: "" });
    expect(result.length).toBe(3);
});

test("list online by device ID", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            valuetype: [VT_FREQUENCY, ...VT_VOLTAGES],
        },
    });
    const valuesEndpoint = new ValuesEndpoint(mockedAxios);
    const result = await valuesEndpoint.listOnline("JanHome", 1);
    expect(result.length).toBe(4);
});

test("Fetch values", async () => {
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
    });
    const valuesEndpoint = new ValuesEndpoint(mockedAxios);
    const result = await valuesEndpoint.getValues("JanHome", 1, VT, "", "");
    expect(result.values.length).toBe(3);
});

test("list values no content and timezone", async () => {
    mockedAxios.get.mockResolvedValue({
        status: 204,
        data: "",
    });
    const valuesEndpoint = new ValuesEndpoint(mockedAxios);
    const result = await valuesEndpoint.getValues("JanHome", 1, VT, "", "", "myTZ");
    expect(result.values.length).toBe(0);
});

test("list values internal error", async () => {
    mockedAxios.get.mockResolvedValue({
        status: 500,
        statusText: "Internal server error",
    });
    const valuesEndpoint = new ValuesEndpoint(mockedAxios);
    await expect(valuesEndpoint.getValues("JanHome", 1, VT, "", "")).rejects.toThrow(
        new RESTException(500, "Internal server error"),
    );
});

const ONLINE_VALUES = {
    time: {
        "1.I_Effective.L1": 1581068471029000000,
        "1.I_Effective.L2": 1581068471029000000,
        "1.I_Effective.L3": 1581068471029000000,
        "1.U_Effective.L1": 1581068471029000000,
        "1.U_Effective.L2": 1581068471029000000,
        "1.U_Effective.L3": 1581068471029000000,
    },
    value: {
        "1.I_Effective.L1": 0.3605431318283081,
        "1.I_Effective.L2": 0.8282440304756165,
        "1.I_Effective.L3": 1.2315232753753662,
        "1.U_Effective.L1": 231.89686584472656,
        "1.U_Effective.L2": 230.58201599121094,
        "1.U_Effective.L3": 232.64883422851562,
    },
    valueType: {},
};

test("fetch online values", async () => {
    mockedAxios.get.mockResolvedValue({
        data: ONLINE_VALUES,
        status: 200,
    });
    const valuesEndpoint = new ValuesEndpoint(mockedAxios);
    const result = await valuesEndpoint.getOnlineValues("JanHome", 1, VT_VOLTAGES);
    expect(result.get(VT_VOLTAGES[0])).toStrictEqual({ value: 231.89686584472656, time: 1581068471029000000 });
});

test("fetch online values internal error", async () => {
    mockedAxios.get.mockResolvedValue({
        status: 500,
        statusText: "Internal server error",
    });
    const valuesEndpoint = new ValuesEndpoint(mockedAxios);
    await expect(valuesEndpoint.getOnlineValues("JanHome", 1, VT_VOLTAGES)).rejects.toThrow(
        new RESTException(500, "Internal server error"),
    );
});
