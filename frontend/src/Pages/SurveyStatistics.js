import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Avator } from './Components/Avator';
import {LotteryCard} from './Components/LotteryCard'
import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { TagCloud } from 'react-tagcloud'
import ReactLoading from "react-loading";


// 傳入想要看的 formID

const SurveyStatistics = (props) => {
    const FORM_ID = props.form_id;
    console.log('----- invoke function component -----');

    const [gifts, setGifts] = useState([]);
    const [candidateList, setCandidateList] = useState([]);
    const [formDetail, setFormDetail] = useState([]);
    let [lotteryResults, setLotteryResults] = useState([]);
    let [csvResults, setcsvResults] = useState([]);
    let chart_title = ['Item', 'Numbers']
    let chart_item = ['Item', 'Numbers']
    // 取得 access token
    // const access_token =  localStorage.getItem('jwt');

    // 使用 useEffect Hook
    useEffect(() => {
        console.log('execute function in useEffect');
        // fetchCurrentGifts();
        // fetchCandidateList();
        // fetchFormDetail();
        fetchLotteryResults();
        fetchcsvResults();
    }, []);  // dependency 

    const fetchLotteryResults = () =>
    {
        fetch(
            `http://127.0.0.1:5000/SurveyManagement/detail?form_id=${encodeURIComponent(FORM_ID)}`,
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
            `http://127.0.0.1:5000/SurveyManagement/downloadResponse?form_id=${encodeURIComponent(FORM_ID)}`,
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


    console.log("csvResults",csvResults)
    console.log("lotteryResults",lotteryResults)

    for (let i = 0; i < lotteryResults.length; i++) {
        var uni_ans_list = []
        var ans_count = []
        if (lotteryResults[i].question_type == "單選題"){
            for (let j = 0; j < lotteryResults[i].replies.length; j++) {
                if (uni_ans_list.includes(lotteryResults[i].replies[j].answer[0])){
                    ans_count[uni_ans_list.indexOf(lotteryResults[i].replies[j].answer[0])] += 1
                }else{
                    uni_ans_list.push(lotteryResults[i].replies[j].answer[0])
                    ans_count[uni_ans_list.indexOf(lotteryResults[i].replies[j].answer[0])] = 1
                }

            } 
            var keyword_list = {}
            for (let k = 0; k < ans_count.length; k++) {
                keyword_list[uni_ans_list[k]] = ans_count[k]
            } 
            lotteryResults[i].keywordCount = [keyword_list]

        }
    }
    // [{是: 4, 無意見: 2}]
    // const data = [
    //     { value: '喜歡', count: 38 },
    //     { value: '喜翻', count: 30 }
    //   ]
    for (let i = 0; i < lotteryResults.length; i++) {
        var keyword_cloud = []
        for (let j = 0; j < Object.keys(lotteryResults[i].keywordCount[0]).length; j++){
            keyword_cloud.push({"value":Object.keys(lotteryResults[i].keywordCount[0])[j],
                                "count":lotteryResults[i].keywordCount[0][Object.keys(lotteryResults[i].keywordCount[0])[j]]})
        }
        lotteryResults[i].keyword_cloud = keyword_cloud
    }

    var csv_index = 0;
    csv_index = csvResults.indexOf(".csv") +6
    csvResults = csvResults.slice(csv_index);
    csvResults = csvResults.toString().replaceAll('-', '.');
    console.log("csvResults",csvResults)

    

    return (
        <>
        <section className='lottery-results card-shadow'>
            <h1> {props.form_title} </h1>
                            <a className='stat_a'

                            href={
                                `data:text/csv;charset=utf-8,%EF%BB%BF`+  `${encodeURI(csvResults)}`
                            }
                            // href={`data:text/csv;charset=utf-8;,${encodeURIComponent(
                            // csvResults
                            // )}`}
                            download={props.form_title + `.csv`}
                        >{`下載檔案`}</a>

  
            {lotteryResults.map(result => {
                if (result.question_type=="簡答題"){
                    return (
                        <div className='lottery-card card-shadow' key={result.question}>
                            <h2> {result.question}   </h2>
                            <div className="prize-tag" >{`${result.question_type}`}</div>
                            <div class="stat_table">    
                                <div class ="stat_scroll">
                                    {result['replies'].map( (replies) => {
                                        return(
                                        <div>
                                            <div class="stat-items">{replies.user}</div>
                                            <div class="stat-items no-border">{replies.answer}</div>
                                        </div> 
                                            )
                                        })}
                                </div>
                                <TagCloud
                                    style={{
                                        fontFamily: 'sans-serif',
                                        fontSize: 10,
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                        padding: 5,
                                        width: '50%',
                                        height: '50%'
                                        }}
                                minSize={30}
                                maxSize={50}
                                tags={result.keyword_cloud}
                                onClick={tag => alert(`'${tag.value}' was selected!`)}
                                />
                            </div>
                        </div>
                    )
                }else{
                return (
                    <div className='lottery-card card-shadow' key={result.question}>
                        
                        <h2> {result.question}   </h2>
                        <div className="prize-tag" >{`${result.question_type}`}</div>



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
                        </div>
                    </div>
                )
            }
            })}
        </section>



        </>
    )
}
export { SurveyStatistics }