import React, { useEffect, useState } from 'react';
import Loader from '../../../services/loader';
import Abhanumber from './Abhanumber';
import Abhaaddress from './Abhaaddress';

const Abha = (props) => {
  const [show, setshow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedabhaOption, setabhaSelectedOption] = useState("ABHA Number");
  const [showradio, setshowradio] = useState(false);

  const handleOptionChange = (event) => {
    setabhaSelectedOption(event.target.value);
  };


  const collectionStep = (show) => {
    setshowradio(show)
  };

  return (
    <div className="tabcontent">
      {!showradio ?
        <div className="col-md-12">
          <div className="abha-radio-option">
            <div className="select-option">
              <label>
                <input
                  type="radio"
                  name="options"
                  value="ABHA Number"
                  checked={selectedabhaOption === 'ABHA Number'}
                  onChange={handleOptionChange}
                />
                ABHA Number
              </label>
              <label>
                <input
                  type="radio"
                  name="options"
                  value="ABHA ADDRESS"
                  checked={selectedabhaOption === 'ABHA ADDRESS'}
                  onChange={handleOptionChange}
                />
                ABHA Address
              </label>
            </div>
          </div>
        </div>
        : ""}
      {selectedabhaOption == 'ABHA Number' ? <Abhanumber activeTab={props.activeTab} nextStep={collectionStep} /> : <Abhaaddress activeTab={props.activeTab} nextStep={collectionStep} />}
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

export default Abha;