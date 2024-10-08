import { axiosInstant } from "@/config/core";
import { ProjectCreate, ProjectFilter, ProjectUpdate } from "@/pages/Project";

const getProjects = async (filter?: ProjectFilter) => {
    const response = await axiosInstant.get("/projects/page", {
        params: { ...filter }
    });
    return response.data.data;
}

const getChildProjectByParentId = async (parentId?: number) => {
    const response = await axiosInstant.get("/projects/parent", {
        params: {
            parentId: parentId
        }
    });
    return response.data;
}

const createProjects = async (form?: ProjectCreate) => {
    const response = await axiosInstant.post("/projects", { ...form });
    return response.data;
}

const updateProjects = async (projectId?: number, form?: ProjectUpdate) => {
    const response = await axiosInstant.put(`/projects/${projectId}`, { ...form });
    return response.data;
}


const deleteProject = async (projectId: number) => {
    const response = await axiosInstant.delete(`/projects/${projectId}`);
    return response.data;
}
export { getProjects, createProjects, updateProjects, deleteProject, getChildProjectByParentId };
