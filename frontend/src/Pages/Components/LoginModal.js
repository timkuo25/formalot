import React from "react";
import ReactDom from "react-dom";
import { useState } from "react";

function LoginModal( {closeModal}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 登入
    const callLoginApi = async (e) => {
        e.preventDefault();
        const result = await fetch("http://127.0.0.1:5000/Login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        let resJson = await result.json();
        if (resJson.access_token){
            localStorage.setItem('jwt', resJson.access_token);
            console.log("Login Success");
            alert("Login Success");
        }else{
            console.log(resJson);
            alert(resJson.message);
        };

    };

    // 登出
    const calllogout = async (e) => {
        e.preventDefault();
        localStorage.removeItem('jwt');
        console.log("Logout Success");
        alert("Logout Success");
   
    };

    // 更新使用者資訊
    const calluserupdate = async (e) => {
        e.preventDefault();
        const getprotected = await fetch('http://127.0.0.1:5000/UserUpdate',{
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({
                first_name: "testupdate",
                last_name : "",
                password : "",
                password2 : "",
            }),
        });
        const resdata = await getprotected;
        console.log(resdata);
        alert(resdata.message);
   
    };

    // 忘記密碼
    const [newpsw, setNewPsw] = useState("");
    const [newpsw2, setNewPsw2] = useState("");
    const [code, setCode] = useState("");
    const callforgetpasswordApi = async (e) => {
        e.preventDefault();
        const getprotected = await fetch('http://127.0.0.1:5000/ForgetPsw',{
            method: 'PUT',
            body: JSON.stringify({
                email: email,
                password : newpsw,
                password2 : newpsw2,
                code: code,
                session_code: sessionStorage.getItem('code')
            }),
        });
        const resdata = await getprotected;
        console.log(resdata);
        alert(resdata.message);

    };

    const callemailApi = async (e) => {
        e.preventDefault();
        const result = await fetch("http://127.0.0.1:5000/Email?condition=forget_psw", {
            method: "POST",
            body: JSON.stringify({
                email: email
            }),
        });
        let resJson = await result.json();
        console.log(resJson);
        alert(resJson.message);
        sessionStorage.setItem('code', resJson.code);
    };

        return ReactDom.createPortal(
            <div className='modalBackground'>
                <div className="modalContainer">
                    <button onClick={() => closeModal(false)} className="titleCloseBtn">X</button>
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
                            <div className="login-button" align="center">
                                <form onSubmit={callLoginApi}>
                                    <button className="submit">登入</button>
                                </form>
                                <form onSubmit={calluserupdate}>
                                    <button className="submit">更新</button>
                                </form>
                                <form onSubmit={calllogout}>
                                    <button className="submit">登出</button>
                                </form>
                                {/* <button className="forget-password">忘記密碼？</button><br/> */}

                                <form onSubmit={callemailApi}>
                                    <input placeholder="code" className="inputbar" value={code} onChange={(e) => setCode(e.target.value)}></input>
                                    <button className="submit">驗證碼</button><br/>
                                </form>
                                <form onSubmit={callforgetpasswordApi}>
                                    <input placeholder="newpsw" className="inputbar" value={newpsw} onChange={(e) => setNewPsw(e.target.value)}></input>
                                    <input placeholder="newpsw2" className="inputbar" value={newpsw2} onChange={(e) => setNewPsw2(e.target.value)}></input>
                                    <button className="submit">更改密碼</button><br/>

                                </form>
                        </div>
                    </div>
            </div>,
            document.getElementById("portal")
        )
}
export { LoginModal };