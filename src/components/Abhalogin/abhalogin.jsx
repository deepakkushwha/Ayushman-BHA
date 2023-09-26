import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import MobileNumber from './MobileNumber/mobileNumber';
import Abha from './Abha';

const Abhalogin = () => {
  const [basicActive, setBasicActive] = useState("tab2");

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
  };
  return (
    <div className="createabha container">
      <h5 className="mb-4">Verify ABHA</h5>
      {/* <MDBTabs className="mb-3">
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("tab1")}
            active={basicActive === "tab1"}
          >
            Mobile Number
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("tab2")}
            active={basicActive === "tab2"}
          >
            ABHA Number / Address
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs> */}
      <MDBTabsContent>
        <MDBTabsPane show={basicActive === "tab1"}>
          <MobileNumber activeTab={basicActive}/>
        </MDBTabsPane>
        <MDBTabsPane show={basicActive === "tab2"}>
          <Abha activeTab={basicActive}/>
        </MDBTabsPane>
      </MDBTabsContent>

    </div>
  );
};

export default Abhalogin;