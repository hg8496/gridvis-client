import axios from "axios";
import { RESTException } from "../../RESTException";
import { SequenceTypes } from "../ISequence";
import { SequencesEndpoint } from "../SequencesEndpoint";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

test("list sequences for yesterday", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            sequence: [
                {
                    type: "Waveform",
                    reason: "Event",
                    startTime: 1579128608568987000,
                    endTime: 1579128608568987000,
                    sampleRate: 40000,
                    pretrigger: 500,
                    values: [1, 2, 3, 4],
                    valueType: {
                        type: "L1",
                        unit: "V",
                        valueName: "Spannung effektiv",
                        typeName: "L1",
                        value: "U_Effective",
                    },
                },
                {
                    type: "EffectiveValues",
                    reason: "Transient",
                    startTime: 1579444399959290000,
                    endTime: 1579444399959290000,
                    pretrigger: 500,
                    sampleRate: 100,
                    values: [7, 8, 9, 0],
                    valueType: {
                        type: "L1",
                        unit: "V",
                        valueName: "Spannung effektiv",
                        typeName: "L1",
                        value: "U_Effective",
                    },
                },
                {
                    type: "Waveform",
                    startTime: 1579875866401336000,
                    endTime: 1579875866401336000,
                    pretrigger: 500,
                    sampleRate: 40000,
                    values: [1, 2, 3, 2, 1, 0, -1, -2],
                    valueType: {
                        type: "L1",
                        unit: "V",
                        valueName: "Spannung effektiv",
                        typeName: "L1",
                        value: "U_Effective",
                    },
                },
            ],
        },
        status: 200,
    });
    const sequencesEndpoint = new SequencesEndpoint(mockedAxios);
    const result = await sequencesEndpoint.getSequences(
        "default",
        1,
        SequenceTypes.EffectiveValues,
        "NAMED_Today",
        "Named_Today",
    );
    expect(result.length).toBe(3);
});

test("list sequences for yesterday no content", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 204,
    });
    const sequencesEndpoint = new SequencesEndpoint(mockedAxios);
    const result = await sequencesEndpoint.getSequences(
        "default",
        1,
        SequenceTypes.Waveform,
        "NAMED_Today",
        "Named_Today",
    );
    expect(result.length).toBe(0);
});

test("list sequences for yesterday not found", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 404,
        statusText: "Not found",
    });
    const sequencesEndpoint = new SequencesEndpoint(mockedAxios);
    await expect(
        sequencesEndpoint.getSequences("default", 1, SequenceTypes.Waveform, "NAMED_Today", "Named_Today"),
    ).rejects.toThrow(new RESTException(404, "Not found"));
});

test("list sequences for yesterday not found with timezone", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 404,
        statusText: "Not found",
    });
    const sequencesEndpoint = new SequencesEndpoint(mockedAxios);
    await expect(
        sequencesEndpoint.getSequences(
            "default",
            1,
            SequenceTypes.EffectiveValues,
            "NAMED_Today",
            "Named_Today",
            "MyTZ",
        ),
    ).rejects.toThrow(new RESTException(404, "Not found"));
});
