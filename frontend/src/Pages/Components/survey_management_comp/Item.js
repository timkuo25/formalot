import { useState } from "react"
const Item = ({ id, title, due_time, lottery_time, image_path, prize, num_prize, deleteItem, deleteData, status}) => {
    const [modalOpen, setModalOpen] = useState(false);
    function deleteItem(){
        deleteData(function(prev) {
            return prev.filter(item => item.id !== id)
        })
    }


    return (

            <div className="item">
                <div className="card">
                    <div className="tag_container">
                        <div className="prize-tag-management">{`${prize} ${num_prize} 名`}</div>
                        <div className="prize-tag-management">{`${status}`}</div>
                        <div className="dropdown">
                            <button className="prize-tag-management">選項</button>
                                <div className="dropdown-content">
                                    <a href="#">關閉問卷</a>
                                    <a href="#">刪除問卷</a>
                                </div>
                        </div>
                    </div>
                    
                    <img alt="" className="q-image" src={image_path}/>
                    <h3>{title}</h3>
                    <p>
                        {`截止時間：${due_time}`} <br/>
                        {`抽獎時間：${lottery_time}`}
                    </p>
                    <div className="tag_container">
                        <button className="share-q-management">分享</button>
                        <button onClick={deleteItem} className="share-q-management">刪除</button>
                    </div>
                    <div className="tag_container"></div>
                </div>
            </div>
        
        )
        
}

Item.defaultProps = {
    prize: '星巴克',
    num_prize: 1,
    image_path: process.env.PUBLIC_URL + 'dog.png',
    title: 'title-name',
    due_time: 'due-time',
    lottery_time: 'lottery-time',
    status: '未抽獎'
}

export default Item