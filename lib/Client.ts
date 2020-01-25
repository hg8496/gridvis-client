import axios, { AxiosInstance } from "axios";
import { DevicesEndpoint } from "./device/DevicesEndpoint";
import { ProjectsEndpoint } from "./project/ProjectsEndpoint";
import { HistoricalValuesEndpoint } from "./values/HistoricalValuesEndpoint";
import { TransientsEndpoint } from "./transients/TransientsEndpoint";

export interface IConfiguration {
    url: string;
    username?: string;
    password?: string;
}

export class GridVisClient {
    public readonly projects: ProjectsEndpoint;
    public readonly devices: DevicesEndpoint;
    public readonly values: HistoricalValuesEndpoint;
    public readonly client: AxiosInstance;
    public readonly transients: TransientsEndpoint;

    constructor(configuration: IConfiguration) {
        this.client = axios.create({
            auth: {
                password: configuration.password || "Janitza",
                username: configuration.username || "admin",
            },
            baseURL: configuration.url,
        });
        this.projects = new ProjectsEndpoint(this.client);
        this.devices = new DevicesEndpoint(this.client);
        this.values = new HistoricalValuesEndpoint(this.client);
        this.transients = new TransientsEndpoint(this.client);
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
