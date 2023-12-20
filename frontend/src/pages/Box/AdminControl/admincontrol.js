import { useNavigate } from "react-router-dom";
import { instance } from "../../../api/config";
import { useContext } from "react";
import { BoxContext } from "../context";

async function deleteBox(navigate, box_id) {
    const confirm = window.confirm("Are you sure you want to delete this box?\nThis action cannot be undone.");
    if (confirm) {
        const response = await instance.delete(`/box/${box_id}`);
        if (response.status === 200) {
            navigate(-1)
        }
    }
}

function DeleteBoxButton({ box }) {
    const navigate = useNavigate();
    return (
        <button class="btn btn-danger" onClick={() => deleteBox(navigate, box._id)}>
            <i class="bi bi-trash"/> Xóa box
        </button>
    );
}

function AddModeratorButton({ box }) {
    return (
        <button class="btn btn-info text-white">
            <i class="bi bi-person-plus-fill"/> Thêm moderator
        </button>
    );
}

export function BoxControl({ box }) {
    const { adminStatus } = useContext(BoxContext);
    if (!adminStatus) return (null);
    return (
        <div class="card-footer d-flex flex-row justify-content-center gap-2">
            <AddModeratorButton box={box} />
            <DeleteBoxButton box={box} />
        </div>
    );
}