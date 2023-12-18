import { instance } from "./config";

const infoUser = async () => {
    try {
        
        const response = await instance.get("/users/info");
        return response;
        
    } catch (error) {
        console.error(error);
    }

    return null;
}

const logout = async () => {
    try {
        const response = await instance.post("/users/logout");
        return response;
    } catch (error) {
        console.error(error);
    }
}

const updateProfile = async (data) => {
    try {
        const response = await instance.put("/users/update-profile", data);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export {logout,
    infoUser, updateProfile}