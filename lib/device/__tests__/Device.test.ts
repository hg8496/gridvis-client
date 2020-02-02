import axios from "axios";
import { RESTException } from "../../RESTException";
import { DevicesEndpoint } from "../DevicesEndpoint";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

test("list devices by project name", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            device: [
                {
                    description: "Janitza electronics GmbH UMG604",
                    type: "JanitzaUMG604",
                    serialNr: "7000-0084",
                    connectionString: "HTTP Secure IP-Adresse: fb.cstolz.de:81",
                    id: 1,
                    name: "UMG604 Ehringshausen",
                },
                {
                    description: "Virtuelles Gerät zur Berechnung von Wasser und Gas",
                    type: "XXXVirtual",
                    serialNr: "",
                    connectionString: "Nicht konfiguriert",
                    id: 2,
                    name: "Wasser und Gas",
                },
                {
                    description: "",
                    type: "XXXExternValues",
                    serialNr: "",
                    connectionString: "Nicht konfiguriert",
                    id: 5,
                    name: "Daten",
                },
                {
                    description: "",
                    type: "XXXVirtualKPI",
                    serialNr: "",
                    connectionString: "Nicht konfiguriert",
                    id: 6,
                    name: "Gas pro GTZ",
                },
                {
                    description: "",
                    type: "XXXVirtualKPI",
                    serialNr: "",
                    connectionString: "Nicht konfiguriert",
                    id: 8,
                    name: "Gas pro GTZ in Heizperiode",
                },
            ],
        },
        status: 200,
    } as any);
    const devicesEndpoint = new DevicesEndpoint(mockedAxios);
    const result = await devicesEndpoint.list("JanHome");
    expect(result.length).toBe(5);
});

test("list devices by project", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            device: [
                {
                    description: "Janitza electronics GmbH UMG604",
                    type: "JanitzaUMG604",
                    serialNr: "7000-0084",
                    connectionString: "HTTP Secure IP-Adresse: fb.cstolz.de:81",
                    id: 1,
                    name: "UMG604 Ehringshausen",
                },
                {
                    description: "Virtuelles Gerät zur Berechnung von Wasser und Gas",
                    type: "XXXVirtual",
                    serialNr: "",
                    connectionString: "Nicht konfiguriert",
                    id: 2,
                    name: "Wasser und Gas",
                },
                {
                    description: "",
                    type: "XXXExternValues",
                    serialNr: "",
                    connectionString: "Nicht konfiguriert",
                    id: 5,
                    name: "Daten",
                },
                {
                    description: "",
                    type: "XXXVirtualKPI",
                    serialNr: "",
                    connectionString: "Nicht konfiguriert",
                    id: 6,
                    name: "Gas pro GTZ",
                },
                {
                    description: "",
                    type: "XXXVirtualKPI",
                    serialNr: "",
                    connectionString: "Nicht konfiguriert",
                    id: 8,
                    name: "Gas pro GTZ in Heizperiode",
                },
            ],
        },
        status: 200,
    } as any);
    const devicesEndpoint = new DevicesEndpoint(mockedAxios);
    const result = await devicesEndpoint.list({ name: "JanHome", status: "", displayStatus: "" });
    expect(result.length).toBe(5);
});

test("list devices no content", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {},
        status: 204,
    } as any);
    const devicesEndpoint = new DevicesEndpoint(mockedAxios);
    const result = await devicesEndpoint.list({ name: "JanHome", status: "", displayStatus: "" });
    expect(result.length).toBe(0);
});

test("list for unknown project throws RestException", async () => {
    mockedAxios.get.mockResolvedValue({
        data: "Project not found for name: unknown",
        status: 404,
        statusText: "Not found",
    } as any);
    const devicesEndpoint = new DevicesEndpoint(mockedAxios);
    await expect(devicesEndpoint.list("unknown")).rejects.toThrow(
        new RESTException(404, "Not found", "Project not found for name: unknown"),
    );
});
