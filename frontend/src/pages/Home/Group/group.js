import { BoxCard } from "../BoxCard/boxcard";
import { GroupControl } from "../AdminControl/admincontrol";

export default function Group({ group }) {
  return (
    <div className="container ">
      <div className="col text-start">
        <div className="card mb-4 rounded-3 shadow-sm bg-white  ">
          <div className="d-flex justify-content-between card-header py-3 bg-primary text-white">
            <h4 className="m-0">{ group.name }</h4>
            <GroupControl group_id={group._id}/>
          </div>
          <div className="card-body p-0">
            
            <ul className="list-unstyled mb-0">
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
