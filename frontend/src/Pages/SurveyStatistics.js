import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { TagCloud } from 'react-tagcloud'
import callrefresh from '../refresh.js';
import { composeInitialProps, useTranslation } from "react-i18next";


const SurveyStatistics = (props) => {
    const FORM_ID = props.form_id;
    let [answerResults, setanswerResults] = useState([]);
    let [csvResults, setcsvResults] = useState([]);
    let chart_title = ['Item', 'Numbers']
    let chart_item = ['Item', 'Numbers']
    const { t, i18n } = useTranslation();
    // 取得 access token
    // const access_token =  localStorage.getItem('jwt');

    // 使用 useEffect Hook
    useEffect(() => {
        console.log('Statistics.js: execute function in useEffect');
        let abortController = new AbortController();  
        const fetchData = async () => {
            try{
                await Promise.all([
                    fetchAnswerResults(),
                    fetchcsvResults(),
                ])
            }
            catch(error){
                console.log('Statistics page fetch error', error)
            }
        }
        fetchData();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 

    const fetchAnswerResults = async () =>
    {
        const response = await fetch(
            `https://be-sdmg4.herokuapp.com/SurveyManagement/detail?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,  //驗證使用者資訊
                }
            }
        )
        if(response.status === 401){
            callrefresh("refresh")
        }
        else{
            const resJson = await response.json()
            console.log('Answer Results',resJson)
            setanswerResults(resJson.data);
        }
    };

    const fetchcsvResults = async () =>
    {
        const response = await fetch(
            `https://be-sdmg4.herokuapp.com/SurveyManagement/downloadResponse?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,  //驗證使用者資訊
                }
            }
        )
        if(response.status === 401){
            callrefresh("refresh")
        }
        else{
            const resJson = await response.text()
            console.log('Csv results',resJson)
            setcsvResults(resJson);
        }
    };

    for (let i = 0; i < answerResults.length; i++) {
        var uni_ans_list = []
        var ans_count = []
        if (answerResults[i].question_type != "簡答題"){
            for (let j = 0; j < answerResults[i].replies.length; j++) {
                for (let k = 0; k < answerResults[i].replies[j].answer.length; k++){
                    if (uni_ans_list.includes(answerResults[i].replies[j].answer[k])){
                        console.log("answerResults[i].replies[j].answer"+i+j+k,answerResults[i].replies[j].answer[k])
                        console.log("uni_ans_list",uni_ans_list)
                        console.log("ans_count",ans_count)
                        ans_count[uni_ans_list.indexOf(answerResults[i].replies[j].answer[k])] += 1
                    }else{
                        uni_ans_list.push(answerResults[i].replies[j].answer[k])
                        ans_count[uni_ans_list.indexOf(answerResults[i].replies[j].answer[k])] = 1
                    }
                }

            } 
            var keyword_list = {}
            for (let k = 0; k < ans_count.length; k++) {
                keyword_list[uni_ans_list[k]] = ans_count[k]
            } 
            answerResults[i].keywordCount = [keyword_list]

        }
    }

    
    console.log("answerResults",answerResults)
    for (let i = 0; i < answerResults.length; i++) {
        var keyword_cloud = []
        for (let j = 0; j < Object.keys(answerResults[i].keywordCount[0]).length; j++){
            keyword_cloud.push({"value":Object.keys(answerResults[i].keywordCount[0])[j],
                                "count":answerResults[i].keywordCount[0][Object.keys(answerResults[i].keywordCount[0])[j]]})
        }
        answerResults[i].keyword_cloud = keyword_cloud
    }

    var csv_index = 0;
    csv_index = csvResults.indexOf(".csv") +6
    csvResults = csvResults.slice(csv_index);
    csvResults = csvResults.toString().replaceAll('-', '.');
    

    return (
        <>
        <section className='lottery-results card-shadow'>
            <h1> {props.form_title} </h1>
                            <a className='stat_a'

                            href={
                                `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURI(csvResults)}`
                            }
                            // href={`data:text/csv;charset=utf-8;,${encodeURIComponent(
                            // csvResults
                            // )}`}
                            download={props.form_title + `.csv`}
                        >{t("下載檔案")}</a>

  
            {answerResults.map(result => {
                if (result.question_type==="簡答題"){
                    return (
                        <div className='lottery-card card-shadow' key={result.question}>
                            <h2> {result.question}   </h2>
                            <div className="prize-tag" >{t(result.question_type)}</div>
                            <div className="stat_table">    
                                <div className ="stat_scroll">
                                    {result['replies'].map( (replies) => {
                                        return(
                                        <div>
                                            <div className="stat-items">{replies.user}</div>
                                            <div className="stat-items no-border">{replies.answer}</div>
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
                        <div className="prize-tag" >{t(result.question_type)}</div>



                        <div>
                            {console.log('replies', answerResults)}                              
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