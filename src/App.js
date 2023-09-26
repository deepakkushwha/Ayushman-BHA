import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/main/home';
import Abhalogin from './pages/abhalogin';
import UserLogin from '../src/components/userLogin';
import UserProfile from './components/userProfile';
import AbhaCard from './components/Abhalogin/MobileNumber/abhaCard';
import Createabha from './pages/createabha';

function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/abha-Card" element={<AbhaCard />} />
                    <Route path="/user-Profile" element={<UserProfile />} />
                    <Route path="/abhalogin" element={<Abhalogin />} />
                    <Route path="/abha" element={<Createabha />} />
                    <Route path="/userlogin" element={<UserLogin />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
