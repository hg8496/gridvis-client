import axios from "axios";
import { RESTException } from "../..";
import { ProjectsEndpoint } from "../ProjectsEndpoint";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

const PROJECT = {
    displayStatus: "Bereit",
    name: "JanHome",
    numberOfDevices: 5,
    path: "/opt/GridVisProjects/JanHome",
    status: "Ready",
};

test("list", async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            project: [PROJECT],
        },
        status: 200,
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    const result = await project.list();
    expect(result.length).toBe(1);
});

test("get for name", async () => {
    mockedAxios.get.mockResolvedValue({
        data: PROJECT,
        status: 200,
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    const result = await project.get("JanHome");
    expect(result.name).toBe("JanHome");
});

test("get for name not found", async () => {
    mockedAxios.get.mockResolvedValue({
        data: "Project not found",
        status: 404,
        statusText: "Not found",
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    await expect(project.get("Unknown")).rejects.toThrow(new RESTException(404, "Not found", "Project not found"));
});

test("get for project", async () => {
    mockedAxios.get.mockResolvedValue({
        data: PROJECT,
        status: 200,
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    const result = await project.get(PROJECT);
    expect(result.name).toBe("JanHome");
});

test("fail with internal server error", async () => {
    mockedAxios.get.mockResolvedValue({
        data: "",
        status: 500,
        statusText: "Internal server error",
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    await expect(project.list()).rejects.toThrow(new RESTException(500, "Internal server error"));
});

test("Return empty response", async () => {
    mockedAxios.get.mockResolvedValue({
        data: "",
        status: 204,
    } as any);
    const project = new ProjectsEndpoint(mockedAxios);
    const result = await project.list();
    expect(result.length).toBe(0);
});
