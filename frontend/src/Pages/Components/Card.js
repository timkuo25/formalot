import '../../css/Card.css';


const Card = ({ info, type }) => {
    if (!info) return <div className="empty-card"></div>;
    let prize, num_prize, image_path, title, due_time, lottery_time;

    if (type === 'home'){
        prize = 'prize name';
        num_prize = 'x';
        image_path = info.form_pic_url;
        title = info.form_title;
        // due_time = info.form_end_date;
        due_time = new Intl.DateTimeFormat('zh-TW', {
            year: 'numeric', 
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(info.form_end_date))
        lottery_time = 'lottery date';
    }


    if (type === 'explore'){
        prize = 'prize name';
        num_prize = 'x';
        image_path = info.form_pic_url;
        title = 'title';
        due_time = info.form_end_date;
        lottery_time = 'lottery date';
    }

    function clickForm(){
        console.log("form_id of this card is", info.form_id);
        window.location.href='form/'+info.form_id;
    }

    return (
        <div className="card card-shadow" onClick={clickForm}>
            <div className="prize-tag">{`${prize} ${num_prize} 名`}</div>
            <img alt="" className="q-image" src={image_path}/>
            <div className='card-form-title'> <h3>{title}</h3> </div>
            <p>
                {`截止時間：${due_time}`} <br/>
                {`抽獎時間：${lottery_time}`}
            </p>
            <button className='share-q'> <img className='share-image' src={process.env.PUBLIC_URL + 'share.png'} alt="分享"/></button>
        </div>

    )
}

export { Card };