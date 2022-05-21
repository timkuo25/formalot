import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Avator } from './Components/Avator';
import {LotteryCard} from './Components/LotteryCard'
import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { TagCloud } from 'react-tagcloud'
import { WordCloud } from "wordcloud"
import swal from 'sweetalert'
import { saveAs } from 'file-saver';


// 傳入想要看的 formID
const FORM_SEARCH = {id:1};

const SurveyStatistics = () => {

    console.log('----- invoke function component -----');

    const [gifts, setGifts] = useState([]);
    const [candidateList, setCandidateList] = useState([]);
    const [formDetail, setFormDetail] = useState([]);
    const [lotteryResults, setLotteryResults] = useState([]);
    let [csvResults, setcsvResults] = useState([]);
    let chart_title = ['Item', 'Numbers']
    let chart_item = ['Item', 'Numbers']
    // 取得 access token
    // const access_token =  localStorage.getItem('jwt');

    // 使用 useEffect Hook
    useEffect(() => {
        console.log('execute function in useEffect');
        fetchCurrentGifts();
        fetchCandidateList();
        fetchFormDetail();
        fetchLotteryResults();
        fetchcsvResults();
    }, []);  // dependency 

    const fetchCurrentGifts = () =>
    {
        fetch(
            `http://127.0.0.1:5000/GetGift?form_id=1`,
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
            ` http://127.0.0.1:5000/GetCandidate?form_id=1`,
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
            ` http://127.0.0.1:5000/GetFormDetail?form_id=1`,
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
            `http://127.0.0.1:5000/SurveyManagement/detail?form_id=1`,
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
            console.log('lottery results',response.data)
            setLotteryResults(response.data);
        })
        .catch(error => console.log(error))
    };

    const fetchcsvResults = () =>
    {
        fetch(
            `http://127.0.0.1:5000/SurveyManagement/downloadResponse?form_id=1`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,  //驗證使用者資訊
                }
            }
        )
        .then(response => response.text())
        .then(response => {
            console.log('csv results',response)
            setcsvResults(response);
        })
        .catch(error => console.log(error))
    };

    // var el = document.getElementById("1");
    // if(el){
    //   el.addEventListener("click",function(){
    //     swal("Good job!", "You clicked the button!", "success");
    // }); 
    // }
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
        { value: '喜歡', count: 38 },
        { value: '喜翻', count: 30 }
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
                        {console.log("csvResults",csvResults)}
                        <a  
                            href={
                                `data:text/csv;charset=utf-8,%EF%BB%BF`+  `${encodeURI(csvResults)}`
                            }
                            // href={`data:text/csv;charset=utf-8;,${encodeURIComponent(
                            // csvResults
                            // )}`}




                            download={formDetail.form_title + `.csv`}
                        >
                            {`Download Json`}
                        </a>
                        {console.log("csvResults_3",`data:text/csv;charset=utf-8;,${encodeURIComponent(
                            csvResults
                            )}`)}

                       
                        {lotteryResults.map(result => {
                            return (
                                <div className='lottery-card' key={result.question}>
                                    
                                    <h2> {result.question}   </h2>
                                    <div className="prize-tag-stat" >{`${result.question_type}`}</div>



                                    <div>
                                        {console.log('replies', lotteryResults)}                              
                                        {console.log('result.keywordCount', chart_item =  Object.entries(result.keywordCount[0])) }
                                        {console.log('result.keywordCount', chart_item.unshift(chart_title)) }

                                        {/* dont delete */}
                                        <Chart
                                        chartType="PieChart"
                                        data={chart_item}
                                        width="100%"
                                        height="400px"
                                        legendToggle
                                        />
                                        <TagCloud
                                        minSize={12}
                                        maxSize={35}
                                        tags={data}
                                        onClick={tag => alert(`'${tag.value}' was selected!`)}
                                        />
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
                                <div className='prize-container' key={gift.question}>
                                    <h3> {gift.question} × {gift.amount} </h3>
                                    <img className='prize-image' src={gift.gift_pic_url} alt=''/>
                                </div>
                            )
                        })}

                    </section>
                </section>
                <div className='form-buttons'>
                    <button class='form-button'> 填答結果</button>
                    <button class='form-button'> 瀏覽問卷</button>.
                    {/* <button class='form-button' onClick={fetchCurrentGifts}> 重新整理</button> */}
                </div>
            </section>

        </>
    )
}
export { SurveyStatistics }