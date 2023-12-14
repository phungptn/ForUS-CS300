import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { login } from "../../api/login";
import { setCookie } from "../../utils/setCookie";
import axios from "axios";
import Logo from "../../components/icons/logo";
import logo from "../../assets/icons/logo.png";

import "./login.css";

const initialStateDialog = {
  stateDialogUsername: true,
  stateDialogPassword: false,
};

const dialogReducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE_DIALOG":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
};

export default function Login({ auth }) {
  // const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const [stateDialog, setStateDialog] = useReducer(
    dialogReducer,
    initialStateDialog
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const Login = async (event) => {
    try {event.preventDefault();
    setLoading(true);
    const rememberMe = document.getElementById("remember_me").checked;
    setStateDialog({
      type: "SET_STATE_DIALOG",
      payload: {
        stateDialogUsername:
          formData.username.length >= 0 && formData.username.length <= 20
            ? false
            : true,
        stateDialogPassword:
          formData.password.length >= 0 && formData.password.length <= 20
            ? false
            : true,
      },
    });


    if (
      formData.username.length >= 0 &&
      formData.username.length <= 20 &&
      formData.password.length >= 0 &&
      formData.password.length <= 20
    ) {
      const response = await login(formData);
      // console.log(response);
      if (response.status === 200) {
        console.log(rememberMe) ;
        if (rememberMe) {
          setCookie("token", response.data.token, 30);
        } else {
          setCookie("token", response.data.token,1);
        }
        axios.defaults.headers.common["Authorization"] = response.data.token;
        // navigate("/");
        window.location.href = "/";
      }
    }}
    catch (error) {
      console.error(error);
    }
    
  };

  const handleLoginInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.placeholder]: event.target.value,
    });
  }
  return auth ? <Navigate to="/" /> : (
    <div className="d-flex align-items-center py-4 bg-body-tertiary vh-100 ">
      <main className="form-signin w-100 m-auto">
        <form>
          <img src={logo} alt="Logo" className="my-4 align-items-center "/>

          {/* <h1 class="h3 mb-3 fw-normal">Please sign in</h1> */}
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="username"
              onChange={(event) => handleLoginInputChange(event)}
            />
            <label htmlFor="floatingInput">Username</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="password"
              onChange={(event) => handleLoginInputChange(event)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="remember_me"
              
            />
            <label className="form-check-label" htmlFor="remember_me">
              Remember me
            </label>
          </div>

          <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            onClick={(event) => Login(event)}
          >
            Sign in
          </button>
          <div className="text-start my-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2023</p>
        </form>
      </main>
    </div>
  );
}
