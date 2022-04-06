import { useState } from "react";
import { Navbar } from './Components/Navbar';

const Register = () => {
    const [email, setEmail] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const callApi = async (e) => {
        e.preventDefault();
        const result = await fetch("https://httpbin.org/post", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                first_name: first_name,
                last_name: last_name,
                password: password,
                password2: password2,
                phone: phone
            }),
        });
        let resJson = await result.json();
        console.log(resJson);
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
                <form onSubmit={callApi}>
                    <div className="input_content">
                        <h3>電子郵件</h3>
                        <input type="text" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="reg_inputbar"/>
                    </div>
                    <div className="input_content">
                        <h3>Firstname</h3>
                        <input type="text" value={first_name} placeholder="Firstname" onChange={(e) => setFirstname(e.target.value)} className="reg_inputbar"/>
                    </div>
                    <div className="input_content">
                        <h3>Lastname</h3>
                        <input type="text" value={last_name} placeholder="Lastname" onChange={(e) => setLastname(e.target.value)} className="reg_inputbar"/>
                    </div>
                    <div className="input_content">
                        <h3>密碼</h3>
                        <input type="text" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="reg_inputbar"/>
                    </div>
                    <div className="input_content">
                        <h3>確認密碼</h3>
                        <input type="text" value={password2} placeholder="Confirm Password" onChange={(e) => setPassword2(e.target.value)} className="reg_inputbar"/>
                    </div>
                    <div className="input_content">
                        <h3>聯絡電話</h3>
                        <input type="text" value={phone} placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} className="reg_inputbar"/><br/>
                    </div>
                    <button className="reg_submit">登入</button>
                </form>
            </div>
        </div>
    </>
    );
}

export { Register };