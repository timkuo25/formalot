import '../css/Lottery.css'
import { Navbar } from './Components/Navbar';
import React, { useState, useEffect } from 'react';
import {useHref, useParams} from 'react-router-dom';


const BrowseForm = () => {
    const props = useParams();
    console.log("Props in lottery page", props.form_id)
    const FORM_ID = props.form_id; // 傳入想要看的 formID
    
    
    console.log('----- invoke function component -----');
    const [gifts, setGifts] = useState([]);
    const [formDetail, setFormDetail] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

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

    const fetchCurrentGifts = async () => {
        try {
            const response = await fetch(
                `https://be-sdmg4.herokuapp.com/GetGift?form_id=${encodeURIComponent(FORM_ID)}`,
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
            `https://be-sdmg4.herokuapp.com/GetFormDetail?form_id=${encodeURIComponent(FORM_ID)}`,
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
            `https://be-sdmg4.herokuapp.com/GetUserForm?form_id=${encodeURIComponent(FORM_ID)}`,
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
            console.log('getUserForm',response)
            setQuestions(response[0]['questioncontent']);
        })
        .catch(error => console.log(error))  
    };

    //決定要顯示哪些問題
    function showQuestion(question){
        const questionBox = [];
        if (question.Type=="單選題"){
            question.Options && question.Options.map(option => {
                questionBox.push ( 
                    <div className='question-card'>
                        <label> {option}</label>
                        <input type="radio"  id={question.Question} name={question.Question} value={option} disabled="1"/>
                    </div>
                )
            })
            return(questionBox)
        }
        else if (question.Type=="複選題"){
            question.Options && question.Options.map(option => {
                questionBox.push ( 
                    <div className='question-card'>
                        <label> {option}</label>
                        <input type="checkbox" id={question.Question} name={question.Question} value={option} disabled="1"/>
                    </div>
                )
            })
            return(questionBox)
        }
        else if (question.Type=="簡答題"){
            return (
                <textarea rows="6" type="text" placeholder="Answer" className='input-columns' name={question.Question}
                style={{width: "100%", height:"90px"}} disabled="1"/>
            )
        }
    }



    // 提交回答
    const handleSubmit = async(e) => {
        e.preventDefault();
        // 取得表單回覆
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);
        const tempAnsList = []
        for(const key in formProps ){
            const tempAns = {
                Question : key,
                Answer : formProps[key]
            }
            tempAnsList.push(tempAns)
        }
        console.log("tempAnsList", tempAnsList) // 印出回傳結果看一下，可刪掉
        
        const result = await fetch("https://be-sdmg4.herokuapp.com/FillForm", {
            method: "POST",
            body: JSON.stringify({
                form_id: props.form_id,
                answercontent: tempAnsList,
            }),
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
        });
        let resJson = await result.json();
        console.log("submit message", resJson.message);
    }


    return (
        <>
            <Navbar/>
            {console.log('render')}
            <section className='lottery-page-container'>
                {/* 問卷左半部問卷題目 */}
                <section className='lottery-container'>
                    <section className='lottery-results card-shadow'>
                        <h1> {formDetail.form_title} </h1>
                        {/* 所有問題會顯示在這邊 */}
                        <div className='questions'>
                            {console.log('questions',questions)}
                            <form onSubmit={handleSubmit}>
                            {questions && questions.map(question => {
                                return (
                                    <div key={question.Question}>
                                        <h2> {question.Question} </h2>
                                        {showQuestion(question)}
                                    </div>
                            )})}
                            {/* <br/> */}
                            {/* <input type="submit" className='general-button Btn ' value="送出表單" /> */}
                            </form>
                        </div>
                    </section>


                    {/* 問卷右半部基本問卷資訊 */}
                    <section className='form-info card-shadow'>
                        <h2> 問卷資訊 </h2>
                        發布時間：{formDetail.form_create_date} <br />
                        截止時間：{formDetail.form_end_date} <br />
                        抽獎時間：{formDetail.form_draw_date}<br/>
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
export { BrowseForm }