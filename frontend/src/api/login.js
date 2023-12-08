import { instance } from "./config";

const login = async (data) => {
    try {
        const response = await instance.post("/users/login", data);
        return response;
    } catch (error) {
        console.error(error);
    }
}

const forgotPassword = async (data) => {
    try {
        const response = await instance.post("/users/forgot-password", data);
        return response;
    } catch (error) {
        console.error(error);
    }
}

const resetPassword = async (data) => {
    try {
        const response = await instance.post("/users/reset-password", data);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export  {
    login,
    forgotPassword,
    resetPassword
}

