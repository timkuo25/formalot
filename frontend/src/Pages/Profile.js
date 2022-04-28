import '../css/Profile.css';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
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
    return (
        <>
        <Navbar/>
            <div className="profile_card_container" align='center'>
                <div className="profile_card_right">
                    <div className="top-section">
                        <img className="photo" src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                        <div>
                            <p className="name">張瑞晨</p>
                            <p className="email">r10725056@ntu.edu.tw</p>
                            {/* <textarea type="text" placeholder = "自我介紹" className="self-intro"/> */}
                        </div>
                    </div>
                    <hr className="solid"></hr>
                        
                    <div className="profile-content">
                        <h3 className="profile-name">信箱</h3>
                        <input type="text" className="profile-bar-gray" value="r10725056@ntu.edu.tw"/>
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">學號</h3>
                        <input type="text" className="profile-bar-gray" value="r10725056"/>
                        {/* <i class="fa fa-pencil icon"></i> */}
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">姓氏</h3>
                        <input type="text" className="profile-bar" value="張">
                            {/* <text>張瑞晨</text> */}
                        </input>
                        <img className="pencil" onClick={() => {window.location.href='editProfile'}} src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/>
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">名字</h3>
                        <input type="text" className="profile-bar" value="瑞晨">
                            {/* <text>張瑞晨</text> */}
                        </input>
                        <img className="pencil" onClick={() => {window.location.href='editProfile'}} src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/>
                    </div>

                    <form onSubmit={calluserupdate}>
                        <button className="edit-profile" onClick={() => {window.location.href='editProfile'}}>Edit Profile</button>
                    </form>                
                </div>
            </div>
<<<<<<< HEAD

            <div className="profile_card_right">
                <div className="top-section">
                
                </div>
            </div>       
            
    </>
=======
        <Footer />
        </>
>>>>>>> main
    )
    
}

export { Profile };