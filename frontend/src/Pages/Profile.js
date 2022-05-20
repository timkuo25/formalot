import '../css/Profile.css';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { useEffect, useState,useRef } from 'react';
import callrefresh from '../refresh.js';
import { Card } from 'react-bootstrap';
import Viewer from 'react-viewer';
import ReactLoading from "react-loading";

import { AiFillCamera } from "react-icons/ai";
import {CropperModal} from './Components/CropperModal';
import React from 'react';

const Profile = () => {
    const [Profile, setProfile] = useState([]);
    const [loading, setload] = useState(false)
    useEffect(() => {
        const callGetUserProfile = async () => {
            setload(true)
            const data = await fetch('http://127.0.0.1:5000/GetUserProfile',{
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            console.log(data.status);
            setload(false)
            if(data.status === 401){
                callrefresh("reload");
            }else{
                const dataJSON = await data.json();
                console.log(dataJSON);
                setProfile(dataJSON[0]);
            }
        };
        callGetUserProfile();
    }, []);

    const [image, setImage] = useState({img:null,display:null });
    const inputFile = useRef(null);
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage({img:img,display:URL.createObjectURL(img)})
            // const formdata = new FormData() 
            // formdata.append("image", resizedImage)
            // //上傳照片到imgur
            // fetch('https://api.imgur.com/3/image/', {
            //     method:"POST",
            //     headers:{
            //     Authorization: "Client-ID 5535a8facba4790"
            //     },
            //     body: formdata
            // }).then(data => data.json())
            // .then(data => {
            //     //我們要的imgur網址
            //     let imgururl = data.data.link
            //     console.log(imgururl)
            // })
            setFile(event.target.files[0]);
        }
        event.target.value = null;
    };

    const [file, setFile] = React.useState(null);

    // resizedImage為切過的照片
	const [resizedImage, setResizedImage] = React.useState(null);

    return (
        <>
        <Navbar/>
            <div className="profile_card_container" align='center'>
                <div className="profile_card_right">
                    <div className="top-section">
                    <input ref={inputFile} type="file" accept="image/png, image/jpeg" name="myImage" onChange={onImageChange} style={{display:'none'}} />
                            {/* <img className="photo" src={resizedImage} alt="Cropped preview"/> */}
                            <img className="photo" src={resizedImage || Profile.user_pic_url} />
                            <button className='Btn camera' onClick={()=>inputFile.current.click()}>
                                <AiFillCamera size='20px'/>
                            </button>
                            <CropperModal file={file} 
                            onConfirm={( croppedFile ) => { setResizedImage(window.URL.createObjectURL(croppedFile));}} onCompleted={() => setFile(null)} />
                            
                        {/* <img className="photo" src={image.display || process.env.PUBLIC_URL + 'dog.png'} alt=''/> */}
                        
                        
                        <div>
                            {loading ?   <div className='name'><ReactLoading type="balls" color="#432a58"/></div>:<p className="name">{Profile.user_lastname}{Profile.user_firstname}</p>}                            
                            <p className="email">{Profile.user_email}</p>
                            {/* <textarea type="text" placeholder = "自我介紹" className="self-intro"/> */}
                        </div>
                    </div>
                    
                    <hr className="solid"></hr>
                        
                    <div className="profile-content">
                        <h3 className="profile-name">信箱</h3>
                        <p className="profile-bar">{Profile.user_email}</p>
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">學號</h3>
                        <p className="profile-bar">{Profile.student_id}</p>
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">姓氏</h3>
                        <p className="profile-bar">{Profile.user_lastname}</p>
                        {/* <img className="pencil" onClick={() => {window.location.href='editProfile'}} src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/> */}
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">名字</h3>
                        <p className="profile-bar">{Profile.user_firstname}</p>
                        {/* <img className="pencil" onClick={() => {window.location.href='editProfile'}} src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/> */}
                    </div>
                        <button className="Btn edit-profile" onClick={() => {window.location.href='editProfile'}}>編輯個人資訊</button>
                </div>
            </div>
        <Footer />
        </>
    )
    
}

export { Profile };