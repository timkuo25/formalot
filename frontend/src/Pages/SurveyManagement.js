import "../css/SurveyManagement.css";
import { useState, useEffect } from "react";
import { Card } from './Components/Card';
import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import callrefresh from '../refresh.js';
import React from "react";
import ReactLoading from "react-loading";
import { useTranslation } from "react-i18next";

const SurveyManagement = () => {
  const { t, i18n } = useTranslation();
  const [createdData, setCreatedData] = useState(
    {
      "data":[],
      "isLoading":1
    }
  );
  const [repliedData, setRepliedData] = useState(
    {
      "data":[],
      "isLoading":1
    }
  );
  const [showTag, setShowTag] = useState('已填寫問卷')
  const tags = ['已填寫問卷','已發布問卷']


  // 使用 useEffect Hook
  useEffect(() => {
    console.log('execute function in useEffect');
    let abortController = new AbortController();  
    const fetchData = async () => {
      try{
        if (!(localStorage.getItem('jwt'))){
          alert("請先登入才能管理問卷喔。")
          window.location.href="/"
        }
        else{
          await Promise.all([fetchFormData()]);
        }
      }
      catch(e){
        console.log('error', e)
      }
    }
    fetchData();
    return () => {  
        abortController.abort();  
    }  
  }, []);  
  const fetchFormData = async () =>
  {
      const res = await fetch(
          `https://be-sdmg4.herokuapp.com/SurveyManagement`,
          {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊
              }
          }
      );
      const response = await res.json();
      if(response.msg==='Token has expired'){
        callrefresh("reload");
      }
      else{
        console.log('allData', response);
        setCreatedData({
          "data":response[0].created,
          "isLoading":0
        })
        setRepliedData({
          "data":response[0].replied,
          "isLoading":0
        })
      }
  };

  function showPage(){
    if(showTag === '已填寫問卷'){
      return(
        <div className="survey-card">
        {/* <h2 className="manage-header">&#10004; 已填寫問卷</h2> */}
        <div className="card-container-management ">
          {repliedData.isLoading === 1 ? <> <div className="loading-container"> <ReactLoading type="spinningBubbles" color="#432a58" /> </div></> : 
              repliedData.data.map( (form) => {
                  return (
                      <Card type={'replied'} info={form} />
                  )
              })
          }
        </div>
      </div>
      )
    }
    else if(showTag === '已發布問卷'){
      return(
        <div className="survey-card">
        {/* <h2 className="manage-header">&#10004; 已發佈問卷</h2> */}
        <div className="card-container-management ">
          {createdData.isLoading === 1 ? <> <div className="loading-container"> <ReactLoading type="spinningBubbles" color="#432a58" /> </div></> : 
            createdData.data.map( (form) => {
                return (
                    <Card type={'created'} info={form} />
                )
            })
          }

        </div>
      </div>
      )
    }
  }
  return (
    <>
      <Navbar />
      <section className="survey-management-page">
        <div className="survey-container">
          <h1 className="manage-header">問卷管理</h1>
          <div className='page-navbar'>
                {tags.map(item => {
                    return (
                        <div
                            className='page-navbar-item card-shadow'
                            key={item}
                            style={item === showTag ? {backgroundColor: 'rgba(77, 14, 179, 0.15)'} : {}}
                            onClick={e => {
                                setShowTag(item);
                            }}
                        >{item}</div>
                    )
                })}
          </div>


          {showPage()}
          <div className="survey-manage-buttons">
            <button className="form-button" onClick={() => {window.location.href='/explore'}}> {t("探索問卷")}</button>
            <button className="form-button" onClick={() => {window.location.href='/MakeSurvey'}}> {t("製作問卷")}</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SurveyManagement;
