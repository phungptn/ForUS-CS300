import { instance } from "../api/config";

export default async function getCommentLocation(comment_id) {
    try {
        const response = await instance.get(`/comment/${comment_id}`);
        return response.data.comment;
    } catch (error) {
        console.log(error);
    }
}