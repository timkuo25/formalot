import '../../css/Card.css';
import { FaRegCopy } from 'react-icons/fa';


const Card = ({ info, type, openModal, copyURL }) => {
    if (!info) return <div className="empty-card"></div>;
    let prize, num_prize, image_path, title, due_time, lottery_time;

    if (type === 'home'){
        prize = '抽獎名額';
        num_prize = info.num_gift;
        image_path = info.form_pic_url || (process.env.PUBLIC_URL + 'form_preview_default.png');
        title = info.form_title.length > 30 ? info.form_title.substring(0, 30) + '...' : info.form_title;
        // due_time = info.form_end_date;
        due_time = new Intl.DateTimeFormat('zh-TW', {
            year: 'numeric', 
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(info.form_end_date))

        lottery_time = new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric', 
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        }).format(new Date(info.form_draw_date));
    }


    if (type === 'explore'){
        prize = '抽獎名額';
        num_prize = info.num_gift;
        image_path = info.form_pic_url || (process.env.PUBLIC_URL + 'form_preview_default.png');
        title = info.form_title;
        due_time = info.form_end_date;
        lottery_time = 'lottery date';
    }

    const clickForm = () => {
        if(!(localStorage.getItem('jwt'))){
            openModal();
            return;
        }
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
            <FaRegCopy
                className='share-q' 
                onClick={async e => {
                    e.stopPropagation();
                    await navigator.clipboard.writeText(`localhost:3000/form/${info.form_id}`);
                    copyURL();
                }}
            />
        </div>

    )
}

export { Card };