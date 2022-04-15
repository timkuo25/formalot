import { Navbar } from './Components/Navbar';
const Profile = () => {
    
    return (
    <>
        <Navbar />
        <div className="profile_card">
            <div className="top-section">
                <img src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                <p className="name">Chen</p>
                <p className="email">r10725056@ntu.edu.tw</p>
            </div>
        </div>
        
            
    </>
    )
    
}

export { Profile };