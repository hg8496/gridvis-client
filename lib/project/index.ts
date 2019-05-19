import { IProject } from "./IProject";

export { IProject } from "./IProject";
export { ProjectsEndpoint } from "./ProjectsEndpoint";

export function getProjectId(project: string | IProject): string {
    return typeof project === "string" ? project : project.name;
}
