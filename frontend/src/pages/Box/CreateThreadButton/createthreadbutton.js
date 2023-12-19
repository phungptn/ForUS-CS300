import { instance } from "../../../api/config";

async function TempCreateThread(box_id) {
    const thread = prompt("Enter thread title and body (seperated by ','):");
    if (thread) {
        let [title, body] = thread.split(",");
        console.log(title, body);
        const response = await instance.post(`/box/${box_id}/thread`, { title: title, body: body });
        if (response.status === 201) {
            window.location.reload();
        }
    }

}


export default function CreateThreadButton({ box_id }) {
    return (
        <button 
            type="button" 
            class="btn btn-info text-white"
            onClick={() => TempCreateThread(box_id)}>Tạo thread mới</button>
    );    
}