import '../../css/Card.css';
import { useEffect, useState } from 'react';


const Card = ({ info }) => {
    if (!info) return <div className="empty-card"></div>
    const prize = 'prize name';
    const num_prize = 'x';
    const image_path = `${process.env.PUBLIC_URL}/dog.png` //info.form_pic_url;
    const title = info.form_title;
    const due_time = info.form_end_date;
    const lottery_time = 'lottery date';

    return (
        <div className="card card-shadow">
            <div className="prize-tag">{`${prize} ${num_prize} 名`}</div>
            <img alt="" className="q-image" src={image_path}/>
            <h3 className='aaa'>{title}</h3>
            <p>
                {`截止時間：${due_time}`} <br/>
                {`抽獎時間：${lottery_time}`}
            </p>
            <button className='share-q'> <img className='share-image' src={process.env.PUBLIC_URL + 'share.png'} alt="分享"/></button>
        </div>
    )
}

export { Card };