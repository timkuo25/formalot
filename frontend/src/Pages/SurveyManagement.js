import "../css/SurveyManagement.css";
import { useState, useEffect } from "react";
import { Card } from './Components/Card';
import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import callrefresh from '../refresh.js';
import React from "react";
import ReactLoading from "react-loading";



const SurveyManagement = () => {
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
          `http://127.0.0.1:5000/SurveyManagement`,
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
  return (
    <>
      <Navbar />
      <section className="survey-bar">
        <div className="survey-container">
          <h2 className="manage-header">問卷管理</h2>
          <div className="survey-card card-shadow">
            <h3 className="manage-header">&#10004; 已填寫問卷</h3>
            <div className="card-container-management ">
              {repliedData.isLoading ==1 ? <> <div className="loading-container"> <ReactLoading type="spinningBubbles" color="#432a58" /> </div></> : 
                  repliedData.data.map( (form) => {
                      return (
                          <Card type={'replied'} info={form} />
                      )
                  })
              }
            </div>
          </div>
          <div className="survey-card card-shadow">
            <h3 className="manage-header">&#10004; 已發佈問卷</h3>
            <div className="card-container-management ">
              {createdData.isLoading==1 ? <> <div className="loading-container"> <ReactLoading type="spinningBubbles" color="#432a58" /> </div></> : 
                createdData.data.map( (form) => {
                    return (
                        <Card type={'created'} info={form} />
                    )
                })
              }

            </div>
          </div>
          <div className="survey-manage-buttons">
            <button className="form-button"> 填答問卷</button>
            <button className="form-button"> 製作問卷</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SurveyManagement;
