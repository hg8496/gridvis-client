import axios from "axios";
import { ProjectsEndpoint } from "../ProjectsEndpoint";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

test("list", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            project: [
                {
                    status: "Ready",
                    path: "/opt/GridVisProjects/JanHome",
                    numberOfDevices: 5,
                    displayStatus: "Bereit",
                    name: "JanHome",
                },
            ],
        },
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    const result = await project.list();
    expect(result.length).toBe(1);
});

test("get for name", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            status: "Ready",
            path: "/opt/GridVisProjects/JanHome",
            numberOfDevices: 5,
            displayStatus: "Bereit",
            name: "JanHome",
        },
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    const result = await project.get("JanHome");
    expect(result.name).toBe("JanHome");
});

test("get for project", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            status: "Ready",
            path: "/opt/GridVisProjects/JanHome",
            numberOfDevices: 5,
            displayStatus: "Bereit",
            name: "JanHome",
        },
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    const result = await project.get({
        name: "JanHome",
        displayStatus: "",
        numberOfDevices: 0,
        path: "",
        status: "Ready",
    });
    expect(result.name).toBe("JanHome");
});
