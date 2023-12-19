import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import { GroupsContext } from "./context";
import Group from "./Group/group";
import LatestThread from "./LatestThread/latestThread";
import "./home.css";
import { CreateNewGroup } from "./AdminControl/admincontrol";

export default function Home() {
    const [groups, setGroups] = useState([]);
    const [adminStatus, setAdminStatus] = useState(false);

    async function readGroups() {
        const response = await instance.get("/group");
        setGroups(response.data);
    };

    async function checkAdmin() {
        try{
        const response = await instance.get("/users/is-admin");
        if (response.status === 200) {
            setAdminStatus(true);
        }}
        catch(e){
            console.log(e);
        }
    };

    useEffect(() => {
        readGroups();
        checkAdmin();
    }, []);

    

    return (
        <>
            <div className="container">
                <div className="row" >
                    <div className="col-8">
                        {groups && groups.map((group) => (
                            <GroupsContext.Provider value={{ groups, setGroups, adminStatus }}>
                                <Group group={group} adminStatus={adminStatus} />
                            </GroupsContext.Provider>
                        ))}
                        <GroupsContext.Provider value={{ groups, setGroups, adminStatus }}>
                            <CreateNewGroup />
                        </GroupsContext.Provider>
                    </div>
                    <div className="col-4">
                        <LatestThread />
                    </div>
                </div>
            </div>
        </>
    );

}