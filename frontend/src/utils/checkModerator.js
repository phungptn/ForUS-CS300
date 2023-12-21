import { instance } from "../api/config";

export async function checkModerator(box_id, setModeratorStatus) {
    try {
        const response = await instance.get(`/box/${box_id}/is-moderator`);
        if (response.status === 200) {
            setModeratorStatus(response.data.moderatorStatus);
        }
    }
    catch (e) {
        console.log(e);
    }
}