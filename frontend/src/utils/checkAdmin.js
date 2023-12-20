import { instance } from "../api/config";

export async function checkAdmin(setAdminStatus) {
    try{
    const response = await instance.get("/users/is-admin");
    if (response.status === 200) {
        setAdminStatus(true);
    }}
    catch(e){
        console.log(e);
    }
};