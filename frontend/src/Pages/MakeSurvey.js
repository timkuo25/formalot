import '../css/MakeSurvey.css';
import { Navbar } from './Components/Navbar';
import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from 'react-bootstrap';
import { Footer } from './Components/Footer';




const MakeSurvey = () =>{
    //const [myTasks, moveMyTask] = useState(props.tasks);
    //const [storedElements, setStoredElements] = useState([]);
    const [surveyQDict, setSurveyQDict] = useState([]);
    const [surveyTitle, setSurveyTitle] = useState("")
    const [SurveyDescription, setSurveyDescription] = useState("")
    const [rerenderkey, setrerenderkey] = useState(0)
    const [qid, setqid] = useState(0)
    const [optid, setoptid] = useState(1000)
    const { t, i18n } = useTranslation();


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
            setqid(form.qid)
            setoptid(form.optid)
        }
    }, []);
    useEffect(() => {
        let form={
            form_title:surveyTitle,
            form_description:SurveyDescription,
            questioncontent:surveyQDict,
            qid:qid,
            optid:optid
        }

        window.sessionStorage.setItem('form', JSON.stringify(form));
    }, [surveyQDict, surveyTitle, SurveyDescription,qid,optid]);
    
    //const [storedChoice, setStoredChoice] = useState([]);
 


    const deleteQuestion = event =>{
        /*
        delete question div (get by id)
        */
        //console.log(storedElements)
        let index = Number(event.target.id)
        console.log(index)
        console.log(surveyQDict)

        
        setSurveyQDict((surveyQDict)=>{ //為了解決每次都沒辦法get到最新set的value
            setSurveyQDict(surveyQDict.filter(items=>items.id !== index));
            console.log(surveyQDict)
            setrerenderkey(r=>r+1)
            return surveyQDict
        })
        


    }
    
    const deleteOption = evt =>{
        /*
        delete question id's option (get by id)
        */
        let id = evt.target.id
        let idArr = id.split(",")
        let index = Number(idArr[0])
        let optionArrIndex = Number(idArr[1])
        let tempArr = surveyQDict

        for(let i=0; i<tempArr.length;i++){
            if(tempArr[i].id===index){
                //tempArr[i].Options[optionArrIndex] = evt.target.value
                let tempopt = tempArr[i].Options.filter(item=>item.optid !== optionArrIndex)
                tempArr[i].Options=tempopt
            }
        }
        //tempArr[index].Options.splice(optionArrIndex, 1)
        //console.log(tempArr)
        
        setSurveyQDict((surveyQDict)=>{
            setSurveyQDict(tempArr)
            setrerenderkey(r=>r+1)
            return surveyQDict
        })
        
    }

    const addChoice = evt =>{//OK
        /*
        add question id's option
        */
        let index = Number(evt.target.id)
        let tempArr = surveyQDict

        for(let i=0; i<tempArr.length;i++){
            if(tempArr[i].id===index){
                let optionArr = tempArr[i].Options  
                let tempdic={
                    optid:optid,
                    opt:'選項'
                }
                tempArr[i].Options=optionArr.concat(tempdic)
            }
        }



        //let optionArr = tempArr[index].Options     
        //tempArr[index].Options=optionArr.concat('選項'+(Number(optionArr.length)+1))
        console.log(tempArr)
        setoptid(o=>o+1)
    
        setSurveyQDict((surveyQDict)=>{ //為了解決每次都沒辦法get到最新set的value
            setSurveyQDict(tempArr)
            setrerenderkey(r=>r+1)
            return surveyQDict
        })
    }


    const handleChangeChoice = evt=>{//OK
        /*
        change option content (get by id)
        */
       console.log(evt.target.id)
       console.log(evt.target.value)

        let id = evt.target.id
        let idArr = id.split(",")
        let index = Number(idArr[0])
        let optionArrIndex = Number(idArr[1])
        let tempArr = surveyQDict

        for(let i=0; i<tempArr.length;i++){
            if(tempArr[i].id===index){

                //tempArr[i].Options[optionArrIndex] = evt.target.value
                for(let j=0;j<tempArr[i].Options.length;j++){
                    if(tempArr[i].Options[j].optid===optionArrIndex){
                        tempArr[i].Options[j].opt=evt.target.value

                    }
                }
                break;
            }
        }


        //tempArr[index].Options[optionArrIndex] = evt.target.value
        //console.log(tempArr)
        
        setSurveyQDict((surveyQDict)=>{
            setSurveyQDict(tempArr)
            console.log(tempArr)
            return surveyQDict
        })
        


    }


    const renderShortAns = event =>{
        /*
        add question(shortAns)
        */

        console.log('----')
        console.log(qid)

        const msg = {
            id:qid,
            Question:"",
            Type: '簡答題',
            Options:[]
        };
        setSurveyQDict(surveyQDict=>surveyQDict.concat(msg))
        setqid(q=>q+1)
        //setStoredElements(storedElements=>storedElements.concat(<ShortAns key={storedElements.length} />)); //將區塊加入list中

        //console.log(surveyQDict)

    }

    const renderSingleChoice = event =>{
        /*
        add question(singleChoice)
        */
        const msg = {
            id:qid,
            Question:"",
            Type: '單選題',
            Options:[{
                optid:optid,
                opt:'選項'
            },
            {
                optid:optid+1,
                opt:'選項'
            }]
        };
        setSurveyQDict(surveyQDict.concat(msg))
        setqid(q=>q+1)
        setoptid(o=>o+2)
        //setStoredElements(storedElements=>storedElements.concat(<SingleChoice key={storedElements.length} />)); //將區塊加入list中
    }

    const renderMultipleChoice = event =>{
        /*
        add question(multipleChoice)
        */
        const msg = {
            id:qid,
            Question:"",
            Type: '複選題',
            Options:[{
                optid:optid,
                opt:'選項'
            },
            {
                optid:optid+1,
                opt:'選項'
            }]
        };
        setSurveyQDict(surveyQDict.concat(msg))
        setqid(q=>q+1)
        setoptid(o=>o+2)
        //setStoredElements(storedElements=>storedElements.concat(<SingleChoice key={storedElements.length} />)); //將區塊加入list中
    }

    const renderDropDown = event =>{
        /*
        add question(singleChoice)
        */
        const msg = {
            id:qid,
            Question:"",
            Type: '下拉式選單',
            Options:['選項 1', '選項 2']
        };
        setSurveyQDict(surveyQDict.concat(msg))
        setqid(q=>q+1)
        //setStoredElements(storedElements=>storedElements.concat(<SingleChoice key={storedElements.length} />)); //將區塊加入list中
    }





    const handleChangeQuestion = evt =>{
        /*
        change question content(get by id)
        */
        console.log(evt.target.id)
        let index = Number(evt.target.id)

        let tempArr = surveyQDict
        for(let i=0; i<tempArr.length;i++){
            if(tempArr[i].id===index){
                tempArr[i].Question = evt.target.value
            }
        }
        
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
            questioncontent:surveyQDict,
            qid:qid,
            optid:optid
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
            <div className='breadcrumb-container'>
                <div className='breadcrumb'>
                    <button className='SurveyOptionBtn card-shadow' onClick={cancel}>
                        {t("取消")}
                    </button>
                    <button className='SurveyOptionBtn card-shadow btn-clicked'>
                        {t("製作問卷")}
                    </button>
                    <button className='SurveyOptionBtn card-shadow' onClick={handleSubmit}>
                        {t("填寫資訊")}
                    </button>
                </div>
            </div>
            <section className='makeSurvey-container'>
        
                <section className='makeSurvey-questions card-shadow'>
            
                    <div className='makeSurvey-card'>

                        <h3>{t("問卷標題")}</h3>
                        <p>
                           <input type="text" maxLength="100" placeholder={t("問卷標題")} className='input-columns' style={{width: "100%"}} defaultValue={surveyTitle} onChange={handleChangeTitle}/>
                        </p>
                        <p>
                            {/*<input type="text" placeholder="問卷描述" className='input-columns' style={{width: "100%", height:"90px"}} defaultValue={SurveyDescription} onChange={handleChangeDescription}/>*/}
                            <textarea maxLength="500" placeholder={t("問卷描述")} className='input-columns' style={{width: "100%", height:"90px", resize:'vertical'}} defaultValue={SurveyDescription} onChange={handleChangeDescription}></textarea>
                        </p>
    
                    </div>
                    {surveyQDict.map((item, index) => {
                        return (
                        <>
                            <div className='makeSurvey-card' key={index}>
                                <button id={item.id} className="titleCloseBtn" style={{background:"#fbfafc"}} onClick={deleteQuestion}>X</button>
                                <h4>{t(item.Type)}</h4>
                                <p>
                                    <input id = {item.id} type="text" placeholder={item.Question===""? "Question":item.Question} className='input-columns' style={{width: "100%", height:"50px"}} defaultValue={item.Question} onChange={handleChangeQuestion}/>
                                </p>
                                    {item.Options.map((opt, i) =>{
                                        return (
                                            <>
                                                <p>
                                                    <input key={[item.id, opt.optid]} id={[item.id, opt.optid]} type="text" className='input-columns' placeholder={t(opt.opt)} style={{width: "80%", height:"80px"}} defaultValue={t(opt.opt)} onChange={handleChangeChoice}/>
                                                    { i>1 ? <button id={[item.id, opt.optid]} className={'Btn NextBtn'} onClick={deleteOption}>{t("刪除")}</button>:null}
                                                </p>

                                            </>
                                        );
                                    })}
                                    <p>
                                    </p>
                                    {item.Options.length > 0 ? <button id = {item.id} className={'Btn SurveyOptionBtn card-shadow'} onClick={addChoice}>{t("新增選項")}</button>: null }
                            </div>
                        </>
                        );
                    })}
                    


                    
                    
    
                </section>  
                
                {/* <section className='makeSurvey-qustion-types'> */}

                    <div className='makeSurvey-questiontype-box card-shadow'>
                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' onClick = {renderShortAns}>
                            {t("簡答題")}
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' onClick={renderSingleChoice}>
                            {t("單選題")}
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' onClick={renderMultipleChoice}>
                            {t("複選題")}
                            </button>
                        </p>
                        <p>
                            <button className='Btn SurveyDescriptionBtn card-shadow' disabled={1}>
                            {t("下拉式選單")}
                            </button>
                        </p>

                    </div>
                {/* </section> */}
                
            </section>

        </section>
        <Footer />
        </>
    )

}

export { MakeSurvey };
