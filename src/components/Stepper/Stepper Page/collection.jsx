import React, { useState } from 'react';
import { post } from '../../../services/services';
import VerificationInput from "react-verification-input";
import Loader from '../../../services/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Collection(props) {

  const [aadharNumber, setAadharNumber] = useState('');
  const [iAgree, setIAgree] = useState(false);
  const [Agree, setAgree] = useState(false);
  const [agreemsg, setAgreemsg] = useState(false);



  const [isValid, setIsValid] = useState(true);
  const [num1, setNum1] = useState(getRandomNumber());
  const [num2, setNum2] = useState(getRandomNumber());
  const [answer, setAnswer] = useState(num1 + num2);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
  const [captchaerr, setCaptchaerr] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
  });

  const handleCheckboxChange = (name) => {
    setCheckboxes({
      ...checkboxes,
      [name]: !checkboxes[name],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allCheckboxesAreChecked = Object.values(checkboxes).every((value) => value);
    if (allCheckboxesAreChecked) {
      setAgreemsg(false);
      Submit();
    } else {
      setAgreemsg(true);
    }
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
    setUserAnswer('');
    setIsCaptchaSolved(false);
  }


  function Submit() {
    if (userAnswer === "") {
      setCaptchaerr("Captcha field cannot be empty");
    } else if (parseInt(userAnswer, 10) === answer) {
      setIsCaptchaSolved(true);
      setCaptchaerr('');
      // if (iAgree == true) {
        if (isValid == true) {
          aadharNumber !== "" ? reqOTP() : setIsValid(false);
        }
      // }
    } else {
      setCaptchaerr('Please enter a valid Captcha');
      generateCaptcha();
    }
  }


  const reqOTP = async () => {
    setLoading(true)
    try {
      const newData = {
        "number": aadharNumber,
        "loginType": "",
        "otpType": "",
        "otp": "",
        "txnId": "",
        "mobileNumber": ""
      };
      const result = await post('/v1/abha/enrollment/otp/request', newData);
      const abhaDetails = {
        txnId: result?.txnId,
        aadharNumber: aadharNumber,
        message: result?.message
      }
      sessionStorage.setItem('AbhaCreation', JSON.stringify(abhaDetails));
      const stepCount = 1;
      setUserAnswer("")
      toast.success(result?.message);
      props.nextStep(stepCount);
      setLoading(false)
    } catch (error) {
      setUserAnswer("")
      setLoading(false)
    }
  };



  const inputChange = (value) => {
    const aadharRegex = /^\d{12}$/;
    setAadharNumber(value);
    if (aadharRegex.test(value)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }

  const setCaptcha = (e) => {
    const input = e.target.value;
    setUserAnswer(input);
  }

  return (
    <div className='collection-stepper'>
      <div className="card cardRespo">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-sm-6 col-lg-8 col-md-12 col-xs-6 ">
              <label htmlFor="exampleFormControlInput1" className="label-text text-start">Aadhaar Number</label>  <span className="redasterisk">*</span>
              <VerificationInput classNames={{
                container: "aadhar-container",
                character: "character",
              }}
                className="form-control"
                length={12} onChange={inputChange} validChars="0-9" inputProps={{ inputMode: "numeric" }} placeholder="_" />
              {!isValid && <p style={{ color: "red" }}>Invalid Aadhaar Card Number</p>}

              <p className="infotext" style={{ color: "rgb(101, 84, 192)", marginTop: "10px" }}>

                <i className="fa fa-info-circle " aria-hidden="true"></i>
                Please ensure that mobile number is linked with Aadhaar as it will be required for OTP authentication.
                If you do not have a mobile number linked, visit the nearest ABDM participating facility and seek assistance.</p>
            </div>

          </div>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed label-text" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                  Terms-and-Conditions
                </button>
              </h2>

              <div id="collapseTwo" className={agreemsg ? 'accordion-collapse' : 'accordion-collapse collapse'} aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  I hereby declare that:

                  <div className="form-check my-4">
                    <input className={agreemsg ? 'form-check-input agree-checkbox errorcheckbox' : 'form-check-input agree-checkbox'}
                      type="checkbox"
                      isChecked={checkboxes.checkbox1}
                      onChange={() => handleCheckboxChange('checkbox1')}

                      id="flexCheckDefault" />
                    <label className="form-check-label label-text" htmlFor="flexCheckDefault">
                      I am voluntarily sharing my Aadhaar Number / Virtual ID issued by the Unique Identification Authority of India (“UIDAI”), and my demographic information for the purpose of creating an Ayushman Bharat Health Account number (“ABHA number”) and Ayushman Bharat Health Account address (“ABHA Address”). I authorize NHA to use my Aadhaar number / Virtual ID for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication.
                      <span className="redasterisk">*</span>
                    </label>
                  </div>

                  <div className="form-check my-4">
                    <input className="form-check-input agree-checkbox" type="checkbox"
                      onChange={(e) => setAgree(e.target.checked)}
                      id="flexCheckDefault2" />
                    <label className="form-check-label label-text" htmlFor="flexCheckDefault2">
                      I intend to create Ayushman Bharat Health Account Number (“ABHA number”) and Ayushman Bharat Health Account address (“ABHA Address”) using document other than Aadhaar. (Click here to proceed further
                    </label>
                  </div>

                  <div className="form-check my-4">
                    <input className={agreemsg ? 'form-check-input agree-checkbox errorcheckbox' : 'form-check-input agree-checkbox'} type="checkbox"
                      isChecked={checkboxes.checkbox2}
                      onChange={() => handleCheckboxChange('checkbox2')}
                      id="flexCheckDefault3" />
                    <label className="form-check-label label-text" htmlFor="flexCheckDefault3">
                      I consent to usage of my ABHA address and ABHA number for linking of my legacy (past) government health records and those which will be generated during this encounter.
                      <span className="redasterisk">*</span>
                    </label>
                  </div>

                  <div className="form-check my-4">
                    <input className={agreemsg ? 'form-check-input agree-checkbox errorcheckbox' : 'form-check-input agree-checkbox'} type="checkbox"
                      isChecked={checkboxes.checkbox3}
                      onChange={() => handleCheckboxChange('checkbox3')}

                      id="flexCheckDefault4" />
                    <label className="form-check-label label-text" htmlFor="flexCheckDefault4">
                      I authorize the sharing of all my health records with healthcare provider(s) for the purpose of providing healthcare services to me during this encounter.
                      <span className="redasterisk">*</span></label>
                  </div>

                  <div className="form-check my-4">
                    <input className={agreemsg ? 'form-check-input agree-checkbox errorcheckbox' : 'form-check-input agree-checkbox'} type="checkbox"
                      isChecked={checkboxes.checkbox4}
                      onChange={() => handleCheckboxChange('checkbox4')}

                      id="flexCheckDefault5" />
                    <label className="form-check-label label-text" htmlFor="flexCheckDefault5">
                      I consent to the anonymization and subsequent use of my government health records for public health purposes.
                      <span className="redasterisk">*</span></label>
                  </div>

                  <div className="child-checkbox">
                    <div className="form-check my-4">
                      <input className="form-check-input agree-checkbox" type="checkbox" onChange={(e) => setAgree(e.target.checked)} id="flexCheckDefault6" />
                      <label className="form-check-label label-text" htmlFor="flexCheckDefault6">
                        I consent to the anonymization and subsequent use of my government health records for public health purposes.
                      </label>
                    </div>
                    <div className="form-check my-4">
                      <input className="form-check-input agree-checkbox" type="checkbox" onChange={(e) => setAgree(e.target.checked)} id="flexCheckDefault7" />
                      <label className="form-check-label label-text" htmlFor="flexCheckDefault7">
                        I consent to the anonymization and subsequent use of my government health records for public health purposes.
                      </label>
                    </div>
                  </div>
















                </div>
              </div>
            </div>
          </div>



          <div className="row">
            <div className="col-sm-6 col-lg-3 col-md-6 col-xs-6">
              <div className='captchabodr'>
                <label htmlFor="exampleInputEmail1" className="form-label  label-text"> Captcha<span className='redasterisk'>*</span></label>
                <div className='d-flex captchastyle'>
                  <p className='captchades'>{num1} + {num2} = </p>
                  <input
                    type='number'
                    className="form-control numberarrow"
                    placeholder='Enter answer'
                    value={userAnswer}
                    onChange={setCaptcha}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={generateCaptcha} viewBox="0 0 512 512"><path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" /></svg>
                </div>

              </div>
              {captchaerr && <p style={{ color: "red" }}>{captchaerr}</p>}
            </div>
            <div className="col-sm-6 col-lg-6 col-md-6 col-xs-6">
            </div>
          </div>

          <div className="text-end">

            {/* <button className='create-btn' onClick={Submit} >Next</button> */}
            <button className='create-btn' onClick={handleSubmit} >Next</button>

          </div>
        </div>

      </div>
      <ToastContainer />
      {!loading ? "" : <div className="overlay"><Loader /></div>}


    </div>
  )
}