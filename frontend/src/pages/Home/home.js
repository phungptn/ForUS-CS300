import React, { Fragment } from "react";
import { instance } from "../../api/config";
import Header from "../../components/Header/header";
import '../../components/Header/header.css';
import './home.css';


export default function Home() {

    return (
      <React.Fragment>
    
          <Header/>

            <h1>Home</h1>
            <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            onClick={() => {
              instance.post("/users/logout");
              window.location.href = "/login";
            }}
          >
            Sign out
          </button>
      </React.Fragment>        

    );
}