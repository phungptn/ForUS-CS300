import React, { useEffect, useState } from "react";
// import "./header.css";
import { downloadImage } from "../../utils/loadImage";
import { infoUser } from "../../api/user";
import logo from "../../assets/icons/logo.png";
import { logout } from "../../api/user";
import { useLocation } from "react-router-dom";
import Notification from "./Notification/notification";
import { SearchBar } from "../../pages/Search/SearchBar/searchbar";
import { checkAdmin } from "../../utils/checkAdmin";

export default function Header() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await infoUser();
        if (res.status === 200) {
          console.log(res.data);
          const data = res.data.user;
          const avatar = await downloadImage("images/avatar/" + data.avatarUrl);
          const avatarElement = document.getElementById("dropdownUserAvatar");
          avatarElement.src = avatar;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const signOut = async function () {
    try {
      const res = await logout();
      if (res.status === 200) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goToProfile = () => {
    window.location.href = "/profile";
  };

  const goToManagement = () => {
    window.location.href = "/management";
  };

  const location = useLocation();
  const [routes, setRoutes] = React.useState(["Trang chủ"]);
  const [adminStatus, setAdminStatus] = useState(false);

  useEffect(() => {
    const currentRoutes = location.pathname.split("/");
    // capitalize first letter and add / at the end
    currentRoutes.forEach((route, index) => {
      if (route !== "") {
        currentRoutes[index] =
          route.charAt(0).toUpperCase() + route.slice(1) + "/";
      }
    });
    if (currentRoutes.length > 1) {
      setRoutes(["Trang chủ/", ...currentRoutes]);
    } else {
      setRoutes(["Trang chủ"]);
    }
  }, [location]);

  useEffect(() => {
    checkAdmin(setAdminStatus);
  }, []);

  return (
    <header className="p-3 mb-3 border-bottom bg-primary sticky-top ">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none "
          >
            <img src={logo} alt="logo" height={32} />
          </a>
          <div className="nav col-12 col-lg-auto  me-lg-auto  justify-content-center ">
            {/* {routes.map((route, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="nav-link px-0 ps-2 link-secondary text-white"
                >
                  {route}
                </a>
              </li>
            ))} */}

            <SearchBar />
          </div>

          <Notification />

          <div className="dropdown text-end  ">
            <a
              href="#"
              className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                alt="mdo"
                width="40"
                height="40"
                id="dropdownUserAvatar"
                className="rounded-3 centered-and-cropped p-1"
              />
            </a>

            <ul
              className="dropdown-menu text-small bg-white active"
              aria-labelledby="dropdownMenuButton"
              style={{}}
            >
              {adminStatus !== false && (
                <>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={goToManagement}
                    >
                      Management
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                </>
              )}
              <li>
                <a className="dropdown-item" href="#" onClick={goToProfile}>
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={signOut}>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
