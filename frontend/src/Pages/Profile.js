import '../css/Profile.css';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { useEffect, useState } from 'react';

const Profile = () => {
    const calluserupdate = async (e) => {
        e.preventDefault();
        const getprotected = await fetch('http://127.0.0.1:5000/UserUpdate',{
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({
                first_name: "testupdate",
                last_name : "",
                password : "",
                password2 : "",
            }),
        });
        const resdata = await getprotected;
        console.log(resdata);
        alert(resdata.message);
    };

    const [Profile, setProfile] = useState([]);
    useEffect(() => {
        const callGetUserProfile = async () => {
            const data = await fetch('http://127.0.0.1:5000/GetUserProfile',{
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            const dataJSON = await data.json();
            console.log(dataJSON);
            setProfile(dataJSON[0]);

        };
        callGetUserProfile();
    }, []);


    return (
        <>
        <Navbar/>
            <div className="profile_card_container" align='center'>
                <div className="profile_card_right">
                    <div className="top-section">
                        <img className="photo" src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                        <div>
                            <p className="name">{Profile.user_lastname}{Profile.user_firstname}</p>
                            <p className="email">{Profile.user_email}</p>
                            {/* <textarea type="text" placeholder = "自我介紹" className="self-intro"/> */}
                        </div>
                    </div>
                    <hr className="solid"></hr>
                        
                    <div className="profile-content">
                        <h3 className="profile-name">信箱</h3>
                        <input type="text" className="profile-bar-gray" value={Profile.user_email}/>
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">學號</h3>
                        <input type="text" className="profile-bar-gray" value={Profile.student_id}/>
                        {/* <i class="fa fa-pencil icon"></i> */}
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">姓氏</h3>
                        <input type="text" className="profile-bar" value={Profile.user_lastname}>
                            {/* <text>張瑞晨</text> */}
                        </input>
                        <img className="pencil" onClick={() => {window.location.href='editProfile'}} src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/>
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">名字</h3>
                        <input type="text" className="profile-bar" value={Profile.user_firstname}>
                            {/* <text>張瑞晨</text> */}
                        </input>
                        <img className="pencil" onClick={() => {window.location.href='editProfile'}} src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/>
                    </div>

                    <form onSubmit={calluserupdate}>
                        <button className="edit-profile" onClick={() => {window.location.href='editProfile'}}>Edit Profile</button>
                    </form>                
                </div>
            </div>
        <Footer />
        </>
    )
    
}

export { Profile };