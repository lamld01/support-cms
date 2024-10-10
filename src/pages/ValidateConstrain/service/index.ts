import { axiosInstant } from "@/config/core";
import { ValidateConstrainCreate, ValidateConstrainFilter, ValidateConstrainUpdate } from "../model/type";

export const getValidateConstrains = async (filter?: ValidateConstrainFilter) => {
    const response = await axiosInstant.get("/validate-constrains/page", {
        params: { ...filter, sort: filter?.sort }
    });
    return response.data.data;
}

export const createValidateConstrains = async (form?: ValidateConstrainCreate) => {
    const response = await axiosInstant.post("/validate-constrains", { ...form });
    return response.data;
}

export const updateValidateConstrains = async (validateConstrainId?: number, form?: ValidateConstrainUpdate) => {
    const response = await axiosInstant.put(`/validate-constrains/${validateConstrainId}`, { ...form });
    return response.data;
}


export const deleteValidateConstrain = async (validateConstrainId: number) => {
    const response = await axiosInstant.delete(`/validate-constrains/${validateConstrainId}`);
    return response.data;
}
