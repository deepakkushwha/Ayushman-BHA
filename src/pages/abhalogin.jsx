import React from "react";
import Header from "../components/header/header";
import "../styles/styles.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AbhaLogin from '../components/Abhalogin/abhalogin';
function Abhalogin() {


  return (
    <div>
      <Header />
        <AbhaLogin />
        <ToastContainer />
      </div>
     
  );
}

export default Abhalogin;
