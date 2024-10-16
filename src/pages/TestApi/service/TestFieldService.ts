import { axiosInstant } from "@/config/core";
import { TestApiCreate, TestApiFilter, TestApiUpdate } from "../model/type";

export const getTestApis = async (filter?: TestApiFilter) => {
    const response = await axiosInstant.get("/test-api/page", {
        params: { ...filter }
    });
    return response.data.data;
}

export const getTestApiById = async (id: number) => {
    const response = await axiosInstant.get(`/test-api/${id}`);
    return response.data;
}

export const createTestApi = async (form?: TestApiCreate) => {
    const response = await axiosInstant.post("/test-api", { ...form });
    return response.data;
}

export const updateTestApi = async (testApiId?: number, form?: TestApiUpdate) => {
    const response = await axiosInstant.put(`/test-api/${testApiId}`, { ...form });
    return response.data;
}


export const deleteTestApi = async (testApiId: number) => {
    const response = await axiosInstant.delete(`/test-api/${testApiId}`);
    return response.data;
}


export const getJsonBodyExampleTestApi = async (testApiId: number) => {
    const response = await axiosInstant.get(`/test-api/json-body`, {
        params: {
            id: testApiId
        }
    });
    return response.data;
}


export const requestToTestApi = async (testApiId: number) => {
    const response = await axiosInstant.post(`/test-api/request/valid-api`, {}, {
        params: {
            id: testApiId
        }
    });
    return response.data;
}

export const requestToInvalidTestApi = async (testApiId: number) => {
    const response = await axiosInstant.post(`/test-api/request/invalid-api`, {}, {
        params: {
            id: testApiId
        }
    });
    return response.data;
}