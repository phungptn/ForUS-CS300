import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { BoxContext } from "../context";
import { instance } from "../../../api/config";

async function deleteBox(navigate, box_id) {
    const confirm = window.confirm("Are you sure you want to delete this box?\nThis action cannot be undone.");
    if (confirm) {
        const response = await instance.delete(`/box/${box_id}`);
        if (response.status === 200) {
            navigate(-1)
        }
    }
}

export function DeleteBoxButton({ box }) {
    const navigate = useNavigate();
    const { adminStatus } = useContext(BoxContext);
    if (!adminStatus) return (null);
    return (
        <button type="button" class="col btn btn-danger" onClick={() => deleteBox(navigate, box._id)}>
            <i class="bi bi-trash"/> Xóa box
        </button>
    );
};