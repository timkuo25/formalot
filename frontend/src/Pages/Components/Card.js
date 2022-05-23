import '../../css/Card.css';
import callrefresh from '../../refresh.js';
import { FaRegCopy } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from 'react';

const Card = ({ info, type, openModal }) => {
    const { t, i18n } = useTranslation();
    if (!info) return <div className="empty-card"></div>;
    let prize, num_prize, image_path, title, due_time, lottery_time;

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



    // if (type === 'explore'){
    //     prize = '抽獎名額';
    //     num_prize = info.num_gift;
    //     image_path = info.form_pic_url || (process.env.PUBLIC_URL + 'form_preview_default.png');
    //     title = info.form_title.length > 30 ? info.form_title.substring(0, 30) + '...' : info.form_title;
    //     due_time = info.form_end_date;
    //     lottery_time = 'lottery date';
    // }

    const clickForm = () => {
        if(!(localStorage.getItem('jwt'))){
            openModal();
            return;
        }
        console.log("form_id of this card is", info.form_id);
        window.location.href='form/'+info.form_id;
    }

    // 刪除或關閉問卷
    const manageform = async (action) => {
        const getprotected = await fetch('http://127.0.0.1:5000/SurveyManagement',{
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({
                form_id: info.form_id,
                action : action,
            }),
        });
        console.log(getprotected.status);
        if(getprotected.status === 401){
            callrefresh();
        }else{
            const resdata = await getprotected.json();
            console.log(resdata);
            console.log(resdata.message);
            alert(resdata.message);
        }
    };

    function showStatus(){
        if(type==='replied'){
            if(info.form_run_state === 'Closed'){
                if(info.draw_result === null){
                    return(<div className="prize-tag black">{'未中獎'}</div>)
                }
                else if(info.form_run_state !== null){
                    return(<div className="prize-tag pink">{'已中獎'}</div>)
                }            
            }
            else if(info.form_run_state === 'Open'){
                return(<div className="prize-tag">{'未開獎'}</div>)
            }
            else if(info.form_run_state === 'Delete'){
                return(<div className="prize-tag black">{'已刪除'}</div>)
            }
            else {
                return(<div className="prize-tag">{'未知狀態'}</div>)
            }
        }
        else if (type==='created'){
            if(info.form_run_state === 'Open'){
                return(<div className="prize-tag">{'未開獎'}</div>)
            }
            else if(info.form_run_state === 'Closed'){
                return(<div className="prize-tag pink">{'已開獎'}</div>)
            }
            else if(info.form_run_state === 'WaitForDraw'){
                return(<div className="prize-tag pink">{'待開獎'}</div>)
            }
            else if(info.form_run_state === 'Delete'){
                return(<div className="prize-tag">{''}</div>)
            }
            else {
                return(<div className="prize-tag">{'未知狀態'}</div>)
            }
        }
    }

    return (
        <div className="card card-shadow" onClick={clickForm}>
            <div className="prize-tag-container">
                {type==='home'? <><div className="prize-tag">{`${prize} ${num_prize} 名`}</div></> : <></>}
                {showStatus()}
                <div className="nav-option user-dropdown" >
                    {t("...")}
                    <div className="user-dropdown-options" >
                        <button onClick={()=>{manageform('close')}}>{t("關閉問卷")}</button>
                        <button onClick={()=>{manageform('delete')}}>{t("刪除問卷")}</button>
                    </div>
                </div>
            </div>
            <img alt="" className="q-image" src={image_path}/>
            <div className='card-form-title'> <h3>{title}</h3> </div>
            <p>
                {t("截止時間")}:<br/>{due_time} <br/>
                {t("抽獎時間")}:<br/>{lottery_time}
            </p>
            <FaRegCopy
                className='share-q' 
                onClick={async e => {
                    e.stopPropagation();
                    await navigator.clipboard.writeText(window.location.href=`/form/${info.form_id}`);
                    const copyMsg = document.querySelector('.copy-message');
                    copyMsg.classList.add('show');

                    setTimeout(() =>{copyMsg.classList.remove('show')}, 2500);
                }}
            />
        </div>

    )
}

export { Card };