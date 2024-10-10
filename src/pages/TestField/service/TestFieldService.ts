import { axiosInstant } from "@/config/core";
import { TestFieldCreate, TestFieldFilter, TestFieldUpdate } from "../model/type";

export const getTestFields = async (filter?: TestFieldFilter) => {
    const response = await axiosInstant.get("/test-field/page", {
        params: { ...filter }
    });
    return response.data.data;
}

export const createTestField = async (form?: TestFieldCreate) => {
    const response = await axiosInstant.post("/test-field", { ...form });
    return response.data;
}

export const updateTestField = async (testFieldId?: number, form?: TestFieldUpdate) => {
    const response = await axiosInstant.put(`/test-field/${testFieldId}`, { ...form });
    return response.data;
}


export const deleteTestField = async (testFieldId: number) => {
    const response = await axiosInstant.delete(`/test-field/${testFieldId}`);
    return response.data;
}
