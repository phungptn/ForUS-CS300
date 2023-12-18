import './box.css';
export default function Box() {
  return (
    <div className="container ">
      <div className="col text-start">
        <div class="card mb-4 rounded-3 shadow-sm bg-white  ">
          <div class="card-header py-3 ">
            <h4 className="">Thông báo chung</h4>
          </div>
          <div class="card-body">
            
            <ul class="list-unstyled mt-3 mb-4">
                <li class="mb-2 card-body border-bottom">Các thông báo chung về hoạt động của trường sẽ được cập nhật liên tục tại đây.</li>
                <li class="mb-2 card-body border-bottom">Các thông báo về học tập sẽ được cập nhật liên tục tại đây.</li>

            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}
