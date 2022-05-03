import '../css/Lottery.css'
import '../css/Fill-in.css'
import '../css/Form.css'
import { Navbar } from './Components/Navbar';
import { Fillin } from './Fill-in';
import { Lottery } from './Lottery';
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';


const Form = () => {
    const props = useParams();
    const FORM_ID = props.form_id; // 傳入想要看的 formID
    const tags = ['填寫問卷', '抽獎結果'];
    
    
    console.log('----- invoke function component -----');
    const [gifts, setGifts] = useState([]);
    const [formDetail, setFormDetail] = useState([]);
    const [showTag, setShowTag] = useState('填寫問卷');


    // 使用 useEffect Hook
    useEffect(() => {
        let abortController = new AbortController();  
        console.log('execute function in useEffect');
        fetchCurrentGifts();
        fetchFormDetail();
        fetchIsOwner();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 

    const fetchIsOwner = async () =>
    {
        const response = await fetch(
            `http://127.0.0.1:5000/FormOwnerCheck?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`  
                }
            }
        );
        const resJson = await response.json();
        console.log("is owner?", resJson);
    }


    const fetchCurrentGifts = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/GetGift?form_id=${encodeURIComponent(FORM_ID)}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊 應該要拿掉
                    }
                });
            const responseJson = await response.json();
            setGifts(responseJson.data);
            console.log('giftsdata',response.data);
        }
        catch (error) {
            console.log(error);
        }
    };

    const fetchFormDetail = () =>
    {
        fetch(
            `http://127.0.0.1:5000/GetFormDetail?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊 可拿掉
                }
            }
        )
        .then(response => response.json())
        .then(response => {
            console.log('Form Detail',response)
            setFormDetail({
                form_create_date : new Intl.DateTimeFormat('zh-TW', {
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                }).format(new Date(response.form_create_date)),
                form_end_date : new Intl.DateTimeFormat('zh-TW', {
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                }).format(new Date(response.form_end_date)),
                form_draw_date : new Intl.DateTimeFormat('zh-TW', {
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                }).format(new Date(response.form_draw_date))
            })
        })
        .catch(error => console.log(error))  
    };

    function changePage(showTag){
        return showTag === "填寫問卷" ? <Fillin form_id = {FORM_ID} form_title={formDetail.form_title} />
        : <Lottery form_id = {FORM_ID} form_title={formDetail.form_title}/> 
    }



    return (
        <>
            <Navbar/>
            {console.log('render')}
            {/* 選擇要填寫問卷、查看抽獎、查看填寫結果 */}
            <section className='lottery-page-container'>
                <div className='page-navbar'>
                    {tags.map(item => {
                        return (
                            <div
                                className='page-navbar-item'
                                key={item}
                                style={item === showTag ? {backgroundColor: 'rgba(77, 14, 179, 0.15)'} : {}}
                                onClick={e => {
                                    setShowTag(item);
                                }}
                            >{item}</div>
                        )
                    })}
                </div>
                <section className='lottery-container'>
                    {/* 問卷左半部 */}
                    {changePage(showTag)}
                    {/* 問卷右半部基本問卷資訊 */}
                    <section className='form-info card-shadow'>
                        <h2> 問卷資訊 </h2>
                        發布時間：{formDetail.form_create_date} <br />
                        截止時間：{formDetail.form_end_date} <br />
                        抽獎時間：{formDetail.form_draw_date} <br />
                        <h2> 獎品 </h2>
                        {gifts.length === 0 ? <h3>此問卷沒有抽獎</h3> :  
                            gifts.map(gift => {
                                return (
                                    <div className='prize-container' key={gift.gift_name}>
                                        <h3> {gift.gift_name} × {gift.amount} </h3>
                                        <img className='prize-image' src={gift.gift_pic_url} alt=''/>
                                    </div>
                                )
                            })
                        }
                    </section>
                </section>
            </section>

        </>
    )
}
export { Form }