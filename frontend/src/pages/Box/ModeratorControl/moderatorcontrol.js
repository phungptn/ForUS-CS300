import { instance } from "../../../api/config";
import { useContext, useState } from "react";
import { BoxContext } from "../context";
import { Modal, DeleteModal } from "../../Modal/modal";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

export function RenameBoxButton() {
    const { box, setBox, moderatorStatus } = useContext(BoxContext);
    const [isChangeBoxNameModalOpen, setIsChangeBoxNameModalOpen] = useState(false);
    const [boxName, setBoxName] = useState('');
    async function renameBox(boxName) {
        if (boxName) {
            try {
                const response = await instance.put(`/box/${box._id}/name`, { name: boxName });
                if (response.status === 200) {
                    setBox({ ...box, name: boxName });
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    const openChangeBoxNameModal = () => {
        setIsChangeBoxNameModalOpen(true);
    };
    const closeChangeBoxNameModal = () => {
        setError({message: ""});
        setBoxName('');
        setIsChangeBoxNameModalOpen(false);
    };
    const [error, setError] = useState({});
    const checkValidBox = (boxName) => {
        if (boxName.length > 128 || boxName.length < 1) {
          setError({message: "Tên box phải từ 1 đến 128 ký tự"});
          console.log(error);
          return;
        }
        renameBox(boxName);
        closeChangeBoxNameModal()
    }
    if (moderatorStatus === 'user') {
        return (null);
    }
    return (
        <>
            <button type="button" className="btn btn-info text-white col rounded-0 border-end" onClick={() => openChangeBoxNameModal()}>
                <div className="text-center">
                    <i className="bi bi-pencil-square"/>
                </div>Đổi tên
            </button>

            <Modal
                isOpen={isChangeBoxNameModalOpen}
                onClose={() => closeChangeBoxNameModal()}
            >
                <Modal.Header><h5 className="text-white">Đổi tên box</h5></Modal.Header>
                <Modal.Body>
                    <div
                        className={`alert alert-danger mx-3 mt-3 d-flex align-items-center font-weight-bold mb-0 ${
                        error.message ? "d-block" : "d-none"
                        }`}
                    >
                        <PriorityHighIcon className="me-2"></PriorityHighIcon>
                        <div className="">{error.message}</div>
                    </div>
                    <div class="form-group">
                        <label className="text-white" for="boxName">Tên mới:</label>
                        <input type="text" class="form-control bg-white" id="boxName" placeholder="Tên box" spellCheck={false} value={boxName} onChange={(e) => setBoxName(e.target.value)}/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Modal.DismissButton className="btn btn-danger">Hủy</Modal.DismissButton>
                    <button className="btn btn-primary" onClick={() => {checkValidBox(boxName)}}>
                        Đổi
                    </button>
                </Modal.Footer>
            </Modal>
        </>
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