import '../../css/Navbar.css';
import { LoginModal } from './LoginModal';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Homepage } from "../Homepage";

const Navbar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const calllogout = async (e) => {
        e.preventDefault();
        localStorage.removeItem('jwt');
        console.log("Logout Success");
        alert("Logout Success");
        window.location.reload();
        navigate(<Homepage/>);
    };
    if (!(localStorage.getItem('jwt'))){                // 未登入狀態
        return(
        
            <header className="header">
            <h1 className="app-title"><a href='/'>Formalot</a></h1>
            <nav className="navbar">
                <button className="nav-option" onClick={() => {window.location.href='explore'}}>探索</button>
                <button className="nav-option" onClick={() => {window.location.href='MakeSurvey'}}>製作</button>
                <a className="nav-option" href='/instruction'>說明</a>
                <div className="nav-option user-dropdown" onClick={() => setModalOpen(true)}>
                    User
                    <div className="user-dropdown-options" >
                        <button>管理問卷</button>
                        <button>個人資料</button>
                    </div>
                </div>
                {modalOpen && <LoginModal closeModal={setModalOpen} />}
            </nav>
        </header>
    
        )
    }

    else{                                           // 已登入狀態
        return(
        
            <header className="header">
            <h1 className="app-title"><a href='/'>Formalot</a></h1>
            <nav className="navbar">
                <button className="nav-option" onClick={() => {window.location.href='explore'}}>探索</button>
                <button className="nav-option" onClick={() => {window.location.href='MakeSurvey'}}>製作</button>
                <a className="nav-option" href='/instruction'>說明</a>
                <button className="nav-option user-dropdown">
                    User
                    <div className="user-dropdown-options" >
                        <button onClick={()=>{window.location.href = "/SurveyManagement"}}>管理問卷</button>
                        <button onClick={()=>{window.location.href = "/Profile"}}>個人資料</button>
                        <button onClick={calllogout}>登出</button>
                    </div>
                </button>
            </nav>
        </header>
    
        )
    }
    
}

export { Navbar };