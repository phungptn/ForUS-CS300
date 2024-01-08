// import "./profile.css";
import React, { useState, useEffect } from "react";
import { storage } from "../../../Firebase/config";
import { downloadImage } from "../../../utils/loadImage";
import "./management.css";
import { ReportModal } from "../../Modal/modal";
import { getAllUsers } from "../../../api/user";
import { getTimePassed } from "../../../utils/getTimePassed";

const UserTable = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [checked, setChecked] = useState(Array(0).fill(false));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log(response);
        // Check if the request was successful (status code 200)
        if (response.status === 200) {
          // Update the state with the received user data
          setUsers(response.data.users);
        } else {
          // Handle other status codes (optional)
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error("Error fetching users:", error.message);
      }
    };

    // Call the fetchUsers function when the component mounts
    fetchUsers();
  }, []); // The empty dependency array ensures that this effect runs once, similar to componentDidMount

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setChecked(Array(users.length).fill(!selectAll));
  };

  const handleCheckboxChange = (index) => {
    const updatedChecked = [...checked];
    updatedChecked[index] = !updatedChecked[index];
    setChecked(updatedChecked);
    setSelectAll(updatedChecked.every((isChecked) => isChecked));
  };

  return (
    <table className="table mt-3 table-striped table-info justify-content-center">
      <thead className="thead-dark">
        <tr>
          <th>Avatar</th>
          <th>Username</th>
          <th>Fullname</th>
          <th>Email</th>
          <th>Role</th>
          <th>Last Accessed</th>
          <th>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="selectAllCheckbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>
              <img
                src={
                  user.avatarUrl
                    ? user.avatarUrl
                    : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                }
                className="avatar-img rounded-5 centered-and-cropped"
                id="avatarImage"
                alt="avatar"
              />
            </td>
            <td>{user.username}</td>
            <td>{user.fullname}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{getTimePassed(user.lastAccessed)}</td>
            <td className="align-middle">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id={`flexCheckChecked_${index}`}
                  checked={checked[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// const ThreadTable = ({
//   threadId,
//   timeCreated,
//   subForum,
//   box,
//   author,
//   upDown,
//   replies,
// }) => {
//   const [checked, setChecked] = useState(false);
//   return (
//     <>
//       <table className="table mt-3 table-striped table-info justify-content-center">
//         <thead className="thead-dark">
//           <tr>
//             <td>Thread ID</td>
//             <td>Time created</td>
//             <td>Subforum</td>
//             <td>Box</td>
//             <td>Author</td>
//             <td>UpDown</td>
//             <td>Replies</td>
//             <td>Checkbox</td>
//           </tr>
//         </thead>
//         <tbody>
//           {/* Render rows with data */}
//           {threadId.map((tId, index) => (
//             <tr key={index}>
//               <td>{tId}</td>
//               <td>{timeCreated[index]}</td>
//               <td>{box[index]}</td>
//               <td>{subForum[index]}</td>
//               <td>{author[index]}</td>
//               <td>
//                 {upDown[index][0]}/{upDown[index][1]}
//               </td>
//               <td>{replies[index]}</td>
//               <td className="d-flex justify-content-center">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     value=""
//                     id={checked ? "flexCheckDefault" : "flexCheckChecked"}
//                     onClick={
//                       checked ? () => setChecked(false) : () => setChecked(true)
//                     }
//                   />
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// };

const ReportTable = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <table className="table mt-3 table-striped table-info justify-content-center">
        <thead className="thead-dark">
          <tr>
            <td>Report ID</td>
            <td>Time created</td>
            <td>Target</td>
            <td>Path</td>
            <td>Reported by</td>
            <td>Tools</td>
          </tr>
        </thead>
        <tbody>
          {/* Render 20 rows with report data */}
          {data.map((id, index) => (
            <tr key={index}>
              <td>{id}</td>
              <td>Time created</td>
              <td>Target</td>
              <td>Path</td>
              <td>Reported by</td>
              <td className="align-middle text-center">
                {/* Second Element: Tools */}
                <div className="btn-group ms-auto">
                  <button
                    className="btn btn-secondary custom-btn-yellow rounded"
                    id="newUserBtn"
                    onClick={() => openModal()}
                  >
                    <i className="bi bi-info-circle"></i> View detail
                    {/* Modal */}
                    <ReportModal
                      isOpen={isModalOpen}
                      handleClose={() => closeModal()}
                      handleDelete={() => {
                        closeModal();
                      }}
                      modalTitle="Report details"
                      modalContent="Đây là chi tiết về report"
                    />
                  </button>
                  <span className="mx-2"></span>
                  <button
                    className="btn btn-secondary custom-btn-green rounded"
                    id="sendNotificationBtn"
                  >
                    <i className="bi bi-check-circle"></i> Resolved
                  </button>
                  <span className="mx-2"></span>
                </div>
              </td>
              {/* Modal */}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default function Management() {
  const [activeTab, setActiveTab] = useState("user");
  const [showSignUp, setShowSignUp] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewUserClick = () => {
    setShowSignUp(true);
  };

  const goToSignUp = () => {
    window.location.href = "/signup";
  };

  //Fake data for report tab
  const reportId = [1, 2, 3];

  return (
    <div className="container">
      <link href="form-validation.css" rel="stylesheet" />
      <div className="py-5 container bg-info rounded-3 shadow-sm">
        <div className="bd-example-snippet bd-code-snippet">
          <div className="bd-example m-0 border-0">
            <nav>
              <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                <button
                  className={`nav-link ${
                    activeTab === "user" ? "active" : ""
                  } text-white`}
                  id="nav-home-tab"
                  onClick={() => handleTabClick("user")}
                >
                  Users
                </button>
                {/* 
                <button
                  className={`nav-link ${
                    activeTab === "thread" ? "active" : ""
                  } + text-white`}
                  id="nav-password-tab"
                  onClick={() => handleTabClick("thread")}
                >
                  Threads
                </button> */}

                <button
                  className={`nav-link ${
                    activeTab === "report" ? "active" : ""
                  } text-white`}
                  id="nav-home-tab"
                  onClick={() => handleTabClick("report")}
                >
                  Reports
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className={`tab-pane fade ${
                  activeTab === "user" ? "show active" : ""
                }`}
                id="nav-user"
                role="tabpanel"
                aria-labelledby="nav-user-tab"
              >
                <div className="order-md-1 text-start ">
                  <h1 className="mb-3 text-white">All users</h1>
                  <div className="d-flex flex-column align-items-start">
                    {/* First Element: Search Bar and New User Button */}
                    <div className="d-flex align-items-center">
                      {/* <SearchBar />{" "} */}
                      {/* Replace with your actual SearchBar component */}
                    </div>

                    {/* Second Element: Tools */}
                    <div className="container-fluid mt-3">
                      <div className="d-flex">
                        <select className="form-select me-3 w-auto">
                          <option>Sort by...</option>
                          {/* Add sorting options here */}
                        </select>
                        <div className="btn-group ms-auto">
                          <button
                            className="btn btn-secondary custom-btn-yellow rounded"
                            id="newUserBtn"
                            onClick={() => goToSignUp()}
                          >
                            <i className="bi bi-person-plus"></i>
                            New user
                          </button>
                          <span className="mx-2"></span>

                          <button
                            className="btn btn-secondary custom-btn-blue rounded"
                            id="sendNotificationBtn"
                          >
                            <i className="bi bi-envelope"></i> Send notification
                          </button>
                          <span className="mx-2"></span>
                        </div>
                      </div>
                    </div>

                    {/* Third Element: Table */}
                    <UserTable />

                    {/* Fourth Element: Pagination Bar
                    <div className="d-flex justify-content-center mt-3">
                      <nav aria-label="Page navigation example">
                        <ul className="pagination">
                          <li className="page-item">
                            <a
                              className="page-link"
                              href="#"
                              aria-label="Previous"
                            >
                              <span aria-hidden="true">&laquo;</span>
                            </a>
                          </li>
                          <li className="page-item">
                            <a className="page-link" href="#">
                              1
                            </a>
                          </li>
                          <li className="page-item">
                            <a className="page-link" href="#" aria-label="Next">
                              <span aria-hidden="true">&raquo;</span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div> */}
                  </div>
                </div>
              </div>
              <div
                className={`tab-pane fade ${
                  activeTab === "report" ? "show active" : ""
                }`}
                id="nav-password"
                role="tabpanel"
                aria-labelledby="nav-password-tab"
              >
                <div className="order-md-1 text-start ">
                  <h1 className="mb-3 text-white">All reports</h1>

                  <div className="d-flex flex-column align-items-start">
                    {/* First Element: Search Bar and New User Button */}
                    <div className="d-flex align-items-center">
                      {/* <SearchBar />{" "} */}
                      {/* Replace with your actual SearchBar component */}
                      {/* <button className="btn btn-primary ms-3">New User</button> */}
                    </div>

                    {/* Second Element: Tools */}
                    <div className="container-fluid mt-3">
                      <div className="d-flex">
                        <select className="form-select me-3 w-auto">
                          <option>Sort by...</option>
                          {/* Add sorting options here */}
                        </select>
                      </div>
                    </div>

                    {/* Third Element: Table */}
                    <ReportTable data={reportId} />

                    {/* Fourth Element: Pagination Bar */}
                    <div className="d-flex justify-content-center mt-3">
                      {/* Render your pagination component here */}
                      {/* Example: */}
                      <nav aria-label="Page navigation example">
                        <ul className="pagination">
                          <li className="page-item">
                            <a
                              className="page-link"
                              href="#"
                              aria-label="Previous"
                            >
                              <span aria-hidden="true">&laquo;</span>
                            </a>
                          </li>
                          <li className="page-item">
                            <a className="page-link" href="#">
                              1
                            </a>
                          </li>
                          {/* Add more page items as needed */}
                          <li className="page-item">
                            <a className="page-link" href="#" aria-label="Next">
                              <span aria-hidden="true">&raquo;</span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
