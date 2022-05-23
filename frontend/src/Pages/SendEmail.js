import '../css/Lottery.css'
import '../css/Fill-in.css'
import '../css/Form.css'
import { Navbar } from './Components/Navbar';
import React, { useState, useEffect, useCallback } from 'react';
import {useParams} from 'react-router-dom';


const SendEmail = (props2) => {
    const props = useParams();
    const FORM_ID = props.form_id; // 傳入想要看的 formID
    const hasSentEmail = props2.hasSentEmail;
    const setShowSendEmail = props2.setShowSendEmail;
    const [time, setTime] = useState([])
    const [place, setPlace] = useState([])
    const [contact, setContact] = useState([])

    // 使用 useEffect Hook
    useEffect(() => {
        let abortController = new AbortController();  
        console.log('execute function in useEffect');
        // 等問卷資料載入完畢再進入頁面
        const fetchData = async () => {
            try{
                console.log(hasSentEmail, props2.setShowSendEmail)
                await Promise.all([
                ]);
            }
            catch(error){
                console.log('fetchdata', error)
            }
        }
        fetchData();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency
    

    const sendEmailAPI = async (e) => {
        const info = JSON.stringify({
            time: time,
            place: place,
            issuer_info: contact
        })
        console.log(info)
        e.preventDefault();
        const result = await fetch(`https://be-sdmg4.herokuapp.com/SendEmailPage?form_id=${encodeURIComponent(FORM_ID)}`, {
            method: "POST",
            body: info,
        });
        let resJson = await result.json();
        console.log("submit message", resJson.message);
        console.log("submit status", resJson.status);
        alert(resJson.message);
        window.location.reload();
    };


    return (
        <>
            {console.log('render')}
            {/* 選擇要填寫問卷、查看抽獎、查看填寫結果 */}
            <section className='lottery-page-container'>
                <div className='modalBackground'>
                    {hasSentEmail===0?
                        <><div className="sendEmail-modal">
                            <button onClick={() => setShowSendEmail(false)} className="titleCloseBtn">X</button>
                            <h2>問卷標題</h2>
                            <input rows="1" type="text" placeholder="領獎時間" className='input-columns' name={'time'}
                                style={{width: "100%", height:"10%", marginBottom:"10px"}}  onChange={(e) => setTime(e.target.value)}/>
                            <input rows="1" type="text" placeholder="領獎地點" className='input-columns' name={'place'}
                                style={{width: "100%", height:"10%", marginBottom:"10px"}}  onChange={(e) => setPlace(e.target.value)}/>
                            <textarea rows="4" type="text" placeholder="聯絡方式" className='input-columns' name={'contact'}
                                style={{width: "100%", height:"40%", marginBottom:"10px"}}  onChange={(e) => setContact(e.target.value)}/>
                            <button className="Btn send-email-btn" onClick={sendEmailAPI}>寄出中獎信</button>
                            <button className="Btn create-account-button" onClick={() => {window.location.href=`/form/${FORM_ID}`}}>查看問卷</button>
                        </div></> : 
                        <><div className="sendEmail-modal">
                            <button onClick={() => setShowSendEmail(false)} className="titleCloseBtn">X</button>
                            <h3> 已經寄過中獎通知信了喔。 </h3>
                            <button className="Btn create-account-button" onClick={() => {window.location.href=`/form/${FORM_ID}`}}>查看問卷</button>
                        </div></>
                    }
                    {console.log(time, place, contact)}
                </div>
            </section>
        </>
    )
}
export {SendEmail}