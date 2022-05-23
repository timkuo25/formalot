import '../css/Lottery.css'
import '../css/Fill-in.css'
import callrefresh from '../refresh.js';
import React, { useState, useEffect } from 'react';
import ReactLoading from "react-loading";


const Fillin = (props) => {


    const FORM_ID = props.form_id; // 傳入想要看的 formID
    console.log('----- invoke function component -----');
    const [formContent, setFormContent] = useState([]);
    const [hasAnsweredBefore, sethasAnsweredBefore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // 取得 access token
    // const access_token =  localStorage.getItem('jwt');

    // 使用 useEffect Hook
    useEffect(() => {
        let abortController = new AbortController();  
        const fetchData = async () => {
            try{
                await Promise.all([
                    formRespondCheck(),
                    fetchQuestions()]);
                setIsLoading(false);
            }
            catch(err){
                console.log('Fill in page error', err)
            }
        }
        fetchData();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 

    const formRespondCheck = async () => {
        try{
            const response = await fetch(
                `https://be-sdmg4.herokuapp.com/FormRespondentCheck?form_id=${encodeURIComponent(FORM_ID)}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,  //驗證使用者資訊
                }
            });
            console.log("token?", response.status);
            if(response.status === 401){
                callrefresh();
            }
            else{
                const resJson = await response.json();
                console.log("form response check ", resJson);
                sethasAnsweredBefore(resJson["has_responded"]);
            }
        } catch(e) {
             console.log("form response check error", e)
        }
    }

    const fetchQuestions = async () => {
        try{
            const response = await fetch(
                `https://be-sdmg4.herokuapp.com/GetUserForm?form_id=${encodeURIComponent(FORM_ID)}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,  //驗證使用者資訊
                }});
            const resJson = await response.json();
            console.log("questions", resJson[0]['questioncontent']);
            setFormContent({
                description: resJson[0]['form_description'],
                picture: resJson[0]['form_pic_url'],
                questions: resJson[0]['questioncontent']
            })
        } catch(e) {
             console.log("form response check error", e)
        }
    }

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

    function showQuestion_disabled(question){
        const questionBox = [];
        if (question.Type=="單選題"){
            question.Options && question.Options.map(option => {
                questionBox.push ( 
                    <div className='question-card'>
                        <label> {option}</label>
                        <input type="radio" id={question.Question} name={question.Question} value={option} disabled/>
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
                        <input type="checkbox" id={question.Question} name={question.Question} value={option} disabled />
                    </div>
                )
            })
            return(questionBox)
        }
        else if (question.Type=="簡答題"){
            return (
                <textarea rows="6" type="text" placeholder="Answer" className='input-columns' name={question.Question}
                style={{width: "100%", height:"90px"}} disabled/>
            )
        }
    }



    // 提交回答
    const handleSubmit = async(e) => {
        e.preventDefault();
        // 取得表單回覆
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);
        const tempAnsList = [];
        var continued = 1;
        for(const key in formProps ){
            if (formProps[key] ==""){
                alert(key+ "\n 需要填答此問題，才能成功提交表單，參加抽獎喔！");
                continued = 0;
            } else {
                const tempAns = {
                    Question : key,
                    Answer : formProps[key]
                }
                tempAnsList.push(tempAns)
            }
        }
        if(continued === 1){
            console.log("tempAnsList", tempAnsList) // 印出回傳結果看一下，可刪掉

            const result = await fetch("https://be-sdmg4.herokuapp.com/FillForm", {
                method: "POST",
                body: JSON.stringify({
                    form_id: props.form_id,
                    answercontent: tempAnsList,
                }),
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            let resJson = await result.json();
            console.log("submit message", resJson.message);
            console.log("submit status", resJson.status);
            alert(resJson.message);
            window.location.reload();
        }

    }



    return (
        <>
        {/* 問卷左半部問卷題目，如果用戶已經填答過 */}
        <section className='lottery-results card-shadow'>
            <h1> {props.form_title} </h1>
            {isLoading ? <> <div className="loading-container"> <ReactLoading type="spinningBubbles" color="#432a58" /> </div></> : 
            <>
                <section className='form-description'> {formContent.description} </section>
                    {hasAnsweredBefore?  <><br /><section className='form-description alert'> 你已經填答過此問卷摟！ </section></>: ''}
                    {/* 所有問題會顯示在這邊 */}
                    <div className='questions'>
                        {/* {console.log('questions',formContent.questions)} */}
                        <form onSubmit={handleSubmit} >
                        {formContent.questions && formContent.questions.map(question => {
                            return (
                                <div key={question.Question}>
                                    <h3> {question.Question} </h3>
                                    {hasAnsweredBefore? showQuestion_disabled(question) :  showQuestion(question)}
                                </div>
                        )})}
                        <br/>
                        <input type="submit" className='general-button Btn ' value="送出表單" />
                        </form>
                    </div>
            </>
            }
        </section>
        </>
    )
}
export { Fillin }