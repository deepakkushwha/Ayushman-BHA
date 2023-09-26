import React, { useState } from "react";
import banner from "../../assets/banner.png";
import firstCard from "../../assets/first-card.png";
import secondCard from "../../assets/card-2.png";
import threeCard from "../../assets/card-3.png";
import fourCard from "../../assets/card-4.png";
import 'react-toastify/dist/ReactToastify.css';

function Main() {
  return (
    <>

      <div className="container banner-contianer">
        <div className="row">
          <div className="col-sm-6 col-lg-6 col-md-12 col-xs-6 mainleft">
            <h2>Create Ayushman Bharat Health Account - ABHA Number</h2>
            <h5>Creating India's Digital Health Mission</h5>
            <p> ABHA - Ayushman Bharat Health Account - Key to your digital healthcare journey. </p>
            <div className="banner-button-section">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => window.location.href = '/abha'}> Create ABHA Number </button>
            <button type="button" className="btn btn-primary btn-lg"  onClick={() => window.location.href = '/abhalogin'}> Verify ABHA Number/Address </button>
          </div>
          </div>
          <div className="col-sm-6 col-lg-6 col-md-6 col-xs-6 mainright">
            <img className="image-reponsive" src={banner} alt="banner" />
          </div>
        </div>
      </div>

      <div className="container-fluid card-section">
        <div className="container">
          <h5 className="text-white h5-respo benefits">Benefits Of ABHA Number</h5>
          <p className="text-white">ABHA number is a 14 digit number that will uniquely identify you as a participant in India’s digital healthcare ecosystem. ABHA number will establish a strong and trustable identity for you that will be accepted by healthcare providers across the country. Seamless sign up for PHR (Personal Health Records) applications such as ABDM ABHA application for Health data sharing.</p>

          <div className="row">
            <div className="col-sm-3 col-lg-3 col-md-6 col-xs-3">
              <div className="abha-card">
                <img src={firstCard} alt="" />
                <h4>Unique & Trustable Identity</h4>
                <p>Establish unique identity across different healthcare providers within the healthcare ecosystem</p>
              </div>
            </div>

            <div className="col-sm-3 col-lg-3 col-md-6 col-xs-3">
              <div className="abha-card">
                <img src={secondCard} alt="" />
                <h4>Unique & Trustable Identity</h4>
                <p>Establish unique identity across different healthcare providers within the healthcare ecosystem</p>
              </div>
            </div>

            <div className="col-sm-3 col-lg-3 col-md-6 col-xs-3">
              <div className="abha-card">
                <img src={threeCard} alt="" />
                <h4>Unique & Trustable Identity</h4>
                <p>Establish unique identity across different healthcare providers within the healthcare ecosystem</p>
              </div>
            </div>

            <div className="col-sm-3 col-lg-3 col-md-6 col-xs-3">
              <div className="abha-card">
                <img src={fourCard} alt="" />
                <h4>Unique & Trustable Identity</h4>
                <p>Establish unique identity across different healthcare providers within the healthcare ecosystem</p>
              </div>
            </div>


          </div>


        </div>
      </div>
    </>
  );
}

export default Main;
