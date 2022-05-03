import '../css/MakeSurvey.css';
import { Navbar } from './Components/Navbar';
import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";




const MakeSurvey = () =>{
    //const [myTasks, moveMyTask] = useState(props.tasks);
    const [storedElements, setStoredElements] = useState([]);
    const [surveyQDict, setSurveyQDict] = useState([]);

    const ShortAns = () =>{
        return (
            <div className='makeSurvey-card'>
                <h4>簡答</h4>
                <p>
                    <input id = {storedElements.length}  type="text" placeholder="Question" style={{width: "100%", height:"50px"}} onChange={handleChange}/>
                </p>
                <p>
                    <input type="text" placeholder="Answer" disabled = {1} style={{width: "80%", height:"80px"}}/>
                </p>
            </div>
        );
    };


    const renderShortAns = event =>{
        setStoredElements(storedElements.concat(<ShortAns key={storedElements.length} />)); //將區塊加入list中
        setSurveyQDict(surveyQDict.concat(
            {
                Question:"",
                Qtype: '簡答',
                option:[]
            }
        ))
    }

    const handleChange = event =>{
        const value = event.target.id;
        console.log(value)
        var surveyDictTemp = surveyQDict.slice()
        var item = surveyQDict[value];
        item.Question = event.target.value;
        surveyDictTemp[value] = item;
        setSurveyQDict({
            surveyQDict:surveyDictTemp
        });
    }





    /*handleChange(evt) {
        const value = evt.target.id;
        console.log(value)
        var surveyDictTemp = this.state.surveyDict.slice()
        var item = this.state.surveyDict[value];
        item.Question = evt.target.value;
        surveyDictTemp[value] = item;
        this.setState({
            surveyDict:surveyDictTemp
        });
        //console.log(this.state.surveyDict)
      }*/
    
    const handleSubmit = event =>{
        console.log(this.state.surveyDict)
        event.preventDefault();
    }





    

    return (

        <>
        <Navbar/>
        {/*react dnd*/}
        <section className='page-container'>
                    <div className='breadcrumb'>
                    <h3>製作問卷 > 填寫抽獎資訊 > 發布問卷 </h3>
                </div>
            <section className='makeSurvey-container'>
        
                <section className='makeSurvey-results'>
                    <form onSubmit={handleSubmit}>
                    <div className='makeSurvey-card'>
                        <h3>表單標題</h3>
                        <p>
                            <input type="text" placeholder="問卷題目" style={{width: "100%", height:"50px"}} defaultValue="Untitled"/>
                        </p>
                        <p>
                            <input type="text" placeholder="問卷描述" style={{width: "100%", height:"30px"}}/>
                        </p>
    
                    </div>
                    {storedElements}
                        <input className='Btn NextBtn' type='submit' value="下一步"/>
                    
                        </form> 

                    
                    
    
                </section>  
                
                <section className='makeSurvey-info'>

                    <div className='makeSurvey-card sticky-div'>
                        <p>
                            <button className='Btn SurveyDescriptionBtn' onClick = {renderShortAns}>
                            簡答
                            </button>
                        </p>

                        <p>
                            <button className='Btn SurveyOptionBtn'>
                            單選題
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyOptionBtn'>
                            多選題
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyOptionBtn'>
                            下拉式選單
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyOptionBtn'>
                            線性量表問題
                            </button>
                        </p>
                    </div>
                </section>
                
            </section>

        </section>
        </>
    )

}

export { MakeSurvey };
