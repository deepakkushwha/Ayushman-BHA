import React, { useState, useEffect } from "react";
import { post } from "../../../services/services";
import VerificationInput from "react-verification-input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../services/loader";

export default function Authentication(props) {
  const [OTP, setOTP] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(59);
  const [show, setshow] = useState(false);
  const [mobileno, setMobileno] = useState("");
  const [mobilerr, setmobilerr] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otperr, setOtperr] = useState(true);
  const [flag, setflag] = useState(false);
  const [varify, setVarify] = useState(false);
  const [visiblePassword, setvisiblePassword] = useState(true);
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining(timeRemaining - 1);
        } else {
          clearInterval(interval);
          setshow(true);
        }

      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [timeRemaining, isActive]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  function Submit() {
    if (mobileno == "") {
      setmobilerr(false);
    } else {
      if (OTP == "") {
        setOtperr(false);
      } else {
        reqOTP();
      }
    }
  }
  const storedObject = sessionStorage.getItem("AbhaCreation");
  var abhastorageData = JSON.parse(storedObject);

  const reqOTP = async () => {
    setLoading(true);
    try {
      const newData = {
        number: abhastorageData?.aadharNumber,
        loginType: "",
        otpType: "",
        otp: OTP,
        txnId: abhastorageData?.txnId,
        mobileNumber: mobileno,
      };
      const result = await post("/v1/abha/enrollment/otp/verify", newData);
      toast.success(result?.message);
      const abhaDetails = {
        txnId: abhastorageData?.txnId,
        aadharNumber: abhastorageData?.aadharNumber,
        message: abhastorageData?.message,
        token: result?.tokens?.token,
      };
      sessionStorage.setItem("AbhaCreation", JSON.stringify(abhaDetails));
      if (result?.flag == true) {
        setActive(false);
        setflag(true);
      } else {
        const stepCount = 1;
        props.nextStep(stepCount);
      }
      setvisiblePassword(true);
      setOTP("");
      setmobilerr(true);
      setOtperr(true)
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e;
    setOTP(value);
    setOtperr(true);
  };
  const mobilenumber = (e) => {
    const input = e.target.value;
    setMobileno(input);
    const isValid = /^[0-9]{10}$/g.test(input);
    setMobileno(input);
    setmobilerr(isValid);
  };

  const resendOtp = async (type) => {
    setLoading(true);
    try {
      var newData;
      if (type == 'verifyOTP') {
        newData = {
          number: "",
          abhaAddress: "",
          loginType: "",
          otpType: "",
          otp: "",
          txnId: abhastorageData?.txnId,
          mobileNumber: mobileno,
        };
      }
      else {
        newData = {
          "number": abhastorageData?.aadharNumber,
          "loginType": "",
          "otpType": "",
          "otp": "",
          "txnId": "",
          "mobileNumber": ""
        };

      }



      const result = await post("/v1/abha/enrollment/otp/request", newData);
      setTimeRemaining(59);
      setLoading(false);
      setshow(false);
    } catch (error) {
      setLoading(false);
    }
  };



  const resendOtp2 = async (type) => {
    setLoading(true);
    try {
      const  newData = {
          "number": abhastorageData?.aadharNumber,
          "loginType": "",
          "otpType": "",
          "otp": "",
          "txnId": "",
          "mobileNumber": ""
        };
      const result = await post("/v1/abha/enrollment/otp/request", newData);
      const abhaDetails = {
        txnId: result?.txnId,
        aadharNumber: abhastorageData?.aadharNumber,
        message: result?.message
      }
      sessionStorage.setItem('AbhaCreation', JSON.stringify(abhaDetails));
      setTimeRemaining(59);
      setLoading(false);
      setshow(false);
    } catch (error) {
      setLoading(false);
    }
  };


  const Verify = async () => {
    if (mobileno == "") {
      setmobilerr(false);
    } else {
      setLoading(true);
      try {
        const newData = {
          number: "",
          abhaAddress: "",
          loginType: "",
          otpType: "",
          otp: "",
          txnId: abhastorageData?.txnId,
          mobileNumber: mobileno,
        };
        const result = await post("/v1/abha/enrollment/otp/request", newData);
        const abhaDetails = {
          txnId: abhastorageData?.txnId,
          aadharNumber: abhastorageData?.aadharNumber,
          message: result?.message,
          token: abhastorageData?.token,
        };
        sessionStorage.setItem("AbhaCreation", JSON.stringify(abhaDetails));
        toast.success(result?.message);
        setVarify(true);
        setLoading(false);
        setTimeRemaining(59);
        setActive(true);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const otpconfirm = async () => {
    if (OTP == "") {
      setOtperr(false);
    } else {
      setLoading(true);
      try {
        const newData = {
          number: "",
          abhaAddress: "",
          loginType: "",
          otpType: "",
          otp: OTP,
          txnId: abhastorageData?.txnId,
          mobileNumber: "",
        };
        const result = await post(
          "/v1/abha/enrollment/otp/verify/communication",
          newData
        );
        if(result?.authResult =='Failed'){
        toast.error(result?.message);
        setLoading(false);
        }
        else{
        toast.success(result?.message);
        const stepCount = 1;
        props.nextStep(stepCount);
        setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {flag == true ? (
        <>
          <div className="authentication card">
            <div className="card-body">
              {!varify == true ? (
                <div className="row">
                  <div className="col-lg-3 col-md-8 col-8">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className=" label-text text-start"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mobile Number"
                      value={mobileno}
                      disabled
                    />
                  </div>

                  <div className="col-3">
                    <label htmlFor="" className="d-block">
                      &nbsp;
                    </label>
                    <button className="btn btn-primary mt-2" onClick={Verify}>
                      Verify
                    </button>
                  </div>
                  {!mobilerr && (
                    <div style={{ color: "red" }}>
                      Please enter a valid 10-digit phone number.
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="row mb-3">
                    <h5>Confirm OTP</h5>
                    <label
                      htmlFor="exampleFormControlInput1"
                      className=" label-text text-start"
                    >
                      {abhastorageData?.message}
                    </label>
                    <div className="col-lg-4 col-md-9">

                      <div className="verify-confirm-otp">
                        <div className="password-section">
                          <VerificationInput
                            classNames={{
                              container: "aadhar-container",
                              character: "character",
                            }}
                            length={6}
                            onChange={handleInputChange}
                            passwordMode={visiblePassword}
                            validChars="0-9"
                            inputProps={{ inputMode: "numeric" }}
                            placeholder="_"
                          />

                          <div className="visiblePassword">
                            {!visiblePassword ? (
                              <i
                                className="fa fa-eye"
                                aria-hidden="true"
                                onClick={() => setvisiblePassword(true)}
                              ></i>
                            ) : (
                              <i
                                className="fa fa-eye-slash"
                                aria-hidden="true"
                                onClick={() => setvisiblePassword(false)}
                              ></i>
                            )}
                          </div>
                        </div>


                        <div className="timer">
                          <label className="label-text">
                            Didn’t receive OTP?
                          </label>
                          {show ? (
                            <label
                              className="label-text resend"
                              onClick={() => resendOtp('verifyOTP')}
                            >
                              Resend OTP
                            </label>
                          ) : (
                            ""
                          )}
                          {!show ? <label className="label-text">
                            {formatTime(timeRemaining)} remaining
                          </label>
                            : ""}
                        </div>

                      </div>

                      {!otperr && (
                        <div style={{ color: "red" }}>Please enter a OTP.</div>
                      )}
                    </div>
                  </div>

                  <div className="text-end">
                    <button className="create-btn" onClick={otpconfirm}>
                      Next
                    </button>
                  </div>

                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="authentication card">
          <div className="card-body">
            <div className="row mb-3">
              <h5>Confirm OTP</h5>
              <label
                htmlFor="exampleFormControlInput1"
                className=" label-text text-start"
              >
                {abhastorageData?.message}
              </label>
              <div className="col-lg-4 col-md-4 col-12">
                <div className="password-section">
                  <div className="password-input-box">
                    <VerificationInput
                      classNames={{
                        container: "aadhar-container",
                        character: "character",
                      }}
                      length={6}
                      onChange={handleInputChange}
                      passwordMode={visiblePassword}
                      validChars="0-9"
                      inputProps={{ inputMode: "numeric" }}
                      placeholder="_"
                    />

                    <div className="timer">
                      <label className="label-text">Didn’t receive OTP?</label>
                      {show ? (
                        <label
                          className="label-text resend"
                          onClick={() => resendOtp2('notverifyOTP')}
                        >
                          Resend OTP
                        </label>
                      ) : (
                        ""
                      )}
                      {!show ? <label className="label-text">
                        {formatTime(timeRemaining)} remaining
                      </label>
                        : ""}
                    </div>
                  </div>

                  <div className="visiblePassword">
                    {!visiblePassword ? (
                      <i
                        className="fa fa-eye"
                        aria-hidden="true"
                        onClick={() => setvisiblePassword(true)}
                      ></i>
                    ) : (
                      <i
                        className="fa fa-eye-slash"
                        aria-hidden="true"
                        onClick={() => setvisiblePassword(false)}
                      ></i>
                    )}
                  </div>
                </div>

                {!otperr && (
                  <div style={{ color: "red" }}>Please enter a OTP.</div>
                )}
              </div>
            </div>

            <div className="row phonenumber m-0">
              <div className="col-lg-4 col-md-8 nopadding">
                <label
                  htmlFor="exampleInputEmail1"
                  className="label-text form-label"
                >
                  Mobile number<span className="redasterisk">*</span>
                </label>
                <div className="input-group number-section input-group-lg col-md-4">
                  <span className="countrynumber">+91</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile Number"
                    value={mobileno}
                    onChange={mobilenumber}
                  />
                </div>

                {!mobilerr && (
                  <div style={{ color: "red" }}>
                    Please enter a valid 10-digit phone number.
                  </div>
                )}
              </div>
            </div>
            <p
              className="infotext"
              style={{ color: "rgb(101, 84, 192)", marginTop: "10px" }}
            >
              <i className="fa fa-info-circle " aria-hidden="true"></i>This
              mobile number will be used for all the communications related to
              ABHA.
            </p>

            <div className="text-end">
              <button className="create-btn" onClick={Submit}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
      {!loading ? (
        ""
      ) : (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </>
  );
}
