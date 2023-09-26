import React, { useEffect, useState } from "react";
import { post } from "../../../../services/services";
import VerificationInput from "react-verification-input";
import Loader from "../../../../services/loader";
import { toast } from "react-toastify";

const Abhaaddress = (props) => {
  const [abhaerr, setAbhaerr] = useState("");
  const [abhaAddress, setAabhaAddress] = useState("");
  const [num1, setNum1] = useState(getRandomNumber());
  const [num2, setNum2] = useState(getRandomNumber());
  const [answer, setAnswer] = useState(num1 + num2);
  const [captchaerr, setCaptchaerr] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [paswrdvisibility, setPaswrdvisibility] = useState(false);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [show, setshow] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(59);
  const [mobileno, setMobileno] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [visiblePassword, setvisiblePassword] = useState(true);
  const [otperr, setOtperr] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (props.activeTab == "tab1") {
      setAabhaAddress("");
      setUserAnswer("");
      setCaptchaerr("");
    }
  }, [props.activeTab]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const checkAbha = async (abhaAddress) => {
    if (otp === '') {
      setOtperr("Please enter OTP")
    } else {
      setOtperr("");
      setLoading(true);
      try {
        const txnid = sessionStorage.getItem("txnId");
        var jsonBody = {
          number: "",
          abhaAddress: abhaAddress,
          loginType: "ABHA_ADDRESS",
          otpType: "ABHA_ADDRESS",
          otp: otp,
          txnId: txnid,
          mobileNumber: "",
        };
        const resp = await post("/v1/abha/login/verify", jsonBody);
        const abhaDetails = {
          indentifire: "ABHAlogin",
          token: resp?.tokens?.token,
        };
        sessionStorage.setItem("AbhaCreation", JSON.stringify(abhaDetails));
        if(resp?.authResult=='failed'){
          toast.error(resp?.message);
          setLoading(false);
          }
         else{
          toast.success("OTP verified successfully");
          window.location.href = "./user-Profile";
          setLoading(false);  
         }
       } catch (error) {
        setUserAnswer("");
        setLoading(false);
      }
    }
  };


  var isvalid = false;

     const reg =  /^(?!.*[._@]$)(?!^[._@])(?!.*[._@]{2})[a-zA-Z0-9._@]{12,22}$/



  const handleAbhaAddress = (e) => {
    let inputString = e.target.value;
     if (inputString.length < 12 || inputString.length > 22) {
      setErr('Input must be between 12 and 22 characters');
      isvalid=false;
    }else if (!reg.test(inputString)) {
      setErr('Only "." or "_" is allowed and special characters should not be in the beginning or at the end');
      isvalid = false;
    } else {
      setErr("");
      isvalid = true;
    }
    setAabhaAddress(e.target.value);
  };



  const resendOtp = async () => {
    setLoading(true);

    try {
      const newData = {
          number: "",
          abhaAddress: abhaAddress,
          loginType: "ABHA_ADDRESS",
          otpType: "ABHA_ADDRESS",
          otp: "",
          txnId: "",
          mobileNumber: "",
         };

      const result = await post("/v1/abha/login/otp/request", newData);
        setMsg(result.message);
        sessionStorage.setItem("txnId", result.txnId);
        toast.success("OTP sent successfully");
        setPaswrdvisibility(true);
        props.nextStep("true");
        setIsActive(true);
        setLoading(false);

        setTimeRemaining(59);
        setshow(false);
   
      
    } catch (error) {
      setshow(true);
      setLoading(false);
    }
  };

  const setCaptcha = (e) => {
    const input = e.target.value;
    setUserAnswer(input);
  };

  function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  function generateCaptcha() {
    const newNum1 = getRandomNumber();
    const newNum2 = getRandomNumber();
    const newAnswer = newNum1 + newNum2;
    setNum1(newNum1);
    setNum2(newNum2);
    setAnswer(newAnswer);
    setUserAnswer("");
  }
  const requestOtp = async () => {
    if (abhaAddress === "") {
      setErr("Please enter/select ABHA addresa");
      isvalid = false;
    }else if(abhaAddress.length < 12 ){
      setErr('Input must be between 12 and 22 characters');
      isvalid=false;
    } else if (!reg.test(abhaAddress)) {
      setErr('Only "." or "_" is allowed and special characters should not be in the beginning or at the end');
      isvalid = false;
    } else {
      isvalid = true;
      setErr("");
    }
    if (isvalid) {
      setErr("");
      setLoading(true);
    let isCaptchavalid = false;
    let isAbhavalid = false;
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

    if (abhaAddress === "") {
      setAbhaerr("Abha Address cannot be empty");
      isAbhavalid = false;
    } else {
      isAbhavalid = true;
      setAbhaerr("");
    }
    if (isCaptchavalid && isAbhavalid) {
      setLoading(true);
      try {
        const newData = {
          number: "",
          abhaAddress: abhaAddress,
          loginType: "ABHA_ADDRESS",
          otpType: "ABHA_ADDRESS",
          otp: "",
          txnId: "",
          mobileNumber: "",
        };

        const result = await post("/v1/abha/login/otp/request", newData);
        setMsg(result.message);
        sessionStorage.setItem("txnId", result.txnId);
        toast.success("OTP sent successfully");
        setPaswrdvisibility(true);
        props.nextStep("true");
        setIsActive(true);
        setLoading(false);
      } catch (error) {
        setUserAnswer("");
        setLoading(false);
      }
    }
  }
  };

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

  return (
    <div className="abhaAdddress-page">
      <div className="nopadding col-md-7 col-lg-4">
        <label htmlFor="exampleInputEmail1" className="label-text form-label">
          Enter ABHA Address
          <span className="redasterisk">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          value={abhaAddress}
          onChange={handleAbhaAddress}
          maxLength={22}
              
        />
        {/* {abhaerr && <pre style={{ color: "red" }}>{abhaerr}</pre>}*/}
      </div>
      {err && <pre className="mt-1" style={{ color: "red" }}>{err}</pre>}
      <div className="row">
        {!paswrdvisibility && (
          <div className="col-sm-7 col-lg-3 mt-4">
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
              {captchaerr && <pre style={{ color: "red" }}>{captchaerr}</pre>}
            </div>
          </div>
        )}

        {paswrdvisibility && (
          <>
            <div className="mt-4">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label label-text"
              >
                {msg}
              </label>
              <div className="col-md-8 col-lg-4 authentication">
                <div className="password-section">
                  <VerificationInput
                    classNames={{
                      container: "aadhar-container",
                      character: "character",
                    }}
                    className="form-control"
                    passwordMode={visiblePassword}
                    length={6}
                    onChange={setOtp}
                    validChars="0-9"
                    inputProps={{ inputMode: "numeric" }}
                    placeholder="_"
                  />
                  {otperr && (
                    <pre style={{ color: "red" }}>{otperr}</pre>
                  )}
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
              
              
              </div>
          </>
        )}
      </div>
      {!paswrdvisibility ? (
        <button onClick={requestOtp} className="create-btn float-end">
          Next
        </button>
      ) : (
        <button
          onClick={() => checkAbha(abhaAddress)}
          className="create-btn float-end"
        >
          Next
        </button>
      )}

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

export default Abhaaddress;
