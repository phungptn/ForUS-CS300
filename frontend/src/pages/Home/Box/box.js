import './box.css';
export default function Box() {
  return (
    <div className="container ">
      <div className="col text-start">
        <div className="card mb-4 rounded-3 shadow-sm bg-white  ">
          <div className="card-header py-3 ">
            <h4 className="">Thông báo chung</h4>
          </div>
          <div className="card-body">
            
            <ul className="list-unstyled mt-3 mb-4">
                <li className="mb-2 card-body border-bottom">Các thông báo chung về hoạt động của trường sẽ được cập nhật liên tục tại đây.</li>
                <li className="mb-2 card-body border-bottom">Các thông báo về học tập sẽ được cập nhật liên tục tại đây.</li>

            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}
