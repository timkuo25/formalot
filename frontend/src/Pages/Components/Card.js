const Card = ({ prize, num_prize, image_path, title, due_time, lottery_time }) => {
    
    return (
        <div className="card">
            <div className="prize-tag">{`${prize} ${num_prize} 名`}</div>
            <img alt="" className="q-image" src={image_path}/>
            <h3>{title}</h3>
            <p>
                {`截止時間：${due_time}`} <br/>
                {`抽獎時間：${lottery_time}`}
            </p>
            <button className="share-q">分享</button>
        </div>
    )
}

Card.defaultProps = {
    prize: 'prize-name',
    num_prize: 1,
    image_path: process.env.PUBLIC_URL + 'dog.png',
    title: 'title-name',
    due_time: 'due-time',
    lottery_time: 'lottery-time'
}

export { Card };