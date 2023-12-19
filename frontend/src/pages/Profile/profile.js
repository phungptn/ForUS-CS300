// import "./profile.css";
import React, { useState } from "react";
import { storage } from "../../Firebase/config";
import { updateProfile, updatePassword } from "../../api/user";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setCookie } from "../../utils/setCookie";
import { v4 } from "uuid";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  // const [avatarUrl, setAvatarUrl] = useState("");

  const uploadImage = () => {
    if (avatarUrl == null) return;
    let imgRef = v4();
    const imageRef = ref(storage, `images/avatar/${imgRef}`);
    setAvatarUrl(imgRef);
    uploadBytes(imageRef, avatarUrl).then((snapshot) => {
      console.log("Image uploaded successfully");
    });
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
      await uploadImage();
      const data = {
        fullname,
        email,
        studentId,
        description: bio,
        address,
        avatarUrl,
        // avatarUrl
      };
      const response = await updateProfile(data);
      console.log(response);
      alert("Update profile successfully");
    } catch (e) {
      console.log(e);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {/* <meta name="description" content />
      <meta name="author" content /> */}
      <link rel="icon" href="/docs/4.0/assets/img/favicons/favicon.ico" />
      <title>Checkout example for Bootstrap</title>

      <link
        rel="canonical"
        href="https://getbootstrap.com/docs/4.0/examples/checkout/"
      />
      {/* Bootstrap core CSS */}
      <link href="../../dist/css/bootstrap.min.css" rel="stylesheet" />

      {/* Custom styles for this template */}
      <link href="form-validation.css" rel="stylesheet" />
      <div className="py-5 container bg-info rounded-3 shadow-sm">
        <div className="bd-example-snippet bd-code-snippet">
          <div className="bd-example m-0 border-0">
            <nav>
              <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                <button
                  className={`nav-link ${activeTab === "profile" ? "active" : ""} `}
                  id="nav-home-tab"
                  onClick={() => handleTabClick("profile")}
                >
                  Profile
                </button>

                <button
                  className={`nav-link ${activeTab === "password" ? "active" : ""}`}
                  id="nav-password-tab"
                  onClick={() => handleTabClick("password")}
                >
                  Manage Password
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className={`tab-pane fade ${
                  activeTab === "profile" ? "show active" : ""
                }`}
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="nav-profile-tab"
              >
                <div className="order-md-1 text-start">
                  <h1 className="mb-3 text-white">Profile</h1>
                  <form className="needs-validation" noValidate>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName">Full name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          onChange={(e) => setFullname(e.target.value)}
                          required
                        />
                        <div className="invalid-feedback">
                          Valid first name is required.
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName">Student ID</label>
                        <input
                          type="text"
                          className="form-control"
                          id="studentID"
                          onChange={(e) => setStudentId(e.target.value)}
                          // placeholder
                          required
                        />
                        <div className="invalid-feedback">
                          Valid StudentID is required.
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email">Email</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">@</span>
                        </div>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="you@example.com"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        {/* <div className="invalid-feedback">
                    Please enter a valid email address for shipping updates.
                  </div> */}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="1234 Main St"
                        required
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <div className="invalid-feedback">
                        Please enter your address.
                      </div>
                    </div>

                    <hr className="mb-4" />
                    <h4 className="mb-3">More information</h4>
                    <div className="mb-3">
                      <label htmlFor="formFile" className="form-label">
                        Load your avatar
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          setAvatarUrl(e.target.files[0]);
                        }}
                      ></input>
                    </div>

                    <div className="row">
                      <div className="mb-3">
                        <label htmlFor="bio-text" className="form-label">
                          Bio
                        </label>
                        <textarea
                          className="form-control"
                          id="bio-text"
                          rows="3"
                          onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <hr className="mb-4" />
                    <button
                      className="btn btn-warning btn-lg  "
                      type="submit"
                      onClick={(event) => {
                        event.preventDefault();
                        updateProfileFunction();
                      }}
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>
              <div
                className={`tab-pane fade ${
                  activeTab === "password" ? "show active" : ""
                }`}
                id="nav-password"
                role="tabpanel"
                aria-labelledby="nav-password-tab"
              >
                <div className="order-md-1 text-start ">
                  <h1 className="mb-3 text-white">Manage Password</h1>

                  <p>
                    In order to change your password, you will need to provide
                    your current password, as well as your new password and a
                    confirmation of your new password.
                  </p>

                  <div className="   ">
                    <div className="mb-3 row ">
                      <div className="mb-3 col-md-4 "></div>
                      <div className="mb-3 col-md-4  ">
                        <label htmlFor="address">Current Password</label>
                        <input
                          type="password"
                          className="form-control "
                          id="currentPassword"
                          placeholder="***********"
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter your current password.
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 row ">
                      <div className="mb-3 col-md-4 "></div>
                      <div className="mb-3 col-md-4">
                        <label htmlFor="address">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          placeholder="***********"
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter your new password.
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 row ">
                      <div className="mb-3 col-md-4 "></div>

                      <div className="mb-3 col-md-4">
                        <label htmlFor="address">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmNewPassword"
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="***********"
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter your new password.
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-warning btn-lg btn-block "
                      type="submit"
                      onClick={(event) => {
                        event.preventDefault();
                        updatePasswordFunction();
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bootstrap core JavaScript
          ================================================== */}
      {/* Placed at the end of the document so the pages load faster */}
    </div>
  );
}
