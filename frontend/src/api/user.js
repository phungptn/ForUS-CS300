import { instance } from "./config";

const infoUser = async () => {
    try {
        
        const response = await instance.get("/users/info");
        return response;
        
    } catch (error) {
        console.error(error);
    }
}

export {
    infoUser}