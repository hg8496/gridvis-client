import { AxiosInstance } from "axios";
import { RESTException } from "..";
import { IProject } from "./IProject";

export class ProjectsEndpoint {
    constructor(private client: AxiosInstance) {}

    public async get(project: string | IProject): Promise<IProject> {
        const projectName = typeof project === "string" ? project : project.name;
        const projectAnswer = await this.client.get(`rest/1/projects/${projectName}`);
        return { ...projectAnswer.data };
    }

    public async list(): Promise<IProject[]> {
        const result = [] as IProject[];
        const response = await this.client.get("rest/1/projects");
        if (response.status === 200) {
            response.data.project.forEach((project: IProject) => {
                result.push({ ...project });
            });
        } else if (response.status >= 400) {
            throw new RESTException(response.status, response.statusText);
        }
        return result;
    }
}
