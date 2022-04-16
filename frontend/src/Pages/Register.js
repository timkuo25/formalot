import { useState } from "react";
import { Navbar } from './Components/Navbar';

const Register = () => {
    const [email, setEmail] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [code, setCode] = useState("");

    const callregisterApi = async (e) => {
        e.preventDefault();
        const result = await fetch("http://127.0.0.1:5000/Register", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                first_name: first_name,
                last_name: last_name,
                password: password,
<<<<<<< Updated upstream
                password2: password2,
                code: code,
                session_code: sessionStorage.getItem('code')
=======
<<<<<<< HEAD
                password2: password2
=======
                password2: password2,

>>>>>>> f4a1767 ([chen] LoginModal #)
>>>>>>> Stashed changes
            }),
        });
        let resJson = await result.json();
        console.log(resJson);
        alert(resJson.message);
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

    return (
    <>
    <Navbar />
        <div className="reg_card_container" align='center'>
            <div className="register_card_left">
                <div className='reg_description'>
                    <h1>加入 FORMALOT<br/>輕鬆填寫問卷、參加抽獎<br/>隨時查看抽獎進度<br/>把一對獎品免費帶回家</h1>
                </div>
            </div>
            <div className="register_card_right">
                <div className="input_content">
                    <h3>電子郵件</h3>
                    <input type="text" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="reg_inputbar"/>
                </div>
                <div className="input_content">
                    <h3>姓氏</h3>
                    <input type="text" maxlength="45" value={last_name} placeholder="Lastname" onChange={(e) => setLastname(e.target.value)} className="reg_inputbar"/>
                </div>
                <div className="input_content">
                    <h3>名字</h3>
                    <input type="text" maxlength="45" value={first_name} placeholder="Firstname" onChange={(e) => setFirstname(e.target.value)} className="reg_inputbar"/>
                </div>
                <div className="input_content">
                    <h3>密碼</h3>
                    <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="reg_inputbar"/>
                </div>
                <div className="input_content">
                    <h3>確認密碼</h3>
                    <input type="password" value={password2} placeholder="Confirm Password" onChange={(e) => setPassword2(e.target.value)} className="reg_inputbar"/>
                </div>
                <div className="input_content">
                    <h3>信箱驗證碼</h3>
                    <input type="text" value={code} placeholder="Verification code" onChange={(e) => setCode(e.target.value)} className="reg_inputbar"/>
                </div>
                
            <form onSubmit={callemailApi}>
                <button className="reg_submit">取得驗證碼</button>
            </form>
            <form onSubmit={callregisterApi}>
                <button className="reg_submit">註冊</button>
            </form>
            
            </div>
        </div>
    </>
    );
}

export { Register };