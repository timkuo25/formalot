import '../css/Lottery.css'
import { Navbar } from './Components/Navbar';
import { Avator } from './Components/Avator';
import { LotteryCard } from './Components/LotteryCard'
import { ItemSlider } from './Components/ItemSlider'
import ReactLoading from "react-loading";
import React, { useState, useEffect } from 'react';


// 傳入想要看的 formID
const FORM_SEARCH = {id:1};

const Lottery = () => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);


    console.log('----- invoke function component -----');
    const [gifts, setGifts] = useState([]);
    const [candidateList, setCandidateList] = useState([]);
    const [formDetail, setFormDetail] = useState([]);
    const [lotteryResults, setLotteryResults] = useState({
        "status":"Unknown",
        "results":[],
        "isLoading":true,
    });
    const [isLoading, setLoading] = useState(1);

    // 取得 access token
    // const access_token =  localStorage.getItem('jwt');

    // 使用 useEffect Hook
    useEffect(() => {
        console.log('execute function in useEffect');
        let abortController = new AbortController();  
        fetchCurrentGifts();
        fetchCandidateList();
        fetchFormDetail();
        fetchLotteryResults();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 


    // gifts
    // {
    //     "data": [
    //         {
    //             "amount": 1,
    //             "gift_name": "LG 樂金直驅變頻上下門冰箱393公升",
    //             "gift_pic_url": "https://i.imgur.com/j7aXj81.jpg"
    //         },
    //     ],
    //     "message": "Get gifts successfully!!!",
    //     "status": "success", "error"
    // }
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
            `http://127.0.0.1:5000/GetCandidate?form_id=${encodeURIComponent(FORM_SEARCH.id)}`,
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

    // formDetail
    // {
    //     "form_create_date": "Mon, 21 Mar 2022 12:59:59 GMT",
    //     "form_draw_date": "Sun, 22 May 2022 12:59:59 GMT",
    //     "form_end_date": "Sat, 21 May 2022 12:59:59 GMT",
    //     "form_title": "對儀式感的看法之探討"
    // }
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
            `http://127.0.0.1:5000/GetLotteryResults?form_id=${encodeURIComponent(FORM_SEARCH.id)}`,
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
            console.log('lottery results22',response)
            setLotteryResults({
                "status": response.status,
                "results": response.data['results'],
                "isLoading": false,
        })})
        // .then(setLoading(0))
        .catch(error => console.log(error))  
    };

    // function Loading (isLoading ){
    //     if(isLoading == 1){
    //         return <ReactLoading type="spinningBubbles" color="#432a58" />
    //     }
    // }
    
    return (
        <>
            <Navbar/>
            {console.log('render')}
            <section className='lottery-page-container'>
                {/* 問卷左半部抽獎結果 */}
                <section className='lottery-container'>
                    <section className='lottery-results card-shadow'>
                        <h2> {formDetail.form_title} </h2>
                        <div className='lottery-card card-shadow'>
                            <h2> 可抽獎人名單：{candidateList.length} 人 </h2>
                            <ItemSlider candidateList={candidateList} 
                            activeItemIndex={activeItemIndex} setActiveItemIndex={setActiveItemIndex}/>
                        </div>
                        {/* 禮物與中獎人 */}
                        <div >
                            {/* <button className='form-button' onClick={fetchLotteryResults}> 中獎名單</button> */}
                            {console.log("isLoading", lotteryResults.isLoading)}
                            {lotteryResults.isLoading ? <ReactLoading type="spinningBubbles" color="#432a58" /> : 
                                lotteryResults.results && lotteryResults.results.map(result => {
                                    return (
                                        <LotteryCard result={result}/>
                                    )
                                })
                            }

                        </div>


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
                <div className='form-buttons'>
                    <button class='form-button'> 填答結果</button>
                    <button class='form-button'> 瀏覽問卷</button>
                    {/* <button class='form-button' onClick={fetchCurrentGifts}> 重新整理</button> */}
                </div>
            </section>

        </>
    )
}
export { Lottery }