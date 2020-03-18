import axios, { AxiosInstance } from "axios";
import { DevicesEndpoint } from "./device";
import { EventsEndpoint } from "./events/EventsEndpoint";
import { ProjectsEndpoint } from "./project";
import { SequencesEndpoint } from "./sequences/SequencesEndpoint";
import { TransientsEndpoint } from "./transients/TransientsEndpoint";
import { ValuesEndpoint } from "./values/ValuesEndpoint";

export interface IConfiguration {
    url: string;
    username?: string;
    password?: string;
}

export class GridVisClient {
    public readonly client: AxiosInstance;
    public readonly devices: DevicesEndpoint;
    public readonly events: EventsEndpoint;
    public readonly projects: ProjectsEndpoint;
    public readonly sequences: SequencesEndpoint;
    public readonly transients: TransientsEndpoint;
    public readonly values: ValuesEndpoint;

    constructor(configuration: IConfiguration) {
        const auth = configuration.password && configuration.username ? {
            password: configuration.password,
            username: configuration.username || "admin",
        } : undefined;
        this.client = axios.create({
            auth,
            baseURL: configuration.url,
            validateStatus: status => {
                return true; // Reject only if the status code is greater than or equal to 500
            },
        });
        this.devices = new DevicesEndpoint(this.client);
        this.events = new EventsEndpoint(this.client);
        this.projects = new ProjectsEndpoint(this.client);
        this.sequences = new SequencesEndpoint(this.client);
        this.transients = new TransientsEndpoint(this.client);
        this.values = new ValuesEndpoint(this.client);
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
