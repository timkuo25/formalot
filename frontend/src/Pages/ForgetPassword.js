import '../css/ForgetPassword.css';
import { useState } from "react";
import { Navbar } from './Components/Navbar';
import { Footer } from "./Components/Footer";
import React from "react";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
const ForgetPassword = () => {
        // 忘記密碼
        const [email, setEmail] = useState("");
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
            const resdata = await getprotected.json();
            console.log(resdata);
            alert(resdata.message);
        };

        const callemailApi = async (e) => {
            e.preventDefault();
            const result = await fetch("http://127.0.0.1:5000/Email?condition=register", {
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

        const [values, setValues] = React.useState({
            password: "",
            showPassword: false,
          });
          
          const handleClickShowPassword = () => {
            setValues({ ...values, showPassword: !values.showPassword });
          };
          
          const handleMouseDownPassword = (event) => {
            event.preventDefault();
          };
          
    
          const [values2, setValues2] = React.useState({
            password: "",
            showPassword: false,
          });
          
          const handleClickShowPassword2 = () => {
            setValues2({ ...values2, showPassword: !values2.showPassword });
          };
          
          const handleMouseDownPassword2 = (event) => {
            event.preventDefault();
          };

    return (
    <>
    <Navbar/>
     <div className="forget_card_container" align='center'>
            
            <div className="forget_card_right">
                <div className="forget_input_content">
                    <h1>重設密碼</h1>
                </div>
                <div className="forget_input_content">
                    <h3>你的信箱</h3>
                    <form onSubmit={callemailApi} className="forget_verification">                        
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Your Email" className="forget_inputbar"/>
                        <button className="forget_ver_submit">取得驗證碼</button>
                    </form>
                </div>
                <div className="forget_input_content">
                    <h3>驗證碼</h3>
                    <input value={code} onChange={(e) => setCode(e.target.value)} type="password" placeholder="Verification code" className="forget_inputbar"/>
                </div>

                <div className="forget_input_content">
                    <h3>輸入新密碼</h3>
                    <div className='new-password-content'>
                        <input type={values.showPassword ? "text" : "password"} value={newpsw} placeholder="Password" 
                        onChange={(e) => setNewPsw(e.target.value)} className="forget_inputbar"/>
                        <button className='eye' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {values.showPassword ? <AiFillEye size='20px'/> : <AiFillEyeInvisible size='20px'/>}
                        </button>
                    </div>
                </div>
                <div className="forget_input_content">
                    <h3>確認新密碼</h3>
                    <div className='new-password-content'>
                        <input type={values2.showPassword ? "text" : "password"} value={newpsw2} placeholder="Password" 
                        onChange={(e) => setNewPsw2(e.target.value)} className="forget_inputbar"/>
                        <button className='eye' onClick={handleClickShowPassword2} onMouseDown={handleMouseDownPassword2}>
                            {values2.showPassword ? <AiFillEye size='20px'/> : <AiFillEyeInvisible size='20px'/>}
                        </button>
                    </div>
                </div>
                
                
            
            <form>
                <button className="forget_submit" onClick={callforgetpasswordApi}>修改</button>
            </form>
          
            </div> 
        </div>
        <Footer/> 
    </>
    )
}

export { ForgetPassword };