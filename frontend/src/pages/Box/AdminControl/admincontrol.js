import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { BoxContext } from "../context";
import { instance } from "../../../api/config";
import { DeleteModal } from "../../Modal/modal";

async function deleteBox(navigate, box_id) {
    const response = await instance.delete(`/box/${box_id}`);
    if (response.status === 200) {
        navigate(-1)
    }
}

export function DeleteBoxButton() {
    const navigate = useNavigate();
    const { box, moderatorStatus } = useContext(BoxContext);

    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (moderatorStatus !== 'admin') {
        return null;
    }    

    return (
        <>
            <button type="button" className="col btn btn-danger rounded-0" onClick={() => openModal()}>
                <div className="text-center">
                    <i className="bi bi-trash-fill me-2"/>
                </div>Xóa box
            </button>

            {/* Modal */}
            <DeleteModal
                isOpen={isModalOpen}
                handleClose={() => closeModal()}
                handleDelete={() => {deleteBox(navigate, box._id)}}
                modalTitle="Xóa box"
                modalContent="Bạn có chắc chắn muốn xóa box này không?"
            />
        </>
    );
};