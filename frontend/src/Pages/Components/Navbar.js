import '../../css/Navbar.css';
import { LoginModal } from './LoginModal';
import React, { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { Homepage } from "../Homepage";

const Navbar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const calllogout = async (e) => {
        e.preventDefault();
        localStorage.removeItem('jwt');
        localStorage.removeItem('refresh_token');
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
                <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/explore'> 探索 </NavLink>
                <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/MakeSurvey'> 製作 </NavLink>
                <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/Instruction'> 說明 </NavLink>
                <div className="nav-option user-dropdown" onClick={() => setModalOpen(true)}>
                    User
                    <div className="user-dropdown-options" >
                        <button>管理問卷</button>
                        <button>個人資料</button>
                        <button>登入</button>
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
                <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/explore'> 探索 </NavLink>
                <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/MakeSurvey'> 製作 </NavLink>
                <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/Instruction'> 說明 </NavLink>
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