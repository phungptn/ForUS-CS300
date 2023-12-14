import { infoUser } from '../api/user';
export default async function isLogin () {
    try {
        const response = await infoUser();
        return !!response.data.user;
    } catch (e) {}
    
    return false;
}