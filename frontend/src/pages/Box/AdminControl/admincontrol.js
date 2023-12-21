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

export function DeleteBoxButton() {
    const navigate = useNavigate();
    const { box, moderatorStatus } = useContext(BoxContext);
    if (moderatorStatus !== 'admin') {
        return null;
    }
    return (
        <button type="button" className="col btn btn-danger rounded-0" onClick={() => deleteBox(navigate, box._id)}>
            <div className="text-center">
                <i className="bi bi-trash-fill me-2"/>
            </div>Xóa box
        </button>
    );
};