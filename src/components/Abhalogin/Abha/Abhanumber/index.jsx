import React, { useEffect, useState } from "react";
import { post } from "../../../../services/services";
import VerificationInput from "react-verification-input";
import { toast } from "react-toastify";
import { AutoTabProvider } from "react-auto-tab";
import Loader from "../../../../services/loader";

const Abhanumber = (props) => {
  const [aadharPart1, setAadharPart1] = useState("");
  const [aadharPart2, setAadharPart2] = useState("");
  const [aadharPart3, setAadharPart3] = useState("");
  const [aadharPart4, setAadharPart4] = useState("");
  const [abhaerr, setAbhaerr] = useState("");
  const [num1, setNum1] = useState(getRandomNumber());
  const [num2, setNum2] = useState(getRandomNumber());
  const [userAnswer, setUserAnswer] = useState("");
  const [captchaerr, setCaptchaerr] = useState("");
  const [answer, setAnswer] = useState(num1 + num2);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otperr, setOtperr] = useState("");
  const [show, setshow] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(59);
  const [otpvisibile, setotpvisible] = useState(false);
  const [msgnmber, setmsgnmber] = useState("");
  const [AbhaNumber, setAbhaNumber] = useState("");
  const [tab2visibility, settab2visibility] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [visiblePassword, setvisiblePassword] = useState(true);

  var msg = msgnmber;
  var isAbhaValid = false;
  var isCaptchavalid = false;
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
    if (props.activeTab == "tab1") {
      setAadharPart1("");
      setAadharPart2("");
      setAadharPart3("");
      setAadharPart4("");
      setUserAnswer("");
      setCaptchaerr("");
      setAbhaerr("");
    }
  }, [props.activeTab]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      switch (selectedOption) {
        case "ABHA":
          var jsonBody = {
            number: AbhaNumber,
            abhaAddress: "",
            loginType: "ABHA",
            otpType: "ABHA_MOBILE",
            otp: "",
            txnId: "",
            mobileNumber: "",
          };
          break;
        case "Aadhar":
          var jsonBody = {
            number: AbhaNumber,
            abhaAddress: "",
            loginType: "ABHA",
            otpType: "AADHAR_MOBILE",
            otp: "",
            txnId: "",
            mobileNumber: "",
          };
      }
      const result = await post("/v1/abha/login/otp/request", jsonBody);
      setmsgnmber(result.message);
      sessionStorage.setItem("txnId", result.txnId);
      setTimeRemaining(59);
      toast.success("OTP sent successfully");
      setLoading(false);
      setshow(false);
    } catch (error) {
      setshow(true);
      setLoading(false);
    }
  };

  const onOptionChange = async (event, abha1, abha2, abha3, abha4) => {
    setLoading(true);
    try {
      setSelectedOption(event.target.value);
      setLoading(true);
      const abhano = `${abha1}-${abha2}-${abha3}-${abha4}`;
      setAbhaNumber(`${abha1}-${abha2}-${abha3}-${abha4}`);
      switch (event.target.value) {
        case "ABHA":
          var jsonBody = {
            number: abhano,
            abhaAddress: "",
            loginType: "ABHA",
            otpType: "ABHA_MOBILE",
            otp: "",
            txnId: "",
            mobileNumber: "",
          };
          break;
        case "Aadhar":
          var jsonBody = {
            number: abhano,
            abhaAddress: "",
            loginType: "ABHA",
            otpType: "AADHAR_MOBILE",
            otp: "",
            txnId: "",
            mobileNumber: "",
          };
      }
      const result = await post("/v1/abha/login/otp/request", jsonBody);
      setmsgnmber(result.message);
      setTimeRemaining(59);
      sessionStorage.setItem("txnId", result.txnId);
      setIsActive(true);
      setLoading(false);
      setotpvisible(true);
      toast.success("OTP sent successfully");
    } catch (error) {
      setIsActive(true);
      setUserAnswer("");
      setLoading(false);
    }
  };

  function generateCaptcha() {
    const newNum1 = getRandomNumber();
    const newNum2 = getRandomNumber();
    const newAnswer = newNum1 + newNum2;
    setNum1(newNum1);
    setNum2(newNum2);
    setAnswer(newAnswer);
    setUserAnswer("");
  }

  const setCaptcha = (e) => {
    const input = e.target.value;
    setUserAnswer(input);
  };

  function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  const handleInputChange = (event, part) => {
    const inputValue = event.target.value;
    const regex = /^[0-9\b]+$/;
    if (!regex.test(inputValue)) {
      setAbhaerr("Invalid ABHA Number");
      isAbhaValid = false;
    } else {
      setAbhaerr("");
      isAbhaValid = true;
    }
    switch (part) {
      case "part1":
        setAadharPart1(inputValue);
        break;
      case "part2":
        setAadharPart2(inputValue);
        break;
      case "part3":
        setAadharPart3(inputValue);
        break;
      case "part4":
        setAadharPart4(inputValue);
        break;
      default:
        break;
    }
  };

  const validate = () => {
    const regex = /^[0-9\b]+$/;
    if (
      aadharPart1 === "" ||
      aadharPart2 === "" ||
      aadharPart3 === "" ||
      aadharPart4 === ""
    ) {
      setAbhaerr("Abha Number field cannot be empty");
      isAbhaValid = false;
    } else if (!regex.test(aadharPart1) || !regex.test(aadharPart2) || !regex.test(aadharPart3) || !regex.test(aadharPart4)) {
      setAbhaerr("Invalid ABHA Number");
      isAbhaValid = false;
    } else {
      setAbhaerr("");
      isAbhaValid = true;
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

    if (isAbhaValid && isCaptchavalid) {
      settab2visibility(true);
      props.nextStep("true");
    }
  };

  const checkAbha = async (abha1, abha2, abha3, abha4, selectedOption) => {
    if (otp === "") {
      setOtperr("Please enter OTP");
    } else {
      setOtperr("");
      setLoading(true);
      try {
        const txnid = sessionStorage.getItem("txnId");
        const abhano = `${abha1}-${abha2}-${abha3}-${abha4}`;
        switch (selectedOption) {
          case "ABHA":
            var jsonBody = {
              number: abhano,
              loginType: "ABHA",
              otpType: "ABHA_MOBILE",
              otp: otp,
              txnId: txnid,
              mobileNumber: "",
            };
            break;
          case "Aadhar":
            var jsonBody = {
              number: abhano,
              loginType: "ABHA",
              otpType: "AADHAR_MOBILE",
              otp: otp,
              txnId: txnid,
              mobileNumber: "",
            };
        }
        const resp = await post("/v1/abha/login/verify", jsonBody);
        const abhaDetails = { token: resp?.tokens?.token };
        sessionStorage.setItem("AbhaCreation", JSON.stringify(abhaDetails));
        if(resp?.authResult=='failed'){
        toast.error(resp?.message);
        setLoading(false);
        }
        else{
        toast.success("OTP verified successfully");
        calluser(resp);
        setLoading(false);
        }
      } catch (error) {
        setUserAnswer("");
        setLoading(false);
      }
    }
  };

  const calluser = async (resp) => {
    setLoading(true);
    await fetch(
      "http://ac99c7f6dfac8444bb96c5f59fae927d-15dd478b86e9eeed.elb.ap-south-1.amazonaws.com:8080/api/v1/abha/login/verify/user",
      {
        method: "POST",
        body: JSON.stringify({
          abhaAddress: resp.users[0].abhaAddress,
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
    <div>
      {!tab2visibility && (
        <>
          <div className="nopadding col-lg-4 col-md-10 ">
            <label
              htmlFor="exampleInputEmail1"
              className="label-text form-label"
            >
              Enter ABHA Number
              <span className="redasterisk">*</span>
            </label>
            <div className="abhano">
              <AutoTabProvider>
                <input type="text" className='form-control abhapart1' value={aadharPart1} placeholder="00" onChange={(e) => handleInputChange(e, "part1")} maxLength={2} tabbable/>
                <input type="text" className='form-control' value={aadharPart2} onChange={(e) => handleInputChange(e, "part2")} maxLength={4} tabbable placeholder="0000" />
                <input type="text" className='form-control' value={aadharPart3} onChange={(e) => handleInputChange(e, "part3")} maxLength={4} tabbable placeholder="0000" />
                <input type="text" className='form-control' value={aadharPart4} onChange={(e) => handleInputChange(e, "part4")} maxLength={4} tabbable placeholder="0000" />
              </AutoTabProvider>
            </div>

            {abhaerr && <pre style={{ color: "red" }}>{abhaerr}</pre>}

            <div id="accordionExample" className="row">
              <div className="col-lg-8 col-md-6 col-10 nopadding">
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
          </div>
          <button onClick={validate} className="create-btn float-end">
            Next
          </button>
        </>
      )}

      {tab2visibility && (
        <div>
          <label htmlFor="exampleInputEmail1" className="form-label label-text">
            Validate Using
          </label>
          <div className="d-flex justify-content-center optiondiv">
            <label className="radio-label">
              <input
                type="radio"
                value="Aadhar"
                checked={selectedOption === "Aadhar"}
                onChange={(event) =>
                  onOptionChange(
                    event,
                    aadharPart1,
                    aadharPart2,
                    aadharPart3,
                    aadharPart4
                  )
                }
              />
              <b className="mx-2">
                OTP on mobile number linked with Aadhaar number
              </b>
            </label>
            &nbsp;&nbsp;
            <label className="radio-label">
              <input
                type="radio"
                value="ABHA"
                checked={selectedOption === "ABHA"}
                onChange={(event) =>
                  onOptionChange(
                    event,
                    aadharPart1,
                    aadharPart2,
                    aadharPart3,
                    aadharPart4
                  )
                }
              />
              <b className="mx-2">
                OTP on mobile number linked with ABHA number
              </b>
            </label>
            <br></br>
          </div>
          <br></br>
          {otpvisibile && (
            <>
              {" "}
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
                {otperr && <pre style={{ color: "red" }}>{otperr}</pre>}

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
              
              <button
                onClick={() =>
                  checkAbha(
                    aadharPart1,
                    aadharPart2,
                    aadharPart3,
                    aadharPart4,
                    selectedOption
                  )
                }
                className="create-btn float-end"
              >
                Next
              </button>
            </>
          )}
        </div>
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

export default Abhanumber;
