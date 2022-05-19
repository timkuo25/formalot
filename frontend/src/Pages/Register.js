import '../css/Register.css';
import { useState,useRef } from "react";
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import React from "react";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";

// import { Button } from 'react-native';

const Register = () => {
    const [email, setEmail] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [code, setCode] = useState("");
    //const [image, setImage] = useState('');
    //const [loading, setLoading] = useState(false)
    const [image, setImage] = useState({img:null,display:null });
    const inputFile = useRef(null) 

    
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
    


    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage({img:img,display:URL.createObjectURL(img)})
        }
        
    };


    const callregisterApi = async (e) => {
        // const formdata = new FormData() 
        // formdata.append("image", image.img)

        // //上傳照片到imgur
        // e.preventDefault();
        // const imgururl_result = await fetch('https://api.imgur.com/3/image/', {
        //     method:"POST",
        //     headers:{
        //         Authorization: "Client-ID 5535a8facba4790"
        //     },
        //     body: formdata
            
        // })
        
        // if(imgururl_result.status === 429){
        //     var imgururl = ""
        // }else{
        //     let data = await imgururl_result.json();
        //     var imgururl = data.data.link
        //     console.log(imgururl)        
        // }

        e.preventDefault();
        const result = await fetch("http://127.0.0.1:5000/Register", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                first_name: first_name,
                last_name: last_name,
                password: password,
                password2: password2,
                code: code,
                session_code: sessionStorage.getItem('code'),
                user_pic_url: ''
            }),
        });
        let resJson = await result.json();
        console.log(resJson);
        alert(resJson.message);
    
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
        errors.email = '請使用大專院校信箱註冊！';
    }
    else{
        errors.pass = '可使用的電子郵件！';
    }

    if (password.length < 8) {
        errors.errorpwd = '密碼長度至少8碼以上！';
    }
    else{
        errors.correctpwd = '可使用的密碼！';
    }

    const callErrorEmailAlert = () => {
        alert('請輸入正確格式的電子郵件！')
    }

    const callAlert = () => {
        alert('請提供完整、正確的資訊並同意會員規範後再進行註冊！')
    }

    const [agree, setAgree] = React.useState(null);
    
    const callCheckedbox = (e) => {
        // 判斷按鈕是否被按
        if(e.target.checked===true){
            setAgree(true);
        }
        else{
            setAgree(false);
        }
        
    }


    return (
    <>
    <Navbar />
        <div className="reg_card_container" align='center'>
            <div className="register_card_left">
                <div className='reg_description'>
                    <h1>加入 FORMALOT<br/>輕鬆填寫問卷、參加抽獎<br/>隨時查看抽獎進度<br/>把一堆獎品免費帶回家</h1>
                </div>
            </div>
            <div className="register_card_right">
                <div className="input_content">
                    <h3>電子郵件</h3>
                    <div className = 'reg-valid'>
                        <input type="text" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="reg_inputbar"/>
                        {(email.length>0 && errors.email) && <font>{errors.email}</font>}
                        {errors.pass && <text>{errors.pass}</text>}
                    </div>
                </div>
                <div className="input_content">
                    <h3>姓氏</h3>
                    <input type="text" maxLength="45" value={last_name} placeholder="Lastname" onChange={(e) => setLastname(e.target.value)} className="reg_inputbar"/>
                </div>
                <div className="input_content">
                    <h3>名字</h3>
                    <input type="text" maxLength="45" value={first_name} placeholder="Firstname" onChange={(e) => setFirstname(e.target.value)} className="reg_inputbar"/>
                </div>
                <div className="input_content">
                    <h3>密碼</h3>
                    <div className='reg-password-content'>
                        <input type={values.showPassword ? "text" : "password"} value={password} placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} className="reg_inputbar"/>
                        <button className='eye' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {values.showPassword ? <AiFillEye size='20px'/> : <AiFillEyeInvisible size='20px'/>}
                        </button>
                        {(password.length>0 && errors.errorpwd)&& <font>{errors.errorpwd}</font>}
                        {errors.correctpwd && <text>{errors.correctpwd}</text>}
                    </div>
                </div>
                <div className="input_content">
                    <h3>確認密碼</h3>
                    <div className='reg-password-content'>
                        <input type={values2.showPassword ? "text" : "password"} value={password2} placeholder="Confirm Password" 
                        onChange={(e) => setPassword2(e.target.value)} className="reg_inputbar"/>
                        <button className='eye' onClick={handleClickShowPassword2} onMouseDown={handleMouseDownPassword2}>
                            {values2.showPassword ? <AiFillEye size='20px'/> : <AiFillEyeInvisible size='20px'/>}
                        </button>
                    </div>
                </div>

                {/* <div className="input_content">
                    <h3>上傳頭貼</h3>
                        <div>
                            <input className='Btn SurveyOptionBtn' ref={inputFile} type="file" name="myImage" onChange={onImageChange} style={{display:'none'}}/>
                            <button className='Btn SurveyOptionBtn' onClick={()=>inputFile.current.click()}>選擇圖片</button>
                        </div>
                        <br/>
                        <div>
                            <img src={image.display} style={{  height: '200px', width: '200px'}}/>
                        </div>
                </div> */}

                <div className="input_content">
                    <h3>信箱驗證碼</h3>
                    
                    <form className="register_verification">                        
                        <input type="text" value={code} placeholder="Verification code" onChange={(e) => setCode(e.target.value)} className="reg_inputbar"/>
                        {errors.email && <button className="Btn ver_submit" onClick={callErrorEmailAlert}>取得驗證碼</button>}
                        {errors.pass && <button className="Btn ver_submit" onClick={callemailApi}>取得驗證碼</button>}
                        {/* <button className="ver_submit">取得驗證碼</button> */}
                    </form>
                </div>
                <br/>
                <br/>
                <div className="member_rule">
                    <input type="checkbox" className='box' id='agree' value={agree} onChange={callCheckedbox}/>
                    <font>我已詳閱
                        <button className='member_info' onClick={() => {window.location.href='instruction'}}>會員須知</button>並同意所有會員規範</font>
                </div>
            
            <form>
                {(errors.email || errors.errorpwd || agree!==true) && <button className="reg_submit_gray" onClick={callAlert} >註冊</button>}
                {(errors.pass && errors.correctpwd && agree===true) && <button className="Btn reg_submit" onClick={callregisterApi}>註冊</button>}
                {/* <button className="reg_submit">註冊</button> */}
            </form>
            
            </div>
        </div>
        <Footer/>
    </>
    );
}

export { Register };