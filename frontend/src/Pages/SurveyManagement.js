import { useState, useEffect } from "react"
import { Navbar } from "./Components/Navbar"
import React from "react"
import Edit from "./Components/survey_management_comp/Edit"
import ListCreater from "./Components/survey_management_comp/ListCreater"
import ListFormer from "./Components/survey_management_comp/ListFormer"

// import Item from "./components/Item"
import './Components/survey_management_comp/SurveyManagement.css'


async function fetchData(setData) {
    const res = await fetch(`https://82b059bd-354d-4944-934b-b8fdb2402159.mock.pstmn.io/stuff/`)
    const data = await res.json()
    console.log(data)
    setData(data)
}



const SurveyManagement = () => {

    const [data, setData] = useState([]);

    useEffect( () => {
        fetchData(setData)
    }, []);

    
    // console.log("data",data);
    return(

    <div className="app">
        


        <Navbar />
        <Edit add={setData}/>
        
        <h1>State:</h1>
        <h1>{JSON.stringify(data, null, 2) }</h1>
                <section className='survey-bar'>
                    <div className='survey-container'>
                        <h2 className='manage-header'>問卷管理</h2>
                        <div className='survey-card'>
                            <h3 className='manage-header'>&#10004;  已填寫問卷</h3>
                                <div className='card-container-management'>
                                    <ListFormer listData={data} deleteData={setData}/>
                                </div>
                        </div>
                        <div className='survey-card'>
                            <h3 className='manage-header'>&#10004;  已發佈問卷</h3>
                                <div className='card-container-management'>
                                    <ListCreater listData={data} deleteData={setData}/>
                                </div>
                        </div>
                        <div className='survey-manage-buttons'>
                            <button class='form-button'> 填答問卷</button>
                            <button class='form-button'> 製作問卷</button>
                        </div>
                    </div> 

                </section>   

        
    </div>

    )
}

export default SurveyManagement