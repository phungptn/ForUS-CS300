// import "./profile.css";
import React, { useState, useEffect } from "react";
import { storage } from "../../../Firebase/config";
import { downloadImage } from "../../../utils/loadImage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import "./management.css";
import { updateProfile, updatePassword, infoUser } from "../../../api/user";

const Table = ({
  threadId,
  timeCreated,
  subForum,
  box,
  author,
  upDown,
  replies,
}) => {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <td>Thread ID</td>
            <td>Time created</td>
            <td>Subforum</td>
            <td>Box</td>
            <td>Author</td>
            <td>Checkbox</td>
          </tr>
        </thead>
        <tbody>
          {/* Render 20 rows with user data */}
          {threadId.map((id, index) => (
            <tr key={index}>
              <td>{id}</td>
              <td>Time created</td>
              <td>Subforum</td>
              <td>Box</td>
              <td>Author</td>
              <td>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={checked ? "flexCheckDefault" : "flexCheckChecked"}
                    onClick={
                      checked ? () => setChecked(false) : () => setChecked(true)
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("user");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // [file, setFile]
  const [avatar, setAvatar] = useState("");
  const threadId = [1, 2, 3];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await infoUser();
        console.log(response);
        if (response.status === 200) {
          setFullname(response.data.user.fullname);
          setEmail(response.data.user.email);
          setStudentId(response.data.user.username);
          setAddress(response.data.user.address);
          setBio(response.data.user.description);

          const imageUrl = await downloadImage(
            "images/avatar/" + response.data.user.avatarUrl
          );
          console.log(imageUrl);
          setAvatar(imageUrl);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const uploadImage = async () => {
    try {
      if (avatarFile == null) return;
      const imgRef = v4();

      const imageRef = ref(storage, `images/avatar/${imgRef}`);
      await uploadBytes(imageRef, avatarFile);
      return imgRef;
    } catch (e) {
      console.log(e);
    }
  };

  const updatePasswordFunction = async () => {
    try {
      const data = {
        currentPassword,
        newPassword,
        confirmNewPassword,
      };
      const response = await updatePassword(data);
      console.log(response);
      if (response.status === 200) {
        alert("Update password successfully");
      }
    } catch (e) {
      alert("Update password failed");
      console.log(e);
    }
  };

  const updateProfileFunction = async () => {
    try {
      const avatarUrl = await uploadImage();
      console.log(avatarUrl);

      const data = {
        fullname,
        email,
        studentId,
        description: bio,
        address,
        avatarUrl,
      };
      const response = await updateProfile(data);
      console.log(response);
      alert("Update profile successfully");
    } catch (e) {
      console.log(e);
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById("uploadAvatar").click();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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

                <button
                  className={`nav-link ${
                    activeTab === "thread" ? "active" : ""
                  } + text-white`}
                  id="nav-password-tab"
                  onClick={() => handleTabClick("thread")}
                >
                  Threads
                </button>

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
                <div className="d-flex flex-column align-items-start">
                  {/* First Element: Search Bar and New User Button */}
                  <div className="d-flex align-items-center">
                    {/* <SearchBar />{" "} */}
                    {/* Replace with your actual SearchBar component */}
                    <button className="btn btn-primary ms-3">New User</button>
                  </div>

                  {/* Second Element: Tools */}
                  <div className="container-fluid mt-3">
                    <div className="d-flex">
                      <select className="form-select me-3 w-auto">
                        <option>Sort by...</option>
                        {/* Add sorting options here */}
                      </select>
                      <div className="btn-group ms-auto">
                        <button className="btn btn-secondary">Tool 1</button>
                        <button className="btn btn-secondary">Tool 2</button>
                        <button className="btn btn-secondary">Tool 3</button>
                      </div>
                    </div>
                  </div>

                  {/* Third Element: Table */}
                  <table className="table mt-3 table-striped table-info">
                    <thead className="thead-dark">
                      <tr>
                        <th>Avatar</th>
                        <th>Student ID</th>
                        <th>Fullname</th>
                        <th>Faculty</th>
                        <th>Gender</th>
                        <th>Status</th>
                        <th>Year</th>
                        <th>Checkbox</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render 20 rows with user data */}
                      {Array.from({ length: 20 }, (_, index) => (
                        <tr key={index}>
                          <td>Avatar</td>
                          <td>Student ID</td>
                          <td>Fullname</td>
                          <td>Faculty</td>
                          <td>Gender</td>
                          <td>Status</td>
                          <td>Year</td>
                          <td>Checkbox</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

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
              <div
                className={`tab-pane fade ${
                  activeTab === "thread" ? "show active" : ""
                }`}
                id="nav-password"
                role="tabpanel"
                aria-labelledby="nav-password-tab"
              >
                <div className="order-md-1 text-start ">
                  <h1 className="mb-3 text-white">Pending threads</h1>

                  <div className="d-flex flex-column align-items-start">
                    {/* First Element: Search Bar and New User Button */}
                    <div className="d-flex align-items-center">
                      {/* <SearchBar />{" "} */}
                      {/* Replace with your actual SearchBar component */}
                      <button className="btn btn-primary ms-3">New User</button>
                    </div>

                    {/* Second Element: Tools */}
                    <div className="container-fluid mt-3">
                      <div className="d-flex">
                        <select className="form-select me-3 w-auto">
                          <option>Sort by...</option>
                          {/* Add sorting options here */}
                        </select>
                        <div className="btn-group ms-auto">
                          <button className="btn btn-secondary">Tool 1</button>
                          <button className="btn btn-secondary">Tool 2</button>
                          <button className="btn btn-secondary">Tool 3</button>
                        </div>
                      </div>
                    </div>

                    {/* Third Element: Table */}
                    <Table threadId={threadId} />

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
