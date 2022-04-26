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
                            <textarea type="text" placeholder = "自我介紹" className="self-intro"/>
                        </div>
                    </div>
                    <hr class="solid"></hr>
                        
                    <div className="profile-content">
                        <h3 className="profile-name">姓名</h3>
                        <input type="text" className="profile-bar" value="張瑞晨">
                            {/* <text>張瑞晨</text> */}
                        </input>
                        <img className="pencil" src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/>
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">信箱</h3>
                        <input type="text" className="profile-bar" value="r10725056@ntu.edu.tw"/>
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">帳號</h3>
                        <input type="text" className="profile-bar" value="r10725056"/>
                        <img className="pencil" src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/>
                        {/* <i class="fa fa-pencil icon"></i> */}
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">密碼</h3>
                        <input type="password" className="profile-bar" value="12345678"/>
                        <img className="pencil" src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/>
                        {/* <i class="fa fa-pencil icon"></i> */}
                    </div>

                    <div className="profile-content">
                        <h3 className="profile-name">手機</h3>
                        <input type="text" className="profile-bar" value="0912345678"/>
                        <img className="pencil" src={process.env.PUBLIC_URL + 'purplepencil.png'} alt=''/>
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