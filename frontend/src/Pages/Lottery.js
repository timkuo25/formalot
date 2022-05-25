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
import { useTranslation } from "react-i18next";


// 傳入想要看的 formID

const Lottery = (props) => {
    const FORM_ID = props.form_id;
    const lotteryResults = props.lr;
    const isOwner = props.isOwner;
    const haveGifts = props.haveGifts;

    //For candidate slider
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [candidateList, setCandidateList] = useState([]);
    const [showSendEmail, setShowSendEmail] = useState(false);
    const [hasSentEmail, setHasSentEmail] = useState(false);
    const { t, i18n } = useTranslation();

    // 使用 useEffect Hook
    useEffect(() => {
        console.log('Lottery.js: execute function in useEffect');
        let abortController = new AbortController();  
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchCandidateList(),
                    fetchHasSentEmail(),
                ])
            } catch(err){
                console.log('Lottery Page Fetch Error', err)
            }
        }
        fetchData();
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
            callrefresh("refresh");
        }
        else{
            const resJson = await response.json();
            setHasSentEmail(resJson.data['send_email']);
            console.log("Has Sent Email?", resJson);
        }
    }
    const fetchCandidateList = async () =>
    {
        const response = await fetch(
            `https://be-sdmg4.herokuapp.com/GetCandidate?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('jwt')}`  
                }
            }
        );
        if(response.status === 401){
            callrefresh("refresh");
        }
        else{
            const resJson = await response.json();
            setCandidateList(resJson.data['candidates']);
            console.log('Candidate Data', resJson)
        }
    }
  
    function SeeStatus(){
        if (haveGifts!==false){
            if(lotteryResults.status === "Open"){
                return(<h3>{t("問卷還沒到抽獎日期")}!</h3>)
            }
            else if(lotteryResults.status === "Delete")
            {
                return(<h3> {t("此問卷已被作者刪除")}。 </h3>)
            }
            else if(lotteryResults.status === "WaitForDraw")
            {
                return(<h3>{t("問卷已截止，等待抽獎中。")}。</h3> )
            }
            else {
                return(lotteryResults.results && lotteryResults.results.map(result => <LotteryCard result={result}/>))
            }
        }
    }
          
    return (
        <>
            <section className='lottery-results card-shadow'>
                {console.log("HaveGifts and isOwner?", haveGifts, isOwner)}
                <h1> {props.form_title} </h1>
                {haveGifts===true && isOwner===true && lotteryResults.status==='Closed' && <button className="send-email-btn Btn " onClick={() => setShowSendEmail(true)}>{t("寄出中獎通知")}</button>}
                <div className='lottery-card card-shadow'>
                    <h2> {t("可抽獎人名單")}：{candidateList.length} {t("人")} </h2>
                    <ItemSlider candidateList={candidateList} 
                    activeItemIndex={activeItemIndex} setActiveItemIndex={setActiveItemIndex}/>
                </div>
                {/* 禮物與中獎人 */}
                <div >
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