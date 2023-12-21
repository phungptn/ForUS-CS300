import { instance } from "../../../api/config";
import { useContext } from "react";
import { BoxContext } from "../context";


export function RenameBoxButton() {
    const { box, setBox, moderatorStatus } = useContext(BoxContext);
    async function renameBox() {
        const name = prompt("Enter new box name:");
        if (name) {
            try {
                const response = await instance.put(`/box/${box._id}/name`, { name: name });
                if (response.status === 200) {
                    setBox({ ...box, name: name });
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    if (moderatorStatus === 'user') {
        return (null);
    }
    return (
        <button type="button" className="btn btn-info text-white col rounded-0 border-end" onClick={renameBox}>
            <div className="text-center">
                <i className="bi bi-pencil-square"/>
            </div>Đổi tên
        </button>
    );
}

export function ChangeBoxDescriptionButton() {
    const { box, setBox, moderatorStatus } = useContext(BoxContext);
    async function changeBoxDescription() {
        const description = prompt("Enter new box description:");
        if (description) {
            try {
                const response = await instance.put(`/box/${box._id}/description`, { description: description });
                if (response.status === 200) {
                    setBox({ ...box, description: description });
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    if (!moderatorStatus) {
        return null;
    }
    return (
        <button type="button" className="btn btn-info text-white col rounded-0 border-end" onClick={changeBoxDescription}>
            <div className="text-center">
                <i className="bi bi-pencil-square me-2"/>
            </div>Đổi mô tả
        </button>
    );
}

export function DeleteThreadButton() {
    const { box, setBox, moderatorStatus } = useContext(BoxContext);
    async function deleteThread(thread_id) {
        try {
            const response = await instance.delete(`/thread/${thread_id}`);
            if (response.status === 200) {
                setBox({ ...box, threads: box.threads.filter((thread) => thread._id !== thread_id) });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    if (moderatorStatus === 'user') {
        return null;
    }
    return (
        <button type="button" className="btn btn-danger text-white rounded-0" onClick={() => deleteThread(box._id)}>
            <i className="bi bi-trash"/>
        </button>
    );
}