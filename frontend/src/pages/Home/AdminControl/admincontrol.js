import { useContext } from "react";
import { instance } from "../../../api/config";
import { GroupsContext } from "../context";
import "./admincontrol.css";

async function askForBox(groups, setGroups, group_id) {
    const boxName = prompt("Enter box name and description (seperated by ','):");
    if (boxName) {
        const [name, description] = boxName.split(",");
        const response = await instance.post(`/group/${group_id}/box`, { name, description });
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
};

async function deleteGroup(groups, setGroups, group_id) {
    const confirm = window.confirm("Are you sure you want to delete this group?\nThis action cannot be undone.");
    if (confirm) {
        const response = await instance.delete(`/group/${group_id}`);
        if (response.status === 200) {
            const updatedGroups = groups.filter((group) => group._id !== group_id);
            setGroups(updatedGroups);
        }
    }
}

async function renameGroup(groups, setGroups, group_id) {
    const newName = prompt("Enter new name:");
    if (newName) {
        const response = await instance.put(`/group/${group_id}`, { name: newName });
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

async function createGroup(groups, setGroups) {
    const groupName = prompt("Enter group name:");
    if (groupName) {
        const response = await instance.post(`/group`, { name: groupName });
        if (response.status === 201) {
            const updatedGroups = [...groups, response.data.group];
            setGroups(updatedGroups);
        }
    }
}

export function GroupControl({ group_id}) {
    let { groups, setGroups, adminStatus } = useContext(GroupsContext);
    if (!adminStatus) return (null);
    return (
        <div className="d-flex">
            <button
                className="btn btn-info text-white btn-sm mx-1"
                type="submit"
                onClick={() => askForBox(groups, setGroups, group_id)}
            >+ Box</button>
            <button
                className="btn btn-info text-white btn-sm mx-1"
                type="submit"
                onClick={() => renameGroup(groups, setGroups, group_id)}
            >🖉 Rename</button>
            <button 
                className="btn btn-danger btn-sm mx-1" 
                type="submit"
                onClick={() => deleteGroup(groups, setGroups, group_id)}
            >X Delete</button>
        </div>
    );
}

export function CreateNewGroup() {
    let { groups, setGroups, adminStatus } = useContext(GroupsContext);
    if (!adminStatus) return (null);
    return (
        <div className="container">
            <div class="card mb-4 rounded-3 shadow-sm border-dashed py-3 text-white" onClick={() => createGroup(groups, setGroups)}>
                <h4>+ New group</h4>
            </div>
        </div>
    );
}