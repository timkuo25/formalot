import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Avator } from './Components/Avator';
import {LotteryCard} from './Components/LotteryCard'
import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { TagCloud } from 'react-tagcloud'


// 傳入想要看的 formID
const FORM_SEARCH = {id:1};

const SurveyStatistics = () => {

    console.log('----- invoke function component -----');

    const [gifts, setGifts] = useState([]);
    const [candidateList, setCandidateList] = useState([]);
    const [formDetail, setFormDetail] = useState([]);
    const [lotteryResults, setLotteryResults] = useState([]);

    // 取得 access token
    // const access_token =  localStorage.getItem('jwt');

    // 使用 useEffect Hook
    useEffect(() => {
        console.log('execute function in useEffect');
        fetchCurrentGifts();
        fetchCandidateList();
        fetchFormDetail();
        fetchLotteryResults();
    }, []);  // dependency 

    const fetchCurrentGifts = () =>
    {
        fetch(
            `https://82b059bd-354d-4944-934b-b8fdb2402159.mock.pstmn.io/stuff//GetGift`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊 應該要拿掉
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

    const fetchCandidateList = () =>
    {
        fetch(
            `https://82b059bd-354d-4944-934b-b8fdb2402159.mock.pstmn.io/stuff//GetCandidate`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊
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

    const fetchFormDetail = () =>
    {
        fetch(
            `https://82b059bd-354d-4944-934b-b8fdb2402159.mock.pstmn.io/stuff//GetFormDetail`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊 可拿掉
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



    const fetchLotteryResults = () =>
    {
        fetch(
            `https://82b059bd-354d-4944-934b-b8fdb2402159.mock.pstmn.io/stuff//GetLotteryResults`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,  //驗證使用者資訊
                }
            }
        )
        .then(response => response.json())
        .then(response => {
            console.log('lottery results22',response.data)
            setLotteryResults(response.data['results']);
        })
        .catch(error => console.log(error))  
    };

    // google.charts.load('current', {'packages':['corechart']});
    // google.charts.setOnLoadCallback(drawChart);

    // function drawChart() {

    //   var data = google.visualization.arrayToDataTable([
    //     ['Task', 'Hours per Day'],
    //     ['Work',     11],
    //     ['Eat',      2],
    //     ['Commute',  2],
    //     ['Watch TV', 2],
    //     ['Sleep',    7]
    //   ]);

    //   var options = {
    //     title: 'My Daily Activities'
    //   };

    //   var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    //   chart.draw(data, options);
    // }




    const data = [
        { value: 'JavaScript', count: 38 },
        { value: 'React', count: 30 },
        { value: 'Nodejs', count: 28 },
        { value: 'Express.js', count: 25 },
        { value: 'HTML5', count: 33 },
        { value: 'MongoDB', count: 18 },
        { value: 'CSS3', count: 20 },
      ]
      
    const SimpleCloud = () => (
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={data}
          onClick={tag => alert(`'${tag.value}' was selected!`)}
        />
      )
    
    return (
        <>
            <Navbar/>

            {console.log('render')}
            <section className='lottery-page-container'>
                {/* 問卷左半部抽獎結果 */}
                <section className='lottery-container'>
                    <section className='lottery-results'>
                        <h2> {formDetail.form_title} </h2>
                        {/* <div className='lottery-card'>
                            <h2> 可抽獎人名單：{candidateList.length} 人 </h2>
                            <div className='avator-container'>
                                {candidateList.map( (candidate) => {
                                    return (
                                        <Avator
                                            user_name={candidate.student_id}
                                            user_pic_url={candidate.user_pic_url}
                                        />
                                    )
                                })}
                            </div>
                        </div> */}
                        {/* 禮物與中獎人 */}
                        {/* <LotteryCard results={lotteryResults} /> */}
                        {lotteryResults.map(result => {
                            return (
                                <div className='lottery-card' key={result.gift_name}>
                                    <h2> {result.gift_name}   </h2>
                                    {/* <img className='prize-image' src={result.gift_pic_url} alt=''/> */}
                                    <div>
                                        {console.log('winner', lotteryResults)}
                                        {result['winner'].map( (winner) => {
                                            return(
                                            <div>
                                                <div id="no-border" class="stat-items">{winner.user_pic_url}</div>
                                                <div class="stat-items">{winner.user_student_id}</div>
                                            </div>    
                                            )
                                        })}
                                        <Chart
                                        chartType="PieChart"
                                        data={[
                                            ['Item', 'Numbers'],
                                            ['Item 1', 5000],
                                            ['Item 2', 20000],
                                            ['Item 3', 6000],
                                        ]}
                                        width="100%"
                                        height="400px"
                                        legendToggle
                                        />
                                        <SimpleCloud/>
                                    </div>
                                </div>
                            )
                        })}

                    </section>



                    {/* 問卷右半部基本問卷資訊 */}
                    <section className='form-info'>
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
export { SurveyStatistics }