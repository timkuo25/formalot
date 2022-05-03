import '../css/Lottery.css'
import { Navbar } from './Components/Navbar';
import { Avator } from './Components/Avator';
import { LotteryCard } from './Components/LotteryCard'
import { ItemSlider } from './Components/ItemSlider'
import ReactLoading from "react-loading";
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';


// 傳入想要看的 formID

const Lottery = (props) => {
    const FORM_ID = props.form_id;

    //For candidate slider
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    console.log('----- invoke function component -----');
    const [candidateList, setCandidateList] = useState([]);
    const [lotteryResults, setLotteryResults] = useState({
        "status":"Open",
        "results":[],
        "isLoading":true,  // 控制是否還在 loading
    });

    // 使用 useEffect Hook
    useEffect(() => {
        console.log('execute function in useEffect');
        let abortController = new AbortController();  
        fetchCandidateList();
        fetchLotteryResults();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 


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
            `http://127.0.0.1:5000/GetCandidate?form_id=${encodeURIComponent(FORM_ID)}`,
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

 

    // lotteryResults
    // {
    //     "data": {
    //         "results": [
    //             {
    //                 "amount": 1,
    //                 "gift_name": "LG 樂金直驅變頻上下門冰箱393公升",
    //                 "gift_pic_url": "https://i.imgur.com/j7aXj81.jpg",
    //                 "winner": [
    //                     {
    //                         "user_pic_url": "https://i.imgur.com/bJaiDDA.jpg",
    //                         "user_student_id": "b07401201"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "amount": 1,
    //                 "gift_name": "星巴克",
    //                 "gift_pic_url": "https://i.imgur.com/KhpRc5G.jpg",
    //                 "winner": [
    //                     {
    //                         "user_pic_url": "https://i.imgur.com/POYn9h1.jpg",
    //                         "user_student_id": "r09302322"
    //                     }
    //                 ]
    //             }
    //         ],
    //         "禮物數量": 2
    //     },
    //     "message": "Get lottery results successfully!!!",
    //     "status": "Closed","WaitforDraw", "Open","Delete"
    // }
    const fetchLotteryResults = () =>
    {
        fetch(
            `http://127.0.0.1:5000/GetLotteryResults?form_id=${encodeURIComponent(FORM_ID)}`,
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
            console.log('lottery results22', response)
            setLotteryResults({
                "status": response.status,
                "results": response.data['results'],
                "isLoading": false,
            })
        })
        .catch(error => console.log(error))  
    };



  
    function SeeStatus(lotteryResults){
        return lotteryResults.status === "Open" ? <h3>問卷還沒到抽獎日期！</h3>
        : lotteryResults.status === "Delete" ? <h3> 問卷已被製作者刪除。 </h3>
        : lotteryResults.status === "WaitforDraw" ? <h3>問卷已到抽獎日，等待製作者手動抽獎。</h3> 
        : lotteryResults.results && lotteryResults.results.map(result => <LotteryCard result={result}/>);
    }

    
    return (
        <>
            <section className='lottery-results card-shadow'>
                <h1> {props.form_title} </h1>
                <div className='lottery-card card-shadow'>
                    <h2> 可抽獎人名單：{candidateList.length} 人 </h2>
                    <ItemSlider candidateList={candidateList} 
                    activeItemIndex={activeItemIndex} setActiveItemIndex={setActiveItemIndex}/>
                </div>
                {/* 禮物與中獎人 */}
                <div >
                    {console.log("isLoading", lotteryResults.isLoading)}
                    {lotteryResults.isLoading ? <> <div className="loading-container"> <ReactLoading type="spinningBubbles" color="#432a58" /> </div></> : 
                        SeeStatus(lotteryResults)
                    }

                </div>


            </section>

        </>
    )
}
export { Lottery }