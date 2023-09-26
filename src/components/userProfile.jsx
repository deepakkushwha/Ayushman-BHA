import React, { useEffect, useState } from 'react';
import './userProfile.css';
import Logoutabha from '../components/header/logoutabha';
import Loader from '../services/loader'
import { toast } from 'react-toastify';

export default function UserProfile() {
    const [data, setData] = useState([]);
    const [mobilerr, setmobilerr] = useState(true);
    const [loading, setLoading] = useState(false);

    const mobilenumber = (e) => {
        const input = e.target.value;
        setData({ mobile: input });
        const isValid = /^[0-9]{10}$/g.test(input);
        setData({ mobile: input });
        setmobilerr(isValid);
    }

    useEffect(() => {
        getuserProfile();
    }, []);

    const getuserProfile = () => {
        var apiUrl;
        var headers;
        setLoading(true);
        const storedObject = sessionStorage.getItem('AbhaCreation');
        var abhastorageData = JSON.parse(storedObject);

        if (abhastorageData?.indentifire == "ABHAlogin") {
            headers = { 'xToken': abhastorageData?.token }
            apiUrl = 'http://ac99c7f6dfac8444bb96c5f59fae927d-15dd478b86e9eeed.elb.ap-south-1.amazonaws.com:8080/api/v1/abha/login/profile?xToken';
        }
        else {
            headers = { 'xToken': abhastorageData?.token }
            apiUrl = 'http://ac99c7f6dfac8444bb96c5f59fae927d-15dd478b86e9eeed.elb.ap-south-1.amazonaws.com:8080/api/v1/abha/enrollment/profile';
        }
        try{
        fetch(apiUrl, { headers: headers })
            .then(response => response.json())
            .then(json => {
                setData(json);
                setLoading(false);

            })
        }catch(err){
            setLoading(false);
            toast.error("Something Went wrong!")
        }
    }

    return (
        <>
            <Logoutabha />
            <div className="container">
                <div className="user-profile">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-8 col-md-12 col-sm-12">

                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-6">
                                            <label htmlFor="" className='label-text'><span>ABHA Address</span></label> <br />
                                            <label htmlFor="" className='profile-text'><span>{data?.abhaAddress ? data?.abhaAddress : data?.preferredAbhaAddress}</span></label>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-6">
                                            <label htmlFor="" className='label-text'><span>ABHA Number</span></label> <br />
                                            <label htmlFor="" className='profile-text'><span>{data?.abhaNumber ? data?.abhaNumber : data?.ABHANumber}</span></label>
                                        </div>
                                    </div><br></br>

                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-4 ">
                                            <label htmlFor="" className='label-text'><span>Name</span></label> <br />
                                            <label htmlFor="" className='profile-text'><span>{data?.name ? data.name :data.fullName}</span></label>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-4">
                                            <label htmlFor="" className='label-text'><span>Gender</span></label><br />
                                            <label htmlFor="" className='profile-text'><span>{data.gender}</span></label>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-4">
                                            <label htmlFor="" className='label-text'><span>Date of birth</span></label><br />
                                            <label htmlFor="" className='profile-text'><span>{data?.dateOfBirth ? data.dateOfBirth : data?.dayOfBirth +"-"+ data?.monthOfBirth +"-"+ data?.yearOfBirth}</span></label>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <label htmlFor="" className='label-text'><span>Address</span></label> <br />
                                            <label htmlFor="" className='profile-text'><span>{data.address}</span></label>
                                        </div>
                                    </div>


                                    <div className="row mt-4">
                                        <div className="col-lg-4 col-md-4 col-4">
                                            <label htmlFor="" className='label-text'><span>District</span></label> <br />
                                            <label htmlFor="" className='profile-text'><span>{data.districtName?data.districtName:'-'}</span></label>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-4">
                                            <label htmlFor="" className='label-text'><span>State</span></label><br />
                                            <label htmlFor="" className='profile-text'><span>{data.stateName}</span></label>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-4">
                                            <label htmlFor="" className='label-text'><span>Pincode</span></label><br />
                                            <label htmlFor="" className='profile-text'><span>{data.pincode?data.pincode:data.pinCode}</span></label>
                                        </div>
                                    </div>

                                    <div className="row mt-4 phonenumber">
                                        <div className="col-lg-6 col-md-6 col-12 ">
                                            <label htmlFor="exampleInputEmail1" className="label-text form-label">Mobile number <span className="redasterisk">*</span>
                                            </label>
                                            <div className="input-group number-section input-group-lg col-md-4">
                                                <span className="countrynumber" >
                                                    +91
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Mobile Number"
                                                    value={data.mobile}
                                                    // onChange={mobilenumber}
                                                />
                                            </div>

                                            {!mobilerr && <div style={{ color: "red" }}>Please enter a valid 10-digit phone number.</div>}

                                        </div>


                                        <div className="col-lg-6 col-md-6 col-12">
                                            <label htmlFor="exampleInputEmail1" className="label-text form-label">Email address</label>
                                            <div className="input-group input-group-lg col-md-4">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Email address"
                                                    value={data.email}
                                                />
                                            </div>
                                            {!mobilerr && <div style={{ color: "red" }}>Please enter a valid 10-digit phone number.</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-12 col-sm-12">
                                    <div className="profile-box">
                                        <div className="profile-photo">
                                            <img src={`data:image/png;base64,${data?.profilePhoto}`} alt="" />

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='btn btn-primary btn-lg' onClick={() => window.location.href = '/userlogin'}> Get Card</button>

            </div>

            {!loading ? "" : <div className="overlay"><Loader /></div>}

        </>
    )
}
