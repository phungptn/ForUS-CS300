import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import { GroupsContext } from "./context";
import Group from "./Group/group";
import LatestThread from "./LatestThread/latestThread";
import News from "./News/news";
import { checkAdmin } from "../../utils/checkAdmin";
import "./home.css";
import { CreateNewGroup, Management } from "./AdminControl/admincontrol";

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [adminStatus, setAdminStatus] = useState(false);

  async function readGroups() {
    const response = await instance.get("/group");
    setGroups(response.data);
  }

  useEffect(() => {
    // readGroups();
    //checkAdmin(setAdminStatus);
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {groups &&
              groups.map((group) => (
                <GroupsContext.Provider
                  value={{ groups, setGroups, adminStatus }}
                >
                  <Group group={group} adminStatus={adminStatus} />
                </GroupsContext.Provider>
              ))}
            <GroupsContext.Provider value={{ groups, setGroups, adminStatus }}>
              <CreateNewGroup />
            </GroupsContext.Provider>
          </div>
          <div className="col-lg-4">
            <News />
          </div>
        </div>
      </div>
    </>
  );
}
