import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { setCookie } from "../../utils/setCookie";
import axios from "axios";
import Logo from "../../components/icons/logo";
import logo from "../../assets/icons/logo.png";
import "./login.css";

// import { Outlet } from "react-router-dom";


export default function Login({ auth }) {

    return auth ? <Navigate to="/" /> :(
        <div className="d-flex align-items-center py-4 bg-body-tertiary vh-100 ">
        <main className="form-signin w-100 m-auto">
          <form>
            <img src={logo} alt="Logo" className="my-4 align-items-center "/>
  
            <Outlet />


  

  

            <p className="mt-5 mb-3 text-body-secondary">&copy; 2023-2024 ForUS</p>
          </form>
        </main>
      </div>
    );
}