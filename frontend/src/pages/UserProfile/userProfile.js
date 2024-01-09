import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import { downloadImage } from "../../utils/loadImage";

import { instance } from "../../api/config";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [fullname, setFullname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const user_id = useParams().user_id;
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    async function getUser() {
      const response = await instance.get(`/users/${user_id}`);
      if (response.status === 200) {
        console.log(response.data);
        const user = response.data.user;
        const avatar = await downloadImage("images/avatar/" + user.avatarUrl);
        setAvatar(avatar);
        setFullname(user.fullname);
        setStudentId(user.username);
        setEmail(user.email);
        setAddress(user.address);
        setBio(user.description);
        setBanned(response.data.user.isBanned);
        console.log(user);
      }
    }
    getUser();
  }, [user_id]);

  const handleBanButtonClick = async (user_id) => {
    try {
      let response = await instance.post(`/users/${banned ? "unban" : "ban"}`, {
        user_id,
      });
      setBanned(response.data.status);
    } catch (e) {
      console.log("Errors", e);
    }
  };

  return (
    <div className="container ">
      <div className="py-5 container bg-info rounded-3 shadow-sm">
        <div className="order-md-1 text-start">
          <h1 className="mb-3 text-white">Profile</h1>
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="text-center">
                <div>
                  <label htmlFor="avatar" className="form-label">
                    Avatar
                  </label>
                </div>

                <img
                  src={
                    avatar
                      ? avatar
                      : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                  }
                  className="rounded-5 text-center centered-and-cropped"
                  id="avatarImage"
                  alt="avatar"
                  width="150"
                  height="150"
                />
              </div>
            </div>

            <div className="col-md-8 mb-3">
              <label htmlFor="bio-text" className="form-label">
                Bio
              </label>
              <textarea
                className="form-control text-white"
                id="bio-text"
                value={bio}
                rows="5"
                readOnly
              ></textarea>
            </div>
          </div>
          <hr className="mb-4" />

          <form className="needs-validation" noValidate>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName " className="text-white">
                  Full name
                </label>
                <input
                  type="text"
                  className="form-control text-white "
                  id="firstName"
                  value={fullname}
                  readOnly
                  required
                />
                <div className="invalid-feedback text-white">
                  Valid first name is required.
                </div>
              </div>
              <div className="col-md-6 mb-3 text-white">
                <label htmlFor="lastName">Student ID</label>
                <input
                  type="text"
                  className="form-control text-white"
                  id="studentID"
                  value={studentId}
                  // placeholder
                  readOnly
                  required
                />
                <div className="invalid-feedback text-white">
                  Valid StudentID is required.
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">@</span>
                </div>
                <input
                  type="email"
                  className="form-control text-white"
                  id="email"
                  value={email}
                  placeholder="you@example.com"
                  readOnly
                  required
                />
                {/* <div className="invalid-feedback">
                    Please enter a valid email address for shipping updates.
                  </div> */}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="text-white">
                Address
              </label>
              <input
                type="text"
                className="form-control text-white"
                id="address"
                value={address}
                placeholder="1234 Main St"
                required
                readOnly
              />
              <div className="invalid-feedback">Please enter your address.</div>
            </div>
            <hr className="mb-4" />
          </form>
          <div className="d-flex justify-content-end w-100">
            <button
              className="btn btn-danger btn-lg"
              type="submit"
              onClick={() => handleBanButtonClick(user_id)}
            >
              {!banned ? "Ban" : "Unban"} this user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
