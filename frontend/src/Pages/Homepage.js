import '../css/Homepage.css';
import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { useEffect, useState } from 'react';

const Homepage = () => {
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('http://localhost:5000/home');
            const dataJSON = await data.json();
            console.log(dataJSON)
            
            setMaxPage(Math.ceil((dataJSON.length) / 8))
        }
        fetchData();
    }, []);
    
    return (
        <>
            <Navbar />
            <section className='call-to-action'>
                {/* <img className='main-image' src={process.env.PUBLIC_URL + 'LandingPage.svg'} alt=''/> */}
                <div className='description'>
                    <h2>填寫問卷，參與抽獎，<br/>發布專屬於你的抽獎問卷</h2>
                    <h3>Formalot 是問卷抽獎管理的首選平台！</h3>
                    <div className='cta-button'>
                        <button className='explore-button'>探索抽獎</button>
                        <button className='make-survey-button' onClick={()=>{window.location.href = "/MakeSurvey"}}>製作問卷</button>
                    </div>
                </div>
            </section>
            <section className='showcase'>
                超多高級好禮
                <img className='showcase-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                <img className='showcase-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                <img className='showcase-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                <img className='showcase-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                快點帶回家
            </section>
            <section className='latest-q'>
                <div className='latest-q-container'>
                    <h2>最新問卷</h2>
                    <h3>點擊問卷，快速填寫問卷，即可參加抽獎，幸運星即將降臨</h3>
                    <div className='card-container'>
                        <Card/>
                        <Card/>
                        <Card/>
                        <Card/>
                    </div>
                    <div className='card-container'>
                        <Card/>
                        <Card/>
                        <Card/>
                        <Card/>
                    </div>
                </div>
            </section>
            <section className='page-div'>
                Page <input className="page" type="number" min="0" max="100"/> of {maxPage}
            </section>
            <Footer />
        </>
    )
}

export { Homepage }