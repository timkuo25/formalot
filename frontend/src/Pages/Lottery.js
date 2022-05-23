import '../css/Lottery.css'
import { Navbar } from './Components/Navbar';
import { Avator } from './Components/Avator';
import { LotteryCard } from './Components/LotteryCard'
import { ItemSlider } from './Components/ItemSlider'
import { LoginModal } from './Components/LoginModal';
import ReactLoading from "react-loading";
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { SendEmail } from './SendEmail';
import callrefresh from '../refresh.js';


// 傳入想要看的 formID

const Lottery = (props) => {
    const FORM_ID = props.form_id;
    const lotteryResults = props.lr;
    const isOwner = props.isOwner;
    const haveGifts = props.haveGifts;

    //For candidate slider
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    console.log('----- invoke function component -----');
    const [candidateList, setCandidateList] = useState([]);
    const [showSendEmail, setShowSendEmail] = useState(false);
    const [hasSentEmail, setHasSentEmail] = useState(false);

    // 使用 useEffect Hook
    useEffect(() => {
        console.log('execute function in useEffect');
        let abortController = new AbortController();  
        fetchCandidateList();
        fetchHasSentEmail();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 

    const fetchHasSentEmail = async () =>
    {
        const response = await fetch(
            `https://be-sdmg4.herokuapp.com/CheckSendEmail?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('jwt')}`  
                }
            }
        );
        if(response.status === 401){
            callrefresh();
        }
        else{
            const resJson = await response.json();
            setHasSentEmail(resJson.data['send_email']);
            console.log("HasSentEmail?", resJson.data['send_email']);
        }
    }

    // candidateList
    // {
    //     "data": {
    //         "candidates": [
    //             {
    //                 "user_pic_url": "https://i.imgur.com/JSAGBAs.jpg",
    //                 "user_student_id": "b07905244"
    //             },
    //         ]
    //     },
    //     "message": "Get candidates successfully!!!",
    //     "status": "success"
    // }
    const fetchCandidateList = () =>
    {
        fetch(
            `https://be-sdmg4.herokuapp.com/GetCandidate?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊
                }
            }
        )
        .then(response => response.json())
        .then(response => {
            console.log('candidate_data',response.data['candidates'])
            setCandidateList(response.data['candidates']);
        })
        .catch(error => console.log(error))  
    };

  
    function SeeStatus(){
        if (haveGifts!==0){
            if(lotteryResults.status === "Open"){
                return(<h3>問卷還沒到抽獎日期！</h3>)
            }
            else if(lotteryResults.status === "Delete")
            {
                return(<h3> 問卷已被製作者刪除。 </h3>)
            }
            else if(lotteryResults.status === "WaitForDraw")
            {
                return(<h3>問卷已到抽獎日，等待抽獎中，請稍候。</h3> )
            }
            else {
                return(lotteryResults.results && lotteryResults.results.map(result => <LotteryCard result={result}/>))
            }
        }
        // return lotteryResults.status === "Open" && haveGifts ? <h3>問卷還沒到抽獎日期！</h3>
        // : lotteryResults.status === "Open" && haveGifts === 0 ? <></>
        // : lotteryResults.status === "Delete" ? <h3> 問卷已被製作者刪除。 </h3>
        // : lotteryResults.status === "WaitForDraw" ? <h3>問卷已到抽獎日，等待抽獎中，請稍候。</h3> 
        // : lotteryResults.results && lotteryResults.results.map(result => <LotteryCard result={result}/>);
    }
          
    return (
        <>
            <section className='lottery-results card-shadow'>
                {console.log("haveGifts and isOwner?", haveGifts, isOwner)}
                <h1> {props.form_title} </h1>
                {haveGifts===true && isOwner===true && lotteryResults.status==='Closed' && <button className="send-email-btn Btn " onClick={() => setShowSendEmail(true)}>寄出中獎通知</button>}
                <div className='lottery-card card-shadow'>
                    <h2> 可抽獎人名單：{candidateList.length} 人 </h2>
                    <ItemSlider candidateList={candidateList} 
                    activeItemIndex={activeItemIndex} setActiveItemIndex={setActiveItemIndex}/>
                </div>
                {/* 禮物與中獎人 */}
                <div >
                    {console.log("isLoading", lotteryResults.isLoading)}
                    {lotteryResults.isLoading ? <> <div className="loading-container"> <ReactLoading type="spinningBubbles" color="#432a58" /> </div></> : 
                        SeeStatus()
                    }
                </div>
                {showSendEmail && <SendEmail hasSentEmail={hasSentEmail} setShowSendEmail={setShowSendEmail}/>} 
            </section>

        </>
    )
}
export { Lottery }