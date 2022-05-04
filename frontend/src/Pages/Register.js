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

    // const uploadImage = async e => {
    //     const files = e.target.files
    //     const data = new FormData()
    //     data.append('file', files[0])
    //     data.append('upload_preset', 'darwin')
    //     setLoading(true)
    //     const res = await fetch(
    //       '	https://api.imgur.com/3/upload',
    //       {
    //         method: 'POST',
    //         headers:{
    //             Authorization:"Client-ID "
    //         },
    //         body: data
    //       }
    //     )
    //     const file = await res.json()
    //       console.log(file.secure_url)
    //     setImage(file.secure_url)
    //     setLoading(false)
    //   };
    


    let errors = {};
    
    // if (!email.trim()) {
    //   errors.username = 'Username required';
    // }
    // else if (!/^[A-Za-z]+/.test(values.name.trim())) {
    //   errors.name = 'Enter a valid name';
    // }

    // if (!email) {
    // errors.email = 'Email is required';
    // } else 
    
    if (!/\S+@\S+\.edu+\.tw+/.test(email)) {
        errors.email = '請使用大專院校信箱註冊！';
    }
    else{
        errors.pass = '可使用的電子郵件！';
    }

    // if (!password) {
    // errors.password = 'Password is required';
    // }


    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage({img:img,display:URL.createObjectURL(img)})
        }
        
    };
    const callregisterApi = async (e) => {
        const formdata = new FormData() 
        formdata.append("image", image.img)

        //上傳照片到imgur
        fetch('https://api.imgur.com/3/image/', {
            method:"POST",
            headers:{
            Authorization: "Client-ID 5535a8facba4790"
            },
            body: formdata
        }).then(data => data.json())
        .then(data => {
            //我們要的imgur網址
            let imgururl = data.data.link
            console.log(imgururl)
        })

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
                session_code: sessionStorage.getItem('code')
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
      
      const handlePasswordChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
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
      
      const handlePasswordChange2 = (prop) => (event) => {
        setValues({ ...values2, [prop]: event.target.value });
      };
    

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
                        {errors.email && <font>{errors.email}</font>}
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
                    <input type="file" name="file" placeholder="Upload an image" onChange={uploadImage} />
                    {loading ? (<h3>Loading...</h3>) : ( <img src={image} style={{ width: '50px', height: '50px' }} />)}
                </div> */}

                <div className="input_content">
                    <h3>上傳頭貼</h3>
                        <div>
                            <input className='Btn SurveyOptionBtn' ref={inputFile} type="file" name="myImage" onChange={onImageChange} style={{display:'none'}}/>
                            <button className='Btn SurveyOptionBtn' onClick={()=>inputFile.current.click()}>選擇圖片</button>
                        </div>
                        <br/>
                        <div>
                            <img src={image.display} style={{  height: '150px', width: '200px'}}/>
                        </div>
                </div>

                <div className="input_content">
                    <h3>信箱驗證碼</h3>
                    
                    <form onSubmit={callemailApi} className="register_verification">                        
                        <input type="text" value={code} placeholder="Verification code" onChange={(e) => setCode(e.target.value)} className="reg_inputbar"/>
                        {errors.email && <button className="ver_submit" disabled={true}>取得驗證碼</button>}
                        {errors.pass && <button className="ver_submit">取得驗證碼</button>}
                        {/* <button className="ver_submit">取得驗證碼</button> */}
                    </form>
                </div>
                
            
            <form onSubmit={callregisterApi}>
                {errors.email && <button className="reg_submit" disabled={true}>註冊</button>}
                {errors.pass && <button className="reg_submit">註冊</button>}
                {/* <button className="reg_submit">註冊</button> */}
            </form>
            
            </div>
        </div>
        <Footer/>
    </>
    );
}

export { Register };