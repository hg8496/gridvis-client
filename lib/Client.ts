import axios, { AxiosInstance } from "axios";
import { ProjectsEndpoint } from "./project/ProjectsEndpoint";

export interface IConfiguration {
    url: string;
    username?: string;
    password?: string;
}

export class GridVisClient {
    public projects: ProjectsEndpoint;
    private readonly client: AxiosInstance;
    constructor(configuration: IConfiguration) {
        this.client = axios.create({
            auth: {
                password: configuration.password || "Janitza",
                username: configuration.username || "admin",
            },
            baseURL: configuration.url,
        });
        this.projects = new ProjectsEndpoint(this.client);
    }

    public async fetchGridVisVersion(): Promise<string> {
        let result = "";
        try {
            const answer = await this.client.get("/rest/common/info/version/full");
            result = answer.data.value;
        } catch (e) {
            console.log(e);
        }
        return result;
    }
}
