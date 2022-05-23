import '../../css/LoginModal.css';
import React from "react";
import ReactDom from "react-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Homepage } from "../Homepage";
import ReactLoading from "react-loading";
import { useTranslation } from "react-i18next";

function LoginModal( {closeModal}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setload] = useState(false)
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    // 登入
    const callLoginApi = async (e) => {
        setload(true)
        e.preventDefault();
        const result = await fetch("https://be-sdmg4.herokuapp.com/Login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        let resJson = await result.json();
        setload(false)
        if (resJson.access_token){
            localStorage.setItem('jwt', resJson.access_token);
            localStorage.setItem('refresh_token', resJson.refresh_token);
            console.log("Login Success");
            console.log(resJson.access_token);
            alert("登入成功");
            window.location.reload();
            // navigate(<Homepage/>);
            
        }else{
            console.log(resJson);
            alert(resJson.message);
        };
    };


        // validation
        let errors = {};
        
        // if (!email.trim()) {
        //   errors.username = 'Username required';
        // }
        // else if (!/^[A-Za-z]+/.test(values.name.trim())) {
        //   errors.name = 'Enter a valid name';
        // }
    
        if (!/\S+@\S+\.edu+\.tw+/.test(email)) {
        errors.email = '請使用大專院校信箱！';
        } 
        // else if (!/\S+@\S+\.\S+/.test(email)) {
        //     errors.email = '信箱格式錯誤';
        // }


        // if (!password) {
        // errors.password = '請輸入密碼';
        // } 
        // else if (values.password.length < 6) {
        //   errors.password = 'Password needs to be 6 characters or more';
        // }
      
        // if (!values.password2) {
        //   errors.password2 = 'Password is required';
        // } else if (values.password2 !== values.password) {
        //   errors.password2 = 'Passwords do not match';
        // }

        const callAlert = () => {
            alert('請輸入正確的帳號密碼！')
        }
      

        return ReactDom.createPortal(
            <div className='modalBackground'>
                <div className="modalContainer">
                    <button onClick={() => closeModal(false)} className="titleCloseBtn">X</button>
                        
                        <div align="center" className="title">
                            <h2>{t("登入")}</h2>
                        </div>
                        
                        <div className='login-form-input'>
                            {/* <label className='form-label'>帳號</label> */}
                            <input maxLength="45" placeholder={t("電子郵件")} className="inputbar" value={email} onChange={(e) => setEmail(e.target.value)} ></input>
                            {(email.length>0 && errors.email) && <font>{errors.email}</font>}
                        </div>
                        <p></p>
                        <div className='login-form-input'>
                            {/* <label className='form-label'>密碼</label> */}
                            <input type="password" placeholder={t("密碼")} className="inputbar" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            {/* {(errors.password) && <font>{errors.password}</font>} */}
                        </div>

                        <div align="center">
                        {(errors.email || errors.password) && <button className="Btn submit" onClick={callAlert}>{t("登入")}</button>}
                        {(!errors.email && !errors.password) &&<button className="Btn submit" onClick={callLoginApi}>{t("登入")}</button>}
                            {/* <button className="submit" onClick={callLoginApi}>登入</button> */}
                            <br/>
                            <button className="forget-password" onClick={() => {window.location.href='/ForgetPassword'}}>{t("忘記密碼")}?</button>
                        </div>                                
                        <div className="login-button" align="center">
                            <button className="Btn create-account-button" onClick={() => {window.location.href='/register'}}>{t("建立新帳號")}</button>
                            {/* <button className="forget-password">忘記密碼？</button><br/> */}
                            {loading ?   <div className='card-container'><ReactLoading type="spinningBubbles" color="#432a58"/></div>:null}
                            
                        </div>
                        
                </div>
            </div>,
            document.getElementById("portal")
        )
}
export { LoginModal };