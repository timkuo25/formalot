const Card = () => {
    
    return (
        <div className="card">
            <div className="prize-tag">現金 100 元 2 名</div>
            <img alt="" className="q-image" src={process.env.PUBLIC_URL + 'dog.png'}/>
            <h3>臺大校園安全問卷</h3>
            <p>
                截止時間：2022/3/14 20:00 <br/>
                抽獎時間：2022/3/15 21:30
            </p>
            <button className="share-q">分享</button>
        </div>
    )
}

export { Card };