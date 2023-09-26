import { React, useState } from 'react'
import Stepper from 'react-stepper-horizontal';
import Collection from './Stepper Page/collection';
import Authentication from './Stepper Page/authentication';
import ABHAAddress from './Stepper Page/aBHAAddress';
import './Stepper Page/stepper.scss';
  
export default function Steppers() {
  
  const collectionStep = (step) => {
   setActiveStep(activeStep + step)
  };


    const [ activeStep, setActiveStep ] = useState(0);
    const steps = [
      { title: 'Consent Collection', onClick: () => setActiveStep(0) },
      { title: ' Aadhaar Authentication ', onClick: () => setActiveStep(1) },
      { title: 'ABHA Address Creation', onClick: () => setActiveStep(2) },
    ];
    
    function getSectionComponent() {
        switch(activeStep) {
          case 0: return <Collection nextStep={collectionStep}/>;
          case 1: return <Authentication nextStep={collectionStep}/>;
          case 2: return <ABHAAddress/>;
          default: return null;  
        }
      }
   

  return (
    <div className='createabhas'>
     <Stepper
        steps={steps}
        activeStep={activeStep}/>

      <div className="container stepper-section mt-2">
        { getSectionComponent()  }        
      </div>
  </div>

  )
}
