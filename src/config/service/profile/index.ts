import { axiosInstant } from "@/config/core";
import { SellerProfileFilter, SuperAdminCreateForm } from "@/pages/Profile";

const createSuperAdminProfile = async (data: SuperAdminCreateForm) => {
    const response = await axiosInstant.post("/v1/seller/profile", data);
    return response.data; // Return the response data
};

const getSellerProfile = async (filter?: SellerProfileFilter) => {
    const response = await axiosInstant.get("/v1/seller/profile/page", {
        params: { ...filter }
    });
    return response.data.data;
}

export { createSuperAdminProfile, getSellerProfile };