import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Avator } from './Components/Avator';


const Lottery = () => {
    
    return (
        <>
            <Navbar/>
            <section className='lottery-container'>
                <section className='lottery-results'>
                    <h2>你快樂嗎？大學生對快樂的定義</h2>
                    <div className='lottery-card'>
                        <h2> 可抽獎人名單：510 人 </h2>
                        <div className='avator-container'>
                            <Avator/>
                            <Avator/>
                            <Avator/>
                            <Avator/>
                        </div>
                    </div>
                    <div className='lottery-card'>
                        <h2> coco brownie 禮盒(6 入) 3 名 </h2>
                        <img className='prize-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                        <div className='avator-container'>
                            <Avator/>
                            <Avator/>
                            <Avator/>
                        </div>
                    </div>
                    <div className='lottery-card'>
                        <h2> coco brownie 瑪芬 1 名 </h2>
                        <img className='prize-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                        <div className='avator-container'>
                            <Avator/>
                        </div>
                    </div>
                </section>
                <section className='form-info'>
                </section>
            </section>
            
            {/* <section className='lottery_results'>
                <img className='main-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                <div className='description'>
                    <h2>填寫問卷，參與抽獎，<br/>發布專屬於你的抽獎問卷</h2>
                    <h3>Formalot 是問卷抽獎管理的首選平台！</h3>
                    <div className='cta-button'>
                        <button className='explore-button'>探索抽獎</button>
                        <button className='make-survey-button'>製作問卷</button>
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
            </section> */}
            {/* <section className='latest-q'>
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
            </section> */}
        </>
    )
}

export { Lottery }