import '../css/Lottery.css'
import '../css/Fill-in.css'
import { Navbar } from './Components/Navbar';
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';


const Fillin = (props) => {


    const FORM_ID = props.form_id; // 傳入想要看的 formID
    console.log('----- invoke function component -----');
    const [gifts, setGifts] = useState([]);
    const [formDetail, setFormDetail] = useState([]);
    const [formContent, setFormContent] = useState([]);

    // 取得 access token
    // const access_token =  localStorage.getItem('jwt');

    // 使用 useEffect Hook
    useEffect(() => {
        let abortController = new AbortController();  
        fetchQuestions();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 

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
            setFormDetail(response);
        })
        .catch(error => console.log(error))  
    };

    const fetchQuestions = () =>
    {
        fetch(
            `http://127.0.0.1:5000/GetUserForm?form_id=${encodeURIComponent(FORM_ID)}`,
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
            console.log('questions',response)
            setFormContent({
                description: response[0]['form_description'],
                picture: response[0]['form_pic_url'],
                questions: response[0]['questioncontent']
        })})
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
                        <input type="radio" id={question.Question} name={question.Question} value={option} />
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
                        <input type="checkbox" id={question.Question} name={question.Question} value={option} />
                    </div>
                )
            })
            return(questionBox)
        }
        else if (question.Type=="簡答題"){
            return (
                <textarea rows="6" type="text" placeholder="Answer" className='input-columns' name={question.Question}
                style={{width: "100%", height:"90px"}}/>
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
        
        const result = await fetch("http://127.0.0.1:5000/FillForm", {
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
            {/* 問卷左半部問卷題目 */}
            <section className='lottery-results card-shadow'>
            <h1> {props.form_title} </h1>
            <section className='form-description'> {formContent.description} </section>
                {/* 所有問題會顯示在這邊 */}
                <div className='questions'>
                    {console.log('questions',formContent.questions)}
                    <form onSubmit={handleSubmit}>
                    {formContent.questions && formContent.questions.map(question => {
                        return (
                            <div key={question.Question}>
                                <h3> {question.Question} </h3>
                                {showQuestion(question)}
                            </div>
                    )})}
                    <br/>
                    <input type="submit" className='general-button Btn ' value="送出表單" />
                    </form>
                </div>
            </section>
        </>
    )
}
export { Fillin }