import "../css/SurveyManagement.css";
import { useState, useEffect } from "react";
import { Card } from './Components/Card';
import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
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
    fetchFormData();
    return () => {  
        abortController.abort();  
    }  
  }, []);  
  const fetchFormData = () =>
  {
      fetch(
          `http://127.0.0.1:5000/SurveyManagement`,
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
        console.log('allData', response)
        console.log('createdData',response[0].created)
        console.log('repliedData',response[0].replied)
        setCreatedData({
          "data":response[0].created,
          "isLoading":0
        })
        setRepliedData({
          "data":response[0].replied,
          "isLoading":0
        })
      })
      .catch(error => console.log(error))  
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
                          <Card info={form} />
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
                        <Card info={form} />
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
