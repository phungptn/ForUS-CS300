import getCookie from './getCookie';
import { infoUser } from '../api/user';
export default async function isLogin() {
    const token = getCookie('token');
    if (token) {
        const response = await infoUser();
        if (response.data.user) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}