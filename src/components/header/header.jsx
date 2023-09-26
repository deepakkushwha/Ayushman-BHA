import React from 'react';
import myImage from '../../assets/Logo-modified.png';

function Header() {
  const getTokerGenration = async () => {
    window.location.href = '/abhalogin';
  };

  return (
    <>




<nav className="navbar navbar-light bg-light bgnavbar">
  <div className="container containerRespo">
  <a className="navbar-brand" href="/">
    <div className='bgImgStyle'>
    <img src={myImage} alt="logo" className='logo'  />
    </div>
    <span className='logo-title'>The Oriental Insurance Company Limited </span>  
    </a>
    <div className=" loginRespo">
    {/* <button className='btn loginBtn loginResponse'  onClick={() => getTokerGenration()}>ABHA Login</button> */}
    </div>
    
    
  </div>
</nav>
    </>
  );
}

export default Header;