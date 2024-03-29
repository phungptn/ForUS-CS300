import React, { Fragment } from "react";
import { instance } from "../../api/config";
import Header from "../../components/Header/header";
import '../../components/Header/header.css';
import { Outlet } from "react-router-dom";
import './layout.css';
import Footer from "../../components/Footer/footer";
// dropdowns will not work without this import
import { Dropdown } from "bootstrap";


export default function Home() {

    return (
      <React.Fragment>


    
          <Header/>
          <Outlet />
          <Footer/>
          
      </React.Fragment>        

    );
}