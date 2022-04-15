import { LoginModal } from './LoginModal';
import React, { useState } from 'react';


const Navbar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    return(
        <header className="header">
            <h1 className="app-title"><a href='/'>Formalot</a></h1>
            <nav className="navbar">
                <button className="nav-option">探索</button>
                <button className="nav-option">製作</button>
                <a className="nav-option" href='/instruction'>說明</a>
                <button className="nav-option user-dropdown" onClick={() => setModalOpen(true)}>
                    User
                    <div className="user-dropdown-options" >
                        <button>管理問卷</button>
                        <button onClick={()=>{window.location.href = "/Profile"}}>個人資料</button>
                    </div>
                </button>
                {modalOpen && <LoginModal closeModal={setModalOpen} />}
            </nav>
        </header>
    )
}

export { Navbar };