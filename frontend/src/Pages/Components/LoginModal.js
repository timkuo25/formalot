import React from "react";
import ReactDom from 'react-dom';
function LoginModal( {closeModal}){

    return ReactDom.createPortal(
        <div className='modalBackground'>
            <div className="modalContainer">
                <button onClick={() => closeModal(false)} className="titleCloseBtn">X</button>
                    <div align="center" className="title">
                        <h2>登入</h2>
                    </div>
                    <div>
                        <h3 align="center">電子郵件</h3>
                        <input placeholder="Email" className="inputbar"></input>
                    </div>
                    <div>
                        <h3 align="center">密碼</h3>
                        <input placeholder="Password" className="inputbar"></input>
                    </div>
                    
                    <div align='center'>
                        <button className='forget-password'>忘記密碼？</button><br/>
                    </div>
                    <div className='login-button' align='center'>
                        <button className='submit'>登入</button>
                        <button className='submit'>註冊</button>
                    </div>
            </div>
        </div>,
        document.getElementById('portal')
    )

}

export { LoginModal };