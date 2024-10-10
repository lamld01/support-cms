interface ProjectFilter {
    projectName ?: string,
    page : number,
    size : number,
    sort : string
}

interface Project {
    id: number,
    accountId: number,
    parentProjectId: number,
    rootProjectId: number,
    projectName: string,
    description: string,
    apiBaseUrl: string,
    token: string,
    childProjects?: Project[]; // Nested child projects
    isExpanded?: boolean; // Tracks if this project is expanded
}

interface ProjectCreate {
    parentProjectId?: number,
    rootProjectId?: number,
    projectName: string,
    description: string,
    apiBaseUrl: string,
    token: string,
}

interface ProjectUpdate {
    parentProjectId?: number,
    projectName: string,
    description: string,
    apiBaseUrl: string,
    token: string,
}

export type {ProjectFilter, Project, ProjectCreate, ProjectUpdate}