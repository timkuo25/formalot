import { useState } from "react";
import { Navbar } from './Components/Navbar';
const EditProfile = () => {
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    // 修改個人資料
    const calluserupdate = async (e) => {
        e.preventDefault();
        const getprotected = await fetch('http://127.0.0.1:5000/UserUpdate',{
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({
                first_name: "",
                last_name : "",
                password : "",
                password2 : "",
            }),
        });
        const resdata = await getprotected;
        console.log(resdata);
        alert(resdata.message);
   
    };
    return (
    <>
    <Navbar/>
     <div className="edit_card_container" align='center'>
            
            <div className="edit_card_right">
                <div className="edit_input_content">
                    <h1>編輯個人資訊</h1>
                </div>
                <div className="edit_input_content">
                    <h2>你的信箱</h2>
                    <h3>r10725056@ntu.edu.tw</h3>
                </div>
                <div className="edit_input_content">
                    <h3>姓氏</h3>
                    <input value={last_name} onChange={(e) => setLastname(e.target.value)} type="text" placeholder="LastName" className="edit_inputbar"/>
                </div>
                <div className="edit_input_content">
                    <h3>名字</h3>
                    <input value={first_name} onChange={(e) => setFirstname(e.target.value)} type="text" placeholder="FirstName" className="edit_inputbar"/>
                </div>

                <div className="edit_input_content">
                    <h3>輸入新密碼</h3>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="edit_inputbar"/>
                </div>
                <div className="edit_input_content">
                    <h3>確認新密碼</h3>
                    <input value={password2} onChange={(e) => setPassword2(e.target.value)} type="password" placeholder="Confirm Password" className="edit_inputbar"/>
                </div>
                
                
            
            <form>
                <button className="edit_submit" onSubmit={calluserupdate}>修改</button>
            </form>
            
            </div>
        </div>
    </>
    )
}

export { EditProfile };