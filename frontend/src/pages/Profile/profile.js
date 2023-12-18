// import "./profile.css";
import React, { useState } from "react";
import {storage} from "../../Firebase/config";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";
 
export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [imageUpload, setImageUpload] = useState(null);
  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      console.log("Image uploaded successfully");
      // alert("Image uploaded successfully");
    });

  }

  


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
      <meta name="description" content />
      <meta name="author" content />
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
        <div class="bd-example-snippet bd-code-snippet">
          <div class="bd-example m-0 border-0">
            <nav>
              <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                <button
                  class={`nav-link ${activeTab === "profile" ? "active" : ""} `}
                  id="nav-home-tab"
                  onClick={() => handleTabClick("profile")}
                >
                  Profile
                </button>

                <button
                  class={`nav-link ${activeTab === "password" ? "active" : ""}`}
                  id="nav-password-tab"
                  onClick={() => handleTabClick("password")}
                >
                  Manage Password
                </button>
              </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
              <div
                class={`tab-pane fade ${
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
                          placeholder
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
                          id="lastName"
                          placeholder
                          required
                        />
                        <div className="invalid-feedback">
                          Valid last name is required.
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
                      />
                      <div className="invalid-feedback">
                        Please enter your address.
                      </div>
                    </div>

                    <hr className="mb-4" />
                    <h4 className="mb-3">More information</h4>
                    <div class="mb-3">
                      <label for="formFile" class="form-label">
                        Load your avatar
                      </label>
                      <input
                        class="form-control"
                        type="file"
                        id="formFile"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          setImageUpload(e.target.files[0])}}
                      ></input>
                    </div>

                    <div className="row">
                      <div class="mb-3">
                        <label for="bio-text" class="form-label">
                          Bio
                        </label>
                        <textarea
                          class="form-control"
                          id="bio-text"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                    <hr className="mb-4" />
                    <button
                      className="btn btn-warning btn-lg  "
                      type="submit"
                      onClick={(event) => {
                        event.preventDefault();
                        
                        uploadImage()}}
                      
                    >
                      Update
                    </button>

                  </form>
                </div>
              </div>
              <div
                class={`tab-pane fade ${
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
                          id="newPassword"
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
