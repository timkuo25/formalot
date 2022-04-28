import '../css/Fill-in.css';
import { Navbar } from './Components/Navbar';
// import { Avator } from './Components/Avator';
import {QuestionCard} from './Components/QuestionCard'
import React, { useState, useEffect } from 'react';

// 傳入想要看的 formID
const FORM_SEARCH = {id:1};

const Fillin = () => {

    console.log('----- invoke function component -----');

    const [gifts, setGifts] = useState([]);
    const [formDetail, setFormDetail] = useState([]);
    const [questions, setQuestions] = useState([]);

    // 取得 access token
    // const access_token =  localStorage.getItem('jwt');

    // 使用 useEffect Hook
    useEffect(() => {
        let abortController = new AbortController();  
        console.log('execute function in useEffect');
        fetchCurrentGifts();
        fetchFormDetail();
        fetchQuestions();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 

    const fetchCurrentGifts = () =>
    {
        fetch(
            `http://127.0.0.1:5000/GetGift?form_id=${encodeURIComponent(FORM_SEARCH.id)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊 應該要拿掉
                }
            }
        )
        .then(response => response.json())
        .then(response => {
            setGifts(response.data);
            console.log('giftsdata',response.data)
        })
        .catch(error => console.log(error))  
    };

    const fetchFormDetail = () =>
    {
        fetch(
            `http://127.0.0.1:5000/GetFormDetail?form_id=${encodeURIComponent(FORM_SEARCH.id)}`,
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
            setFormDetail(response);
        })
        .catch(error => console.log(error))  
    };


    const fetchQuestions = () =>
    {
        fetch(
            `http://127.0.0.1:5000/GetUserForm?form_id=${encodeURIComponent(FORM_SEARCH.id)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('jwt')}`,  //驗證使用者資訊
                }
            }
        )
        .then(response => response.json())
        .then(response => {
            console.log('questions',response[0]['temp_col']['Questions'])
            setQuestions(response[0]['temp_col']['Questions']);
        })
        .catch(error => console.log(error))  
    };



    return (
        <>
            <Navbar/>
            {console.log('render')}
            <section className='lottery-page-container'>
                {/* 問卷左半部問卷題目 */}
                <section className='lottery-container'>
                    <section className='lottery-results card-shadow'>
                        <h2> {formDetail.form_title} </h2>
                        <QuestionCard questions={questions} />
                    </section>



                    {/* 問卷右半部基本問卷資訊 */}
                    <section className='form-info card-shadow'>
                        <h2> 問卷資訊 </h2>
                        發布時間：{formDetail.form_create_date} <br />
                        截止時間：{formDetail.form_end_date} <br />
                        抽獎時間：{formDetail.form_draw_date}<br/>
                        <h2> 獎品 </h2>
                        {gifts.map(gift => {
                            return (
                                <div className='prize-container' key={gift.gift_name}>
                                    <h3> {gift.gift_name} × {gift.amount} </h3>
                                    <img className='prize-image' src={gift.gift_pic_url} alt=''/>
                                </div>
                            )
                        })}

                    </section>
                </section>
            </section>

        </>
    )
}
export { Fillin }