import BoxCard from "../BoxCard/boxcard";
import { GroupControl } from "../AdminControl/admincontrol";
import { useContext } from "react";
import { GroupsContext } from "../context";

export default function Group({ group }) {
  let context = useContext(GroupsContext);
  return (
    <div className="container ">
      <div className="col text-start">
        <div class="card mb-4 rounded-3 shadow-sm bg-white  ">
          <div class="d-flex justify-content-between card-header py-3 bg-primary text-white">
            <h4 class="m-0">{ group.name }</h4>
            <GroupsContext.Provider value={context}>
              <GroupControl group_id={group._id}/>
            </GroupsContext.Provider>
          </div>
          <div class="card-body p-0">
            
            <ul class="list-unstyled mb-0">
              {group.boxes && group.boxes.map((box) => (
                <BoxCard box={box} />
              ))}
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}
