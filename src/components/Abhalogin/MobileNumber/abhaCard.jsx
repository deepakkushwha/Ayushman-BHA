import React,{ useState, useEffect } from 'react';
import Header from '../../header/header';
import { toast } from 'react-toastify';
import Loader from '../../../services/loader';
import imgg from '../../../assets/demoImg.jpeg';

export default function AbhaCard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const storedObject = sessionStorage.getItem('AbhaCreation');
    var abhastorageData = JSON.parse(storedObject);
    const txnId = sessionStorage.getItem('txnId');
   
    useEffect(() => {
        setUsers(abhastorageData?.users)
       }, []);
       
       const verify = async (resp) => {
        setLoading(true);
        await fetch(
          "http://ac99c7f6dfac8444bb96c5f59fae927d-15dd478b86e9eeed.elb.ap-south-1.amazonaws.com:8080/api/v1/abha/login/verify/user",
          {
            method: "POST",
            body: JSON.stringify({
              abhaAddress: resp,
              txnId: txnId,
            }),
            headers: {
              "Content-Type": "application/json",
              "tToken": abhastorageData?.token
            },
          }
        )
          .then((response) => response.json())
          .then((resp) => {
            setLoading(false);
            const abhaDetails = {
              indentifire: 'ABHAlogin',
              token: resp?.token,
            //     token:abhastorageData?.token,
            //   users:abhastorageData?.users,
              
            }
            sessionStorage.setItem('AbhaCreation', JSON.stringify(abhaDetails));
            window.location.href = "/user-Profile";
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error?.message);
          });
      };



    return (
        <>
            <Header />
            <div className="createabha create-abha-card container">
                <div className="profile-card-section">
                    <div className="row">
                      <h5 className='mb-3'>We have found the following ABHA number linked to provided mobile number. Select the ABHA profile you wish to login.</h5>
                      {users && users.map((item, index) => {
                        return (
                    <div className="col-4" key={index}>
                            <div className="card nopadding">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <img src={`data:image/png;base64,${item?.profilePhoto}`}  alt="" />
                                        </div>
                                        <div className="col-8">
                                            <p className='username'>{item?.fullName ? item?.fullName : '-'}</p>
                                            <p className={item.kycStatus=='VERIFIED' ?'verified' :'pending'}>
                                                {item.kycStatus=='VERIFIED' ?
                                                <i class="fa fa-check-circle-o" aria-hidden="true"></i> :
                                                <i class="fa fa-clock-o" aria-hidden="true"></i>}
                                                &nbsp;
                                                {item.kycStatus}
                                            </p>

                                            <div className="abha-number">
                                            <label htmlFor="">ABHA Number</label>
                                            <span className='abhanumber'>{item?.ABHANumber ? item?.ABHANumber : '-'}</span>
                                            </div>
                                            <div className="abha-number">
                                            <label htmlFor="">ABHA Address</label>
                                            <span className='abhanumber'> {item?.abhaAddress ? item?.abhaAddress : '-' }</span>
                                            </div>
          
                                        </div>
                                    </div>
                                </div>
                                <div className='view' onClick={() => verify(item?.abhaAddress)}>
                                  <p className='viewprofile'>View Profile <i class="fa fa-arrow-right" aria-hidden="true"></i></p>
                                </div>
                            </div>
                        </div>
                        )})}
                    {/* {users && users.map((item, index) => {
                    return (
                        <div className="col-4" key={index}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-8" onClick={() => verify(item.abhaAddress)}>

                                    <label htmlFor="">Full Name : <span> {item.fullName} </span></label>
                                    <label htmlFor="">Abha Address : <span> {item.abhaAddress} </span> </label>
                                    <label htmlFor="">Kyc Status : <span> {item.kycStatus} </span> </label>
                                    <label htmlFor="">Status : <span> {item.status} </span> </label>
                                    </div>
                                  <div className="col-4">
                                  <img src={`data:image/png;base64,${item?.profilePhoto}`} alt="" />
                                  </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})} */}

                    </div>

                </div> 
            </div>
            {!loading ? "" : <div className="overlay"><Loader /></div>}
        </>
    )
}
