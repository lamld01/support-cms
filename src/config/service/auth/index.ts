import { axiosInstant } from "@/config/core";

const signIn = async (username: string, password: string) => {
    const response = await axiosInstant.post("/public/auth/sign-in", { // Specify the endpoint
        username: username,
        password: password
    });
    return response.data; // Return the response data
};

export { signIn };
