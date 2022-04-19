import { useState } from "react";
import { Navbar } from './Components/Navbar';
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
            const resdata = await getprotected;
            console.log(resdata);
            alert(resdata.message);
    
        };
    return (
    <>
    <Navbar/>
     <div className="reg_card_container" align='center'>
            
            <div className="register_card_right">
                <div className="input_content">
                    <h1>重設密碼</h1>
                </div>
                <div className="input_content">
                    <h3>你的信箱</h3>
                    <form className="register_verification">                        
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Your Email" className="reg_inputbar"/>
                        <button className="ver_submit">取得驗證碼</button>
                    </form>
                </div>
                <div className="input_content">
                    <h3>驗證碼</h3>
                    <input value={code} onChange={(e) => setCode(e.target.value)} type="password" placeholder="Verification code" className="reg_inputbar"/>
                </div>

                <div className="input_content">
                    <h3>輸入新密碼</h3>
                    <input value={newpsw} onChange={(e) => setNewPsw(e.target.value)} type="password" placeholder="Password" className="reg_inputbar"/>
                </div>
                <div className="input_content">
                    <h3>確認新密碼</h3>
                    <input value={newpsw2} onChange={(e) => setNewPsw2(e.target.value)} type="password" placeholder="Confirm Password" className="reg_inputbar"/>
                </div>
                
                
            
            <form>
                <button className="reg_submit" onSubmit={callforgetpasswordApi}>修改</button>
            </form>
            
            </div>
        </div>
    </>
    )
}

export { ForgetPassword };