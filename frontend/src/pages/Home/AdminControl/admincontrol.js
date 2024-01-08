import { useContext, useState } from "react";
import { instance } from "../../../api/config";
import { GroupsContext } from "../context";
import { DeleteModal } from "../../Modal/modal";
import { Modal } from "../../Modal/modal";
import "./admincontrol.css";

async function askForBox(groups, setGroups, group_id) {
  const boxName = prompt("Enter box name and description (seperated by ','):");
  if (boxName) {
    const [name, description] = boxName.split(",");
    const response = await instance.post(`/group/${group_id}/box`, {
      name,
      description,
    });
    if (response.status === 200) {
      const updatedGroups = groups.map((group) => {
        if (group._id === group_id) {
          group.boxes.push(response.data.box);
        }
        return group;
      });
      setGroups(updatedGroups);
    }
  }
}

async function deleteGroup(groups, setGroups, group_id) {
  const response = await instance.delete(`/group/${group_id}`);
  if (response.status === 200) {
    const updatedGroups = groups.filter((group) => group._id !== group_id);
    setGroups(updatedGroups);
  }
}

async function renameGroup(groups, setGroups, group_id) {
  const newName = prompt("Enter new name:");
  if (newName) {
    const response = await instance.put(`/group/${group_id}`, {
      name: newName,
    });
    if (response.status === 200) {
      const updatedGroups = groups.map((group) => {
        if (group._id === group_id) {
          group.name = newName;
        }
        return group;
      });
      setGroups(updatedGroups);
    }
  }
}

async function createGroup(groups, setGroups, groupName) {
  if (groupName) {
    const response = await instance.post(`/group`, { name: groupName });
    if (response.status === 201) {
      const updatedGroups = [...groups, response.data.group];
      setGroups(updatedGroups);
    }
  }
}

export function GroupControl({ group_id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  let { groups, setGroups, adminStatus } = useContext(GroupsContext);
  if (!adminStatus) return null;
  return (
    <>
      <div className="d-flex">
        <button
          className="btn btn-info text-white btn-sm mx-1"
          type="submit"
          onClick={() => askForBox(groups, setGroups, group_id)}
        >
          <i className="bi bi-plus-lg"></i> Tạo box mới
        </button>
        <button
          className="btn btn-info text-white btn-sm mx-1"
          type="submit"
          onClick={() => renameGroup(groups, setGroups, group_id)}
        >
          <i className="bi bi-pencil"></i> Đổi tên
        </button>
        <button
          className="btn btn-danger text-white btn-sm mx-1"
          type="submit"
          onClick={() => openModal()}
        >
          <i className="bi bi-trash3"></i> Xóa group
        </button>
      </div>

      {/* Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        handleClose={() => closeModal()}
        handleDelete={() => {
          deleteGroup(groups, setGroups, group_id);
          closeModal();
        }}
        modalTitle="Xóa group"
        modalContent="Bạn có chắc chắn muốn xóa group này không?"
      />
    </>
  );
}

export function CreateNewGroup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  let { groups, setGroups, adminStatus } = useContext(GroupsContext);

  const openModal = () => {
      setIsModalOpen(true);
      document.querySelectorAll("#report-content-textarea").forEach(e => (e.value = ""));
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };
  
  if (!adminStatus) return null;
  return (
    <>
      <div
        className="card mb-4 rounded-3 shadow-sm btn-newgroup py-3 text-white"
        onClick={() => openModal()}
      >
        <h4 className="user-select-none">
          <i className="bi bi-plus-lg"></i> Tạo group mới
        </h4>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => closeModal()}
      >
        <Modal.Header>Tạo group</Modal.Header>
        <Modal.Body>
          <p> Tên group: </p>
          <input
            id="report-content-textarea"
            style={{ width: "100%" }}
            rows="1"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Modal.DismissButton className="btn btn-danger">Đóng</Modal.DismissButton>
          <button className="btn btn-primary" onClick={() => {createGroup(groups, setGroups, groupName); setGroupName(''); closeModal()}}>Tạo</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}