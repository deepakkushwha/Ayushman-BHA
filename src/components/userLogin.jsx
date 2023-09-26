import React, { useEffect, useState, useRef } from 'react';
import Logoutabha from './header/logoutabha'
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../services/loader';

function UserLogin() {
  const [users, setUsers] = useState([]);
  const [showbtn, setshowbtn] = useState(false);
  const [loading, setLoading] = useState(false);


  const storedObject = sessionStorage.getItem('AbhaCreation');
  var abhastorageData = JSON.parse(storedObject);

  useEffect(() => {
    setLoading(true);
    var apiUrl;
    var headers;


    if (abhastorageData?.indentifire == "ABHAlogin") {
      headers = { 'xToken': abhastorageData?.token }
      apiUrl = 'http://ac99c7f6dfac8444bb96c5f59fae927d-15dd478b86e9eeed.elb.ap-south-1.amazonaws.com:8080/api/v1/abha/login/phrCard?xToken';
    }
    else {
      headers = { 'enrollCardToken': abhastorageData?.token }
      apiUrl = 'http://ac99c7f6dfac8444bb96c5f59fae927d-15dd478b86e9eeed.elb.ap-south-1.amazonaws.com:8080/api/v1/abha/enrollment/abha-card';
    }

    fetch(apiUrl, { headers: headers })
      .then(response => {
        return response.blob()
      })
      .then(data => {
        const blob = new Blob([data], { type: 'image/png' })
        const imgurl = URL.createObjectURL(blob)
        setUsers(imgurl)
        setshowbtn(true)
        setLoading(false);

      })

  }, [])


  const createPDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a3");
    const data = await document.querySelector("#pdf");
    pdf.html(data).then(() => {
      pdf.save("ABHA Card.pdf");
    });
  };


  const elementToCapture = useRef(null);

  const handleCaptureClick = () => {
    if (elementToCapture.current) {
      html2canvas(elementToCapture.current).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'ABHA Card.png';
        link.click();
      });
    }
  };
  return (
    <>
      <Logoutabha />
      <center>
        <div id="pdf" ref={elementToCapture}>
          <img className='img-fluid' src={users} />
        </div>
        {showbtn ? <>
          {/* <button className='btn mb-4 loginBtn' onClick={createPDF}><i className="fa fa-file-pdf-o"></i> Download PDF</button> */}
          <button className='btn mb-4 loginBtn ' onClick={handleCaptureClick}><i className="fa fa-file-image-o"></i> Download Abha Card</button>
        </>
          : ""}
      </center>
      <ToastContainer />
      {!loading ? "" : <div className="overlay"><Loader /></div>}
    </>
  );
}

export default UserLogin;