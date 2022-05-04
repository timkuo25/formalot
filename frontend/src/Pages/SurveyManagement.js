import '../css/SurveyManagement.css'
import { useState, useEffect } from "react"
import { Navbar } from "./Components/Navbar"
import React from "react"
import Edit from "./Components/survey_management_comp/Edit"
import List from "./Components/survey_management_comp/List"
import { Footer } from "./Components/Footer"
// import Item from "./components/Item"
import './Components/survey_management_comp/SurveyManagement.css'


async function fetchData(setData) {
    const res = await fetch(`http://127.0.0.1:5000/SurveyManagement`)
    const data = await res.json()
    console.log(data)
    setData(data)
}



const SurveyManagement = () => {

    const [data, setData] = useState([]);


    useEffect( () => {
        fetchData(setData)
    }, []);



    let createdData = data["created"]
    let repliedData = data["replied"]
    console.log(createdData)

    
    // console.log("data",data);

    return(

    <div className="app">
        
        <Navbar />
        {/* <Edit add={setData}/> */}
        
        {/* <h1>State:</h1>
        <h1>{JSON.stringify(data, null, 2) }</h1> */}
                <section className='survey-bar'>
                    <div className='survey-container'>
                        <h2 className='manage-header'>問卷管理</h2>
                        <div className='survey-card'>
                            <h3 className='manage-header'>&#10004;  已填寫問卷</h3>
                                <div className='card-container-management'>
                                    <List listData={createdData} />
                                </div>
                        </div>
                        <div className='survey-card'>
                            <h3 className='manage-header'>&#10004;  已發佈問卷</h3>
                                <div className='card-container-management'>
                                    <List listData={repliedData} />
                                </div>
                        </div>
                        <div className='survey-manage-buttons'>
                            <button className='form-button'> 填答問卷</button>
                            <button className='form-button'> 製作問卷</button>
                        </div>
                    </div> 

                </section>  
        <Footer /> 

        
    </div>

    )
}


export default SurveyManagement