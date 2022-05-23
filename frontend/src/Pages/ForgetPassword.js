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
            const getprotected = await fetch('https://be-sdmg4.herokuapp.com/ForgetPsw',{
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
            console.log(resdata.status);
            alert(resdata.message);

            if (resdata.status === 'success'){
                window.location.href = "/"
            }
        };

        const callemailApi = async (e) => {
            e.preventDefault();
            const result = await fetch("https://be-sdmg4.herokuapp.com/Email?condition=forget_psw", {
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

          let errors = {};
            
            if (!/\S+@\S+\.edu+\.tw+/.test(email)) {
                errors.email='請使用大專院校信箱註冊！';
            }
            else{
                errors.pass = '可使用的電子郵件！';
            }

            if (newpsw.length < 8) {
                errors.errorpwd = '密碼長度至少8碼以上！';
            }
            else{
                errors.correctpwd = '可使用的密碼！';
            }

            const callAlert = () => {
                alert('請輸入正確格式的密碼！')
            }

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
                        {errors.email && <button className="forget_ver_submit_gray" disabled={true}>取得驗證碼</button>}
                        {errors.pass && <button className="Btn forget_ver_submit">取得驗證碼</button>}
                        {/* <button className="forget_ver_submit">取得驗證碼</button> */}
                    </form>
                </div>
                <div className="forget_input_content">
                    <h3>驗證碼</h3>
                    <input value={code} onChange={(e) => setCode(e.target.value)} type="text" placeholder="Verification code" className="forget_inputbar"/>
                </div>

                <div className="forget_input_content">
                    <h3>輸入新密碼</h3>
                    <div className='new-password-content'>
                        <input type={values.showPassword ? "text" : "password"} value={newpsw} placeholder="Password" 
                        onChange={(e) => setNewPsw(e.target.value)} className="forget_inputbar"/>
                        <button className='eye' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {values.showPassword ? <AiFillEye size='20px'/> : <AiFillEyeInvisible size='20px'/>}
                        </button>
                        {(newpsw.length>0 && errors.errorpwd) && <font>{errors.errorpwd}</font>}
                        {errors.correctpwd && <text>{errors.correctpwd}</text>}
                    </div>
                </div>
                <div className="forget_input_content">
                    <h3>確認新密碼</h3>
                    <div className='new-password-content'>
                        <div>
                            <input
                                type={values2.showPassword ? "text" : "password"} value={newpsw2} placeholder="Password" 
                                onChange={(e) => setNewPsw2(e.target.value)} className="forget_inputbar"
                            />
                        </div>
                        <div>
                            <button className='eye' onClick={handleClickShowPassword2} onMouseDown={handleMouseDownPassword2}>
                                {values2.showPassword ? <AiFillEye size='20px'/> : <AiFillEyeInvisible size='20px'/>}
                            </button>
                        </div>
                    </div>
                </div>
                
                
            
            <form>
                {errors.errorpwd && <button className="Btn forget_submit" onClick={callAlert} >修改</button>}
                {errors.correctpwd && <button className="Btn forget_submit" onClick={callforgetpasswordApi}>修改</button>}
                {/* <button className="Btn forget_submit" onClick={callforgetpasswordApi}>修改</button> */}
            </form>
          
            </div> 
        </div>
        <Footer/> 
    </>
    )
}

export { ForgetPassword };