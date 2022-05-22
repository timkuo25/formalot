import '../../css/Navbar.css';
import { LoginModal } from './LoginModal';
import React, { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from 'i18next';

const Navbar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [navActive, setNavActive] = useState(false);
    const [lngmodalOpen, setlngModalOpen] = useState(false);
    const navigate = useNavigate();
    //多國語言切換
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
       i18n.changeLanguage(lng);
    };

    const calllogout = async (e) => {
        e.preventDefault();
        localStorage.removeItem('jwt');
        localStorage.removeItem('refresh_token');
        console.log("Logout Success");
        alert("登出成功");
        window.location.reload();
        window.location.href = "/"
        //navigate(<Homepage/>);
    };
    const clearform =()=>{
        window.sessionStorage.removeItem('form_info'); 
        window.sessionStorage.removeItem('form'); 
        //event.preventDefault();
      }


    if (!(localStorage.getItem('jwt'))){                // 未登入狀態
        return(
            <>
                <header className="header">
                    <h1 className="app-title"><a href='/'>Formalot</a></h1>
                    <nav className="navbar">
                        <div className='toggle-button' onClick={() => setNavActive(prev => !prev)}>
                            <span className='bar'></span>
                            <span className='bar'></span>
                            <span className='bar'></span>
                        </div>
                        <div className='navbar-links'>
                            <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/explore'> {t("探索")} </NavLink>
                    
                            <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/Instruction' > {t("說明")} </NavLink>
                            <div className="nav-option user-dropdown" onClick={() => setModalOpen(true)}>
                                {t("會員")}
                                <div className="user-dropdown-options" >
                                    <button>{t("管理問卷")}</button>
                                    <button>{t("個人資料")}</button>
                                    <button>{t("登入")}</button>
                                </div>
                            </div>
                            <div className="nav-option user-dropdown" onClick={() => setlngModalOpen(true)}>
                                {t("語言")}
                                <div className="user-dropdown-options" >
                                    <button onClick={() => changeLanguage("tw")}>{t("中文")}</button>
                                    <button onClick={() => changeLanguage("en")}>{t("英文")}</button>
                                </div>
                            </div>
                        </div>
                        {modalOpen && <LoginModal closeModal={setModalOpen} />}
                    </nav>
                </header>

                {/* Mobile  Navbar */}
                <div className='navbar-links-mobile' style={navActive ? {display: 'flex'} : null}>
                    <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/explore'> {t("探索")}  </NavLink>

                    <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/Instruction'> {t("說明")}  </NavLink>
                    <div className="nav-option user-dropdown" onClick={() => setModalOpen(true)}>
                        {t("會員")}
                        <div className="user-dropdown-options" >
                            <button>{t("管理問卷")}</button>
                            <button>{t("個人資料")}</button>
                            <button>{t("登入")}</button>
                        </div>
                    </div>
                    <div className="nav-option user-dropdown" onClick={() => setlngModalOpen(true)}>
                        {t("語言")}
                        <div className="user-dropdown-options" >
                            <button onClick={() => changeLanguage("tw")}>{t("中文")}</button>
                            <button onClick={() => changeLanguage("en")}>{t("英文")}</button>
                        </div>
                    </div>
                    {modalOpen && <LoginModal closeModal={setModalOpen} />}
                </div>
            </>
    
        )
    }

    else{                                           // 已登入狀態
        return(
            <>
                <header className="header">
                    <h1 className="app-title"><a href='/' onClick={clearform}>Formalot</a></h1>
                    <nav className="navbar">
                        <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/explore' onClick={clearform}> {t("探索")} </NavLink>
                        <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/MakeSurvey' onClick={clearform}> {t("製作問卷")}  </NavLink>
                        <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/Instruction' onClick={clearform}> {t("說明")} </NavLink>
                        <button className="nav-option user-dropdown">
                            {t("會員")}
                            <div className="user-dropdown-options" >
                                <button onClick={()=>{window.location.href = "/SurveyManagement";  window.sessionStorage.removeItem('form_info'); window.sessionStorage.removeItem('form'); }}>{t("管理問卷")}</button>
                                <button onClick={()=>{window.location.href = "/Profile"; window.sessionStorage.removeItem('form_info'); window.sessionStorage.removeItem('form'); }}>{t("個人資料")}</button>
                                <button onClick={calllogout}>{t("登出")}</button>
                            </div>
                        </button>
                        <div className="nav-option user-dropdown" onClick={() => setlngModalOpen(true)}>
                            {t("語言")}
                            <div className="user-dropdown-options" >
                                <button onClick={() => changeLanguage("tw")}>{t("中文")}</button>
                                <button onClick={() => changeLanguage("en")}>{t("英文")}</button>
                            </div>
                        </div>
                    </nav>
                </header>
                {/* Mobile  Navbar */}
                <div className='navbar-links-mobile' style={navActive ? {display: 'flex'} : null}>
                    <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/explore'> {t("探索")}  </NavLink>
                    <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/MakeSurvey'> {t("製作問卷")} </NavLink>
                    <NavLink className={(navData) => navData.isActive ? 'active-nav-option' : 'nav-option'} to='/Instruction'> {t("說明")} </NavLink>
                    <button className="nav-option user-dropdown">
                        User
                        <div className="user-dropdown-options" >
                            <button onClick={()=>{window.location.href = "/SurveyManagement"}}>{t("管理問卷")}</button>
                            <button onClick={()=>{window.location.href = "/Profile"}}>{t("個人資料")}</button>
                            <button onClick={calllogout}>{t("登出")}</button>
                        </div>
                    </button>
                    <div className="nav-option user-dropdown" onClick={() => setlngModalOpen(true)}>
                        {t("語言")}
                        <div className="user-dropdown-options" >
                            <button onClick={() => changeLanguage("tw")}>{t("中文")}</button>
                            <button onClick={() => changeLanguage("en")}>{t("英文")}</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    
}

export { Navbar };