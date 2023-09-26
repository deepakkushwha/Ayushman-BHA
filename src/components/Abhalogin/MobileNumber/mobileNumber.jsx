import React, { useEffect, useState } from "react";
import { post } from "../../../services/services";
import VerificationInput from "react-verification-input";
import { toast } from "react-toastify";
import Loader from "../../../services/loader";

const MobileNumber = (props) => {
  const [mobilerr, setmobilerr] = useState("");
  const [mobileno, setMobileno] = useState("");
  const [tabvisibility, settabvisibility] = useState(false);
  const [num1, setNum1] = useState(getRandomNumber());
  const [num2, setNum2] = useState(getRandomNumber());
  const [userAnswer, setUserAnswer] = useState("");
  const [answer, setAnswer] = useState(num1 + num2);
  const [captchaerr, setCaptchaerr] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpmsg, setotpmsg] = useState("");
  const [otp, setOtp] = useState("");
  const [show, setshow] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(59);
  const [isActive, setIsActive] = useState(false);
  const [visiblePassword, setvisiblePassword] = useState(true);

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

  useEffect(() => {
    if (props.activeTab == "tab2") {
      setMobileno("");
      setmobilerr("");
      setUserAnswer("");
      setCaptchaerr("");
    }
  }, [props.activeTab]);

  const checkotp = async () => {
    setLoading(true);
    try {
      const txnid = sessionStorage.getItem("txnId");
      const jsonBody = {
        number: "",
        loginType: "MOBILE",
        otpType: "MOBILE",
        otp: otp,
        txnId: txnid,
        mobileNumber: mobileno,
      };
      const resp = await post("/v1/abha/login/verify", jsonBody);
      const abhaDetails = {
        token: resp?.tokens?.token,
        users: resp?.users,
      };
      sessionStorage.setItem("AbhaCreation", JSON.stringify(abhaDetails));
      toast.success("OTP verified successfully");
      if (resp?.users?.length == 1) {
        calluser(resp);
      } else {
        window.location.href = "/abha-Card";
      }
      setTimeRemaining(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  function generateCaptcha() {
    const newNum1 = getRandomNumber();
    const newNum2 = getRandomNumber();
    const newAnswer = newNum1 + newNum2;
    setNum1(newNum1);
    setNum2(newNum2);
    setAnswer(newAnswer);
    setUserAnswer("");
  }

  function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  const mobilenumber = (e) => {
    const input = e.target.value;
    const onlynumber = /^[0-9]+$/.test(input);
    setMobileno(input);
    const isValid = /^\d{10}$/.test(input);
    if (onlynumber) {
      isValid
        ? setmobilerr("")
        : setmobilerr("Please enter a valid mobile number");
    } else {
      setmobilerr("");
    }
  };

  const setCaptcha = (e) => {
    const input = e.target.value;
    setUserAnswer(input);
  };

  function checkAnswer() {
    let ismobilevalid = false;
    let isCaptchavalid = false;

    const Regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (mobileno === "") {
      setmobilerr("Phone Number field cannot be empty");
      ismobilevalid = false;
    } else if (!Regex.test(mobileno)) {
      setmobilerr("Please enter a valid phone number");
      ismobilevalid = false;
    } else {
      setmobilerr("");
      ismobilevalid = true;
    }

    if (userAnswer === "") {
      setCaptchaerr("Captcha field cannot be empty");
      isCaptchavalid = false;
    } else if (parseInt(userAnswer, 10) === answer) {
      setCaptchaerr("");
      isCaptchavalid = true;
    } else {
      setCaptchaerr("Please enter a valid Captcha");
      isCaptchavalid = false;
      generateCaptcha();
    }

    if (ismobilevalid && isCaptchavalid) {
      getmobilenumberOTP();
    }
  }

  const getmobilenumberOTP = async () => {
    setLoading(true);
    try {
      const newData = {
        number: "",
        loginType: "MOBILE",
        otpType: "MOBILE",
        otp: "",
        txnId: "",
        mobileNumber: mobileno,
      };

      const result = await post("/v1/abha/login/otp/request", newData);
      sessionStorage.setItem("txnId", result.txnId);
      setotpmsg(result?.message);
      toast.success("OTP sent successfully");
      settabvisibility(true);
      setIsActive(true);
      setLoading(false);
    } catch (error) {
      setUserAnswer("");
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);

    try {
      const newData = {
        number: "",
        loginType: "MOBILE",
        otpType: "MOBILE",
        otp: "",
        txnId: "",
        mobileNumber: mobileno,
      };

      const result = await post("/v1/abha/login/otp/request", newData);
      sessionStorage.setItem("txnId", result.txnId);
      setTimeRemaining(59);
      setLoading(false);
      toast.success("OTP sent successfully");
      setshow(false);
    } catch (error) {
      setshow(true);
      setLoading(false);
    }
  };

  const calluser = async (resp) => {
    setLoading(true);
    await fetch(
      "http://ac99c7f6dfac8444bb96c5f59fae927d-15dd478b86e9eeed.elb.ap-south-1.amazonaws.com:8080/api/v1/abha/login/verify/user",
      {
        method: "POST",
        body: JSON.stringify({
          abhaAddress: resp.users["0"].abhaAddress,
          txnId: resp.txnId,
        }),
        headers: {
          "Content-Type": "application/json",
          tToken: resp?.tokens?.token,
        },
      }
    )
      .then((response) => response.json())
      .then((resp) => {
        setLoading(false);
        const abhaDetails = {
          indentifire: "ABHAlogin",
          token: resp?.token,
        };
        sessionStorage.setItem("AbhaCreation", JSON.stringify(abhaDetails));
        window.location.href = "/user-Profile";
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error?.message);
      });
  };

  return (

<div>
      <div className="tabcontent">
        <div className="col-md-12">
          {!tabvisibility && (
            <>
              <div className="col-4">
                <label
                  htmlFor="exampleInputEmail1"
                  className="label-text form-label"
                >
                  Mobile number
                  <span className="redasterisk">*</span>
                </label>
                <div className="input-group number-section input-group-lg col-md-4">
                  <span className="countrynumber">+91</span>
                  <input
                    type="number"
                    className="form-control numberarrow"
                    placeholder="Mobile Number"
                    value={mobileno}
                    maxLength={10}
                    onChange={mobilenumber}
                  />
                </div>
                {mobilerr && <pre style={{ color: "red" }}>{mobilerr}</pre>}
              </div>

              <div id="accordionExample" className="row">
                <div className="col-3 nopadding">
                  <div className=" captchabodr">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label  label-text"
                    >
                      {" "}
                      Captcha<span className="redasterisk">*</span>
                    </label>
                    <div className="d-flex captchastyle">
                      <p className="captchades">
                        {num1} + {num2} ={" "}
                      </p>
                      <input
                        type="number"
                        className="form-control numberarrow"
                        value={userAnswer}
                        onChange={setCaptcha}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={generateCaptcha}
                        viewBox="0 0 512 512"
                      >
                        <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                      </svg>
                    </div>

                    {captchaerr && (
                      <pre style={{ color: "red" }}>{captchaerr}</pre>
                    )}
                  </div>
                </div>
              </div>

              <button className="create-btn float-end" onClick={checkAnswer}>
                Next
              </button>
            </>
          )}

          {tabvisibility && (
            <>
              <label
                htmlFor="exampleInputEmail1"
                className="form-label label-text"
              >
                {otpmsg}
                <span className="redasterisk">*</span>
              </label>
              <div className=" authentication input-group input-group-lg col-md-4">
                <div className="password-section">
                  <VerificationInput
                    classNames={{
                      container: "aadhar-container",
                      character: "character",
                    }}
                    passwordMode={visiblePassword}
                    length={6}
                    onChange={setOtp}
                    validChars="0-9"
                    inputProps={{ inputMode: "numeric" }}
                    placeholder="_"
                  />
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

              <div className="row">
                <div className="col-4 timer">
                  <label className="label-text">Didn’t receive OTP?</label>
                  {show ? (
                    <label className="label-text resend" onClick={resendOtp}>
                      Resend OTP
                    </label>
                  ) : (
                    ""
                  )}
                  {!show ? (
                    <label className="label-text">
                      {formatTime(timeRemaining)} remaining
                    </label>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <button className="create-btn float-end" onClick={checkotp}>
                Next
              </button>
            </>
          )}
        </div>
        <br></br>
        <br />
      </div>
      {!loading ? (
        ""
      ) : (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default MobileNumber;
