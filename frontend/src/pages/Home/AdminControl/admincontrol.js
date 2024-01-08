import { useContext, useState } from "react";
import { instance } from "../../../api/config";
import { GroupsContext } from "../context";
import { DeleteModal } from "../../Modal/modal";
import { Modal } from "../../Modal/modal";
import "./admincontrol.css";

async function askForBox(groups, setGroups, group_id, boxName, boxDescription) {
  if (boxName) {
    const response = await instance.post(`/group/${group_id}/box`, {
      boxName,
      boxDescription,
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
  const [boxName, setBoxName] = useState('');
  const [boxDescription, setBoxDescription] = useState('');

  const [isCreateBoxModalOpen, setIsCreateBoxModalOpen] = useState(false);
  const openCreateBoxModal = () => {
    setIsCreateBoxModalOpen(true);
  };
  const closeCreateBoxModal = () => {
    setBoxName(''); setBoxDescription('');
    setIsCreateBoxModalOpen(false);
  };

  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const openDeleteGroupModal = () => {
    setIsDeleteGroupModalOpen(true);
  };
  const closeDeleteGroupModal = () => {
    setIsDeleteGroupModalOpen(false);
  };

  let { groups, setGroups, adminStatus } = useContext(GroupsContext);
  if (!adminStatus) return null;
  return (
    <>
      <div className="d-flex">
        <button
          className="btn btn-info text-white btn-sm mx-1"
          type="submit"
          onClick={() => openCreateBoxModal()}
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
          onClick={() => openDeleteGroupModal()}
        >
          <i className="bi bi-trash3"></i> Xóa group
        </button>
      </div>

      <Modal
        isOpen={isCreateBoxModalOpen}
        onClose={() => closeCreateBoxModal()}
      >
        <Modal.Header><h5>Tạo box</h5></Modal.Header>
        <Modal.Body>
          <div class="form-group">
            <label for="boxName">Tên box:</label>
            <input type="text" class="form-control bg-white" id="boxName" placeholder="Tên box" spellCheck={false} value={boxName} onChange={(e) => setBoxName(e.target.value)}/>
          </div>
          <div class="form-group">
            <label for="boxDescription">Mô tả của box:</label>
            <textarea type="text" class="form-control bg-white" id="boxDescription" placeholder="(Ít nhất 32 ký tự)" rows="3" spellCheck={false} value={boxDescription} onChange={(e) => setBoxDescription(e.target.value)}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.DismissButton className="btn btn-danger">Hủy</Modal.DismissButton>
          <button className="btn btn-primary" onClick={() => {askForBox(groups, setGroups, group_id, boxName, boxDescription); closeCreateBoxModal()}}>
            Tạo
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal */}
      <DeleteModal
        isOpen={isDeleteGroupModalOpen}
        handleClose={() => closeDeleteGroupModal()}
        handleDelete={() => {
          deleteGroup(groups, setGroups, group_id);
          closeDeleteGroupModal();
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
      setGroupName('');
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
        <Modal.Header><h5>Tạo group</h5></Modal.Header>
        <Modal.Body>
          <div class="form-group">
            <label for="groupName">Tên group:</label>
            <input type="text" class="form-control bg-white" id="groupName" placeholder="Tên group" spellCheck={false} value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.DismissButton className="btn btn-danger">Hủy</Modal.DismissButton>
          <button className="btn btn-primary" onClick={() => {createGroup(groups, setGroups, groupName);  closeModal()}}>
            Tạo
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}