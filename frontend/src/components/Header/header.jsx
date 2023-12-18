
import React, { useEffect } from 'react';
import './header.css';
import { instance } from "../../api/config";
import logo from '../../assets/icons/logo.png';
import {logout} from '../../api/user';
import { useLocation } from 'react-router-dom';

export default function Header() {
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

  const location = useLocation();
  const [routes, setRoutes] = React.useState(['Trang chủ']);
  
  useEffect(() => {
    const currentRoutes = location.pathname.split('/');
      // capitalize first letter and add / at the end
    currentRoutes.forEach((route, index) => {
      if (route !== '') {
        currentRoutes[index] = route.charAt(0).toUpperCase() + route.slice(1) + '/';
      }
    });
    if (currentRoutes.length > 1) {
      setRoutes(['Trang chủ/', ...currentRoutes]);
    }
    else {
      setRoutes(['Trang chủ']);
    }
  }
    , [location]);

  return (


    <header className="p-3 mb-3 border-bottom bg-primary sticky-top ">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none "
          >

            <img src={logo} alt="logo"  height={32} />
          </a>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            {routes.map((route, index) => (
              <li key={index}>
                <a href="#" className="nav-link px-0 ps-2 link-secondary text-white">
                  {route}
                </a>
              </li>
            ))}
            

          </ul>

          <div className=' py-2 me-3 rounded-3 shadow-sm bg-dark text-white'>
            <i className="bi bi-bell-fill  m-3" ></i>

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
