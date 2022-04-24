import { Navbar } from './Components/Navbar';
const Profile = () => {
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
        <Navbar />
        <div className="profile_card_container" align='center'>
            <div className="profile_card">
                <div className="top-section">
                    <img src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                    <p className="name">Chen</p>
                    <p className="email">r10725056@ntu.edu.tw</p>
                    <form onSubmit={calluserupdate}>
                        <button className="edit-profile" onClick={() => {window.location.href='editProfile'}}>Edit Profile</button>
                    </form>
                </div>
            </div>

            <div className="profile_card_right">
                <div className="top-section">
                
                </div>
            </div>
        </div>
        
            
    </>
    )
    
}

export { Profile };