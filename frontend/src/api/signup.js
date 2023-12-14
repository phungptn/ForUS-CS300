import { instance } from "./config";

const signup = async (data) => {
    try {

        const response = await instance.post("/users/signup", data);
        return response;
        
    } catch (error) {
        console.error(error);
    }
}