import React from "react";
import ReactDom from 'react-dom';
import { useState } from "react";
function LoginModal( {closeModal}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const callApi = async (e) => {
        e.preventDefault();
        const result = await fetch("http://127.0.0.1:5000/Register", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        let resJson = await result.json();
        console.log(resJson);
    };

        return ReactDom.createPortal(
            <div className='modalBackground'>
                <div className="modalContainer">
                    <button onClick={() => closeModal(false)} className="titleCloseBtn">X</button>
                        <form onSubmit={callApi}>
                            <div align="center" className="title">
                                <h2>登入</h2>
                            </div>
                            <div>
                                <h3 align="center">電子郵件</h3>
                                <input placeholder="Email" className="inputbar" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div>
                                <h3 align="center">密碼</h3>
                                <input type="password" placeholder="Password" className="inputbar" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            </div>
                            
                            <div align='center'>
                                <button className='forget-password'>忘記密碼？</button><br/>
                            </div>
                            <div className='login-button' align='center'>
                                <button className='submit' onSubmit={callApi}>登入</button>
                                <button className='submit'>註冊</button>
                            </div>
                        </form>
                </div>
            </div>,
            document.getElementById('portal')
        )

}

export { LoginModal };