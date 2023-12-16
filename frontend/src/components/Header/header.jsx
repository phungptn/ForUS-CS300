
import React from 'react';
import './header.css';
import { instance } from "../../api/config";
import logo from '../../assets/icons/logo.png';
import {logout} from '../../api/user';

export default function Header() {
  const signOut = function () {
    instance
      .post("/users/logout")
      .then((res) => {
        console.log(res);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (


    <header className="p-3 mb-3 border-bottom bg-primary ">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none "
          >

            <img src={logo} alt="logo"  height={32} />
          </a>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <a href="#" className="nav-link  link-secondary text-white">
                Trang chủ/
              </a>
              
            

            </li>
          </ul>

          <div className='text-white my-10'>
            <i class="bi bi-bell-fill  m-3" ></i>

          </div>


          <div className="dropdown text-end  ">
            <a
              href="#"
              className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://github.com/mdo.png"
                alt="mdo"
                width={32}
                height={32}
                className="rounded-circle"
              />
            </a>
            
            <ul className="dropdown-menu text-small bg-white" style={{}}>
              <li>
                <a className="dropdown-item" href="#">
                  New project...
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
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
