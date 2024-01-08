import { instance } from "../../../api/config";
import { useContext, useState } from "react";
import { BoxContext } from "../context";
import { DeleteModal } from "../../Modal/modal";

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

export function DeleteThreadButton({thread}) {
    const { box, setBox, moderatorStatus, setAutoRedirect } = useContext(BoxContext);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    async function deleteThread(thread_id) {
        try {
            const response = await instance.delete(`/thread/${thread_id}`);
            if (response.status === 200) {
                const newThreads = box.threads.filter((thread) => thread._id !== thread_id);
                setBox({ ...box, threads: newThreads });
                if (newThreads.length === 0) {
                    setAutoRedirect(true);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    if (moderatorStatus === 'user') {
        return (null);
    }
    return (
        <>
            <button type="button" title="Xóa thread" className="btn btn-danger text-white rounded-2" style={{marginInlineStart: '12px', width: '48px', height: '48px', flexShrink: 0}} onClick={() => openModal()}>
                <i className="bi bi-trash"/>
            </button>

            {/* Modal */}
            <DeleteModal
                isOpen={isModalOpen}
                handleClose={() => closeModal()}
                handleDelete={() => {deleteThread(thread._id); closeModal()}}
                modalTitle="Xóa thread"
                modalContent="Bạn có chắc chắn muốn xóa thread này không?"
            />
        </>
    );
}

export function UpdateAutoApproveButton({thread, autoApprove}) {
    const { box, setBox, moderatorStatus } = useContext(BoxContext);
    async function autoApproveBox() {
        try {
            const response = await instance.put(`/box/${box._id}/autoapprove`, {});
            console.log(response);
            if (response.status === 200) {
                setBox({ ...box, autoApprove: response.data.autoApprove });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    if (moderatorStatus === 'user') {
        return (null);
    }
    return (
        <button type="button" className="btn btn-info text-white col rounded-0 border-end" onClick={autoApproveBox}>
            Tự động duyệt: {autoApprove ? "Bật" : "Tắt"}
        </button>
    );
}