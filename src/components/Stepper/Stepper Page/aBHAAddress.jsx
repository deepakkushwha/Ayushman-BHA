import React, { useState, useEffect } from "react";
import { post, fetchData } from "../../../services/services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../services/loader";

export default function ABHAAddress() {
  const [abhaAaddress, setabhaAaddress] = useState("");
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const storedObject = sessionStorage.getItem("AbhaCreation");
  var abhastorageData = JSON.parse(storedObject);
  var isvalid = false;
  const reg = /^(?!.*[._]$)(?!^[._])[A-Za-z0-9._]{8,18}$/



  const handleAbhaAddress = (e) => {
    let inputString = e.target.value;
     if (inputString.length < 8 || inputString.length > 18) {
      setErr('Input must be between 8 and 18 characters');
      isvalid=false;
    }else if (!reg.test(inputString)) {
      setErr('Only "." or "_" is allowed and special characters should not be in the beginning or at the end');
      isvalid = false;
    } else {
      setErr("");
      isvalid = true;
    }
    setabhaAaddress(e.target.value);
  };

  const Submit = async () => {
    if (abhaAaddress === "") {
      setErr("Please enter/select ABHA addresa");
      isvalid = false;
    }else if(abhaAaddress.length < 8 ){
      setErr('Input must be between 8 and 18 characters');
      isvalid=false;
    } else if (!reg.test(abhaAaddress)) {
      setErr('Only "." or "_" is allowed and special characters should not be in the beginning or at the end');
      isvalid = false;
    } else {
      isvalid = true;
      setErr("");
    }

    if (isvalid) {
      setErr("");
      setLoading(true);
      try {
        const newData = {
          txnId: abhastorageData?.txnId,
          abhaAddress: abhaAaddress,
          preferred: 1,
        };
        const result = await post("/v1/abha/enrollment/abha-address", newData);
        toast.success("ABHA Number created successfully");
        window.location.href = "/user-Profile";
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
      
    }
  };

  useEffect(() => {
    setLoading(true);
    const headers = { transactionId: abhastorageData?.txnId };
    const apiUrl = "/v1/abha/enrollment/abha-address/suggestion";
    fetchData(apiUrl, { headers: headers })
      .then((result) => {
        setData(result?.abhaAddressList);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const Suggestionitem = (event) => {
    setabhaAaddress(event);
  };
  return (
    <>
      <div className="card abhaaddress">
        <div className="card-body">
          <div className="row mb-3">
            <h5>Create ABHA Number Using Aadhaar</h5>
            <p>ABHA (Ayushman Bharat Health Account) address is a unique username that allows you to share and access your health records digitally. It is similar to an email address, but it is only used htmlFor health records. To create ABHA address, it should have Min-8 characters, Max-18 characters, special characters allowed-1 dot () and/or 1 underscore (_).</p>
            <label htmlFor="exampleFormControlInput1" className=" label-text text-start">Enter ABHA address</label>
            <div className=" col-lg-4 col-md-19 col-12">
              <input type="text"
                className="form-control"
                placeholder=""
                value={abhaAaddress}
                onChange={handleAbhaAddress}
                maxLength={18}
              />
            </div>
          </div>
          {err && <pre style={{ color: "red" }}>{err}</pre>}

          <div className="Suggestions">
            <label className=" label-text text-start">Suggestions</label>
            <div className="sugg-data">
              {data &&
                data.map((item, index) => {
                  return (
                    <span
                      className="data-list"
                      key={item}
                      onClick={() => Suggestionitem(item)}
                    >
                      {item}
                    </span>
                  );
                })}
            </div>
          </div>

          <div className="text-end mt-5">
            <button className="create-btn" onClick={Submit}>
              Create ABHA
            </button>
          </div>
        </div>
      </div>

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
