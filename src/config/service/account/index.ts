import { axiosInstant } from "@/config/core";
import { SellerAccountFilter } from "@/pages/Account/ui/model/SellerAccount";

const signIn = async (username: string, password: string) => {
    const response = await axiosInstant.post("/public/auth/sign-in", { // Specify the endpoint
        username: username,
        password: password
    });
    return response.data; // Return the response data
};

const getSellerAccount = async (filter?: SellerAccountFilter) => {
    const response = await axiosInstant.get("/accounts/page", {
        params: { ...filter }
    });
    return response.data.data;
}

export { signIn , getSellerAccount};
