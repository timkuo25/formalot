import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Avator } from './Components/Avator';


const Lottery = () => {
    
    return (
        <>
            <Navbar/>
            <section className='lottery-page-container'>
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
                            <h2> coco brownie 禮盒(6 入) 名 </h2>
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
                        <h2> 問卷資訊 </h2>
                        問卷截止時間：2022/3/20 <br />
                        抽獎日期：2022/3/21<br/>
                        <h2> 獎品 </h2>
                        <section className='prize-container'>
                            <h3> coco brownie 禮盒(6入) 4 名 </h3>
                            <img className='prize-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                        </section>
                        <section className='prize-container'>
                            <h3> coco brownie 瑪芬 1 名 </h3>
                            <img className='prize-image' src={process.env.PUBLIC_URL + 'dog.png'} alt=''/>
                        </section>

                    </section>
                </section>
                <div className='form-buttons'>
                    <button class='form-button'> 填答結果</button>
                    <button class='form-button'> 瀏覽問卷</button>
                </div>
            </section>

        </>
    )
}
export { Lottery }