import '../css/MakeSurvey.css';
import { Navbar } from './Components/Navbar';
import React from 'react';
import { useState } from "react";
import { useEffect } from "react";



const MakeSurvey = () =>{
    //const [myTasks, moveMyTask] = useState(props.tasks);
    //const [storedElements, setStoredElements] = useState([]);
    const [surveyQDict, setSurveyQDict] = useState([]);
    const [surveyTitle, setSurveyTitle] = useState("")
    const [SurveyDescription, setSurveyDescription] = useState("")
    const [rerenderkey, setrerenderkey] = useState(0)



    useEffect(() => {

        if (!(localStorage.getItem('jwt'))){
            alert("你沒登入，請先登入")
            window.location.href="/"
        }
        let form = window.sessionStorage.getItem('form')
        if (form){
            form = JSON.parse(form)
            setSurveyTitle(form.form_title)
            setSurveyDescription(form.form_description)
            setSurveyQDict(form.questioncontent);
        }
    }, []);
    useEffect(() => {
        let form={
            form_title:surveyTitle,
            form_description:SurveyDescription,
            questioncontent:surveyQDict
        }

        window.sessionStorage.setItem('form', JSON.stringify(form));
    }, [surveyQDict, surveyTitle, SurveyDescription]);
    
    //const [storedChoice, setStoredChoice] = useState([]);
 
    const deleteOption = evt =>{
        /*
        delete question id's option (get by id)
        */
        let id = evt.target.id
        let idArr = id.split(",")
        let index = Number(idArr[0])
        let optionArrIndex = Number(idArr[1])
        let tempArr = surveyQDict
        tempArr[index].Options.splice(optionArrIndex, 1)
        //console.log(tempArr)
        
        setSurveyQDict((surveyQDict)=>{
            setSurveyQDict(tempArr)
            setrerenderkey(rerenderkey+1)
            return surveyQDict
        })
        
    }

    const deleteQuestion = event =>{
        /*
        delete question div (get by id)
        */
        //console.log(storedElements)
        let index = Number(event.target.id)
        setSurveyQDict((surveyQDict)=>{//試了很多方法都行不通...有夠難寫
            setSurveyQDict(surveyQDict.filter(items=>items.id !== index));

            return surveyQDict
        })

    }
    


    const addChoice = evt =>{
        /*
        add question id's option
        */
        let index = Number(evt.target.id)
        let tempArr = surveyQDict
        let optionArr = tempArr[index].Options     
        tempArr[index].Options=optionArr.concat('選項'+(Number(optionArr.length)+1))
        console.log(tempArr)

        

        setSurveyQDict((surveyQDict)=>{ //為了解決每次都沒辦法get到最新set的value
            setSurveyQDict(tempArr)
            setrerenderkey(rerenderkey+1)
            return surveyQDict
        })
    }


    const handleChangeChoice = evt=>{
        /*
        change option content (get by id)
        */

        let id = evt.target.id
        let idArr = id.split(",")
        let index = Number(idArr[0])
        let optionArrIndex = Number(idArr[1])
        let tempArr = surveyQDict
        tempArr[index].Options[optionArrIndex] = evt.target.value
        //console.log(tempArr)
        
        setSurveyQDict((surveyQDict)=>{
            setSurveyQDict(tempArr)
            return surveyQDict
        })
        


    }


    const renderShortAns = event =>{
        /*
        add question(shortAns)
        */

        console.log('----')
        console.log(surveyQDict.length)

        const msg = {
            id:surveyQDict.length,
            Question:"Question",
            Type: '簡答題',
            Options:[]
        };
        setSurveyQDict(surveyQDict=>surveyQDict.concat(msg))
        //setStoredElements(storedElements=>storedElements.concat(<ShortAns key={storedElements.length} />)); //將區塊加入list中

        //console.log(surveyQDict)

    }

    const renderSingleChoice = event =>{
        /*
        add question(singleChoice)
        */
        const msg = {
            id:surveyQDict.length,
            Question:"Question",
            Type: '單選題',
            Options:['選項 1', '選項 2']
        };
        setSurveyQDict(surveyQDict.concat(msg))
        //setStoredElements(storedElements=>storedElements.concat(<SingleChoice key={storedElements.length} />)); //將區塊加入list中
    }

    const renderMultipleChoice = event =>{
        /*
        add question(multipleChoice)
        */
        const msg = {
            id:surveyQDict.length,
            Question:"Question",
            Type: '複選題',
            Options:['選項 1', '選項 2']
        };
        setSurveyQDict(surveyQDict.concat(msg))
        //setStoredElements(storedElements=>storedElements.concat(<SingleChoice key={storedElements.length} />)); //將區塊加入list中
    }

    const renderDropDown = event =>{
        /*
        add question(singleChoice)
        */
        const msg = {
            id:surveyQDict.length,
            Question:"Question",
            Type: '下拉式選單',
            Options:['選項 1', '選項 2']
        };
        setSurveyQDict(surveyQDict.concat(msg))
        //setStoredElements(storedElements=>storedElements.concat(<SingleChoice key={storedElements.length} />)); //將區塊加入list中
    }





    const handleChangeQuestion = evt =>{
        /*
        change question content(get by id)
        */
        console.log(evt.target.id)
        let id = Number(evt.target.id)
        let tempArr = surveyQDict
        tempArr[id].Question=evt.target.value
        setSurveyQDict((surveyQDict)=>{ //為了解決每次都沒辦法get到最新set的value
            
            setSurveyQDict(tempArr)
            return surveyQDict
        })


    }
    const cancel =()=>{
        
        
        window.sessionStorage.removeItem('form_info'); 
        window.sessionStorage.removeItem('form'); 
        //event.preventDefault();
        window.location.href = "/";//暫時用jS去寫換頁
      }
    


    
    const handleSubmit = event =>{
        /*
        submit to the next page
        */
        
        let form={
            form_title:surveyTitle,
            form_description:SurveyDescription,
            questioncontent:surveyQDict
        }
        console.log(form)
        

        event.preventDefault();
        window.sessionStorage.setItem('form', JSON.stringify(form));
        window.location.href = '/MakeSurvey2';//暫時用jS去寫換頁

    }

    const handleChangeTitle = (evt)=>{
        console.log(evt.target.value)
        setSurveyTitle(evt.target.value)


    }
    const handleChangeDescription = (evt)=>{
        setSurveyDescription(evt.target.value)

    }



    return (

        <>
        <Navbar/>
        {/*react dnd*/}
        <section className='page-container' key={rerenderkey}>
                <div className='breadcrumb'>
                    <button className='SurveyOptionBtn card-shadow' onClick={cancel}>
                        取消
                    </button>
                    <button className='makeSurveypageBtn card-shadow'>
                        製作問卷
                    </button>
                    <button className='SurveyOptionBtn card-shadow' onClick={handleSubmit}>
                        填寫資訊
                    </button>
                </div>
            <section className='makeSurvey-container'>
        
                <section className='makeSurvey-results card-shadow'>
            
                    <div className='makeSurvey-card'>
                        <h3>問卷標題</h3>
                        <p>
                           <input type="text" maxLength="100" placeholder="標題*" className='input-columns' style={{width: "100%"}} defaultValue={surveyTitle} onChange={handleChangeTitle}/>
                        </p>
                        <p>
                            {/*<input type="text" placeholder="問卷描述" className='input-columns' style={{width: "100%", height:"90px"}} defaultValue={SurveyDescription} onChange={handleChangeDescription}/>*/}
                            <textarea maxLength="500" placeholder="問卷描述" className='input-columns' style={{width: "100%", height:"90px", resize:'vertical'}} defaultValue={SurveyDescription} onChange={handleChangeDescription}></textarea>
                        </p>
    
                    </div>
                    {surveyQDict.map((item, index) => {
                        return (
                        <>
                            <div className='makeSurvey-card' key={index}>
                                <button id={item.id} className="titleCloseBtn" style={{background:"#fbfafc"}} onClick={deleteQuestion}>X</button>
                                <h4>{item.Type}</h4>
                                <p>
                                    <input id = {item.id} type="text" placeholder={item.Question} className='input-columns' style={{width: "100%", height:"50px"}} onChange={handleChangeQuestion}/>
                                </p>
                                    {item.Options.map((opt, i) =>{
                                        return (
                                            <>
                                                <p>
                                                    <input key={[item.id,i]} id={[item.id, i]} type="text" className='input-columns' placeholder={opt} style={{width: "80%", height:"80px"}} onChange={handleChangeChoice}/>
                                                    <button id={[item.id, i]} className={'Btn NextBtn'} onClick={deleteOption} disabled={i>1? 0:1}>刪除</button>
                                                </p>

                                            </>
                                        );
                                    })}
                                    <p>
                                    </p>
                                    {item.Options.length > 0 ? <button id = {item.id} className={'Btn SurveyOptionBtn card-shadow'} onClick={addChoice}>新增選項</button>: null }
                            </div>
                        </>
                        );
                    })}
                    


                    
                    
    
                </section>  
                
                <section className='makeSurvey-info'>

                    <div className='makeSurvey-card sticky-div card-shadow'>
                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' onClick = {renderShortAns}>
                            簡答
                            </button>
                        </p>

                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' onClick={renderSingleChoice}>
                            單選題
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' onClick={renderMultipleChoice}>
                            複選題
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' onClick={renderDropDown}>
                            下拉式選單
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' disabled={1}>
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
