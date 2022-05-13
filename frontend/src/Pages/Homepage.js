import '../css/Homepage.css';
import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { useEffect, useState } from 'react';
import ReactLoading from "react-loading";


const Homepage = () => {
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const [forms, setForms] = useState(null);

    
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('http://127.0.0.1:5000/home',{
                headers: {'Content-Type': 'application/json'}
            });
            const dataJSON = await data.json();
            console.log(dataJSON);
            
            setMaxPage(Math.ceil((dataJSON.length) / 8));
            setPage(1);
            setForms(dataJSON);
        }
        fetchData();
    }, []);

    const last_page_style = {
        transform: 'scaleX(-1)',
        cursor: page <= 1 ? null : 'pointer',
        opacity: page <= 1 ? '0.2' : '1',
    }
    const next_page_style = {
        cursor: page === maxPage ? null : 'pointer',
        opacity: page === maxPage ? '0.2' : '1',
    }
    
    return (
        <>
            <Navbar />
            <section className='call-to-action'>
                {/* <img className='main-image' src={process.env.PUBLIC_URL + 'LandingPage.svg'} alt=''/> */}
                <div className='description'>
                    <div className='caption'>
                        <h2>填寫問卷，參與抽獎，<br/>發布專屬於你的抽獎問卷</h2>
                        <h3>Formalot 是問卷抽獎管理的首選平台！</h3>
                    </div>
                    <div className='cta-button'>
                        <button className='explore-button' onClick={()=>{window.location.href = "/explore"}}>探索抽獎</button>
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
                    {!forms
                        ?
                            <div className='card-container'>
                                <ReactLoading type="spinningBubbles" color="#432a58" />
                            </div>
                        :<>
                            <div className='card-container'>
                                {
                                    [...Array(4)]
                                    .map((_, i) => 8*(page-1) + i)
                                    .map(item => {
                                        console.log(item);
                                        return item > forms.length ? <Card key={item} info={null} type='home'/> : <Card key={item} info={forms[item]} type='home'/>
                                    })
                                }
                            </div>
                            <div className='card-container'>
                                {
                                    [...Array(4)]
                                    .map((_, i) => 8*(page-1) + 4 + i)
                                    .map(item => {
                                        console.log(item);
                                        return item > forms.length ? <Card key={item} info={null} type='home'/> : <Card key={item} info={forms[item]} type='home'/>
                                    })
                                }
                            </div>
                        </>
                    }
                </div>
            </section>
            <section className='page-div'>
                <img 
                    src={`${process.env.PUBLIC_URL}/next_page.png`}
                    width={50}
                    style={last_page_style} 
                    onClick={() => {
                        if (page === 1) return;
                        setPage(page - 1);
                    }}
                />
                Page {page} of {maxPage}
                <img 
                    src={`${process.env.PUBLIC_URL}/next_page.png`}
                    width={50}
                    style={next_page_style}
                    onClick={() =>{ 
                        if (page === maxPage) return;
                        setPage(page + 1);
                    }}
                />
            </section>
            <Footer />
        </>
    )

}

export { Homepage }