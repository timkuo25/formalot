import { useState } from "react"

import "../../../css/SurveyManagement.css"
import "./SurveyManagement.css"
import "../../../App.css"
const Item = ({form_id, form_title, form_create_date, form_end_date, form_draw_date, form_pic_url, form_run_state, deleteData}) => {
    
    
    const [modalOpen, setModalOpen] = useState(false);
    function deleteItem(){
        deleteData(function(prev) {
            return prev.filter(item => item.form_id !== form_id)
        })
    }

    const deleteFormAPI = async (e) => {
        e.preventDefault();
        const getprotected = await fetch('https://82b059bd-354d-4944-934b-b8fdb2402159.mock.pstmn.io/stuff/',{
            method: 'PUT',
            body: JSON.stringify({
                form_id: form_id,
                action: "delete"

            }),
        });
        
        console.log([form_id,"delete"]);
        alert([form_id,"delete"]);
    }; 

    const closeFormAPI = async (e) => {
        e.preventDefault();
        const getprotected = await fetch('https://82b059bd-354d-4944-934b-b8fdb2402159.mock.pstmn.io/stuff/',{
            method: 'PUT',
            body: JSON.stringify({
                form_id: form_id,
                action: "close"

            }),
            
        });

        console.log([form_id,"close"]);
        alert([form_id,"close"]);
    };
   


    return (

            <div className="card-container ">
                <div className="card">
                    <div className="tag-container">
                        <div class="dropdown">
                                <button class="prize-tag-management">選項</button>
                                    <div class="dropdown-content">
                                        <button className="forget_submit" onClick={closeFormAPI}>關閉問卷</button>
                                        <button className="forget_submit" onClick={closeFormAPI}>刪除問卷</button>
                                    </div>
                        </div>                        
                        <button className="prize-tag-management">{`${form_run_state}`}</button>

                    </div>
                    
                    <img alt="" className="q-image" src={form_pic_url} width="260" height="300" />
                    <h3 className="overflow-text">{form_title}</h3>
                    <p>
                        {`截止時間：${form_end_date}`} <br/>
                        {`抽獎時間：${form_draw_date}`}
                    </p>
                    <div className="tag-container">
                    <button className='share-q'> <img className='share-image' src={process.env.PUBLIC_URL + 'share.png'} alt="分享"/></button>
                        {/* <button onClick={deleteItem} className="share-q-management">刪除</button> */}
                    </div>
                    <div className="tag-container"></div>
                </div>
            </div>
            
        
        )
        
}



Item.defaultProps = {
    form_create_date: "Fri, 01 Apr 2022 23:59:59 GMT",
    form_draw_date: "Sat, 30 Apr 2022 23:59:59 GMT",
    form_end_date: "Thu, 28 Apr 2022 23:59:59 GMT",
    form_id: 15,
    form_pic_url: "https://imgur.com/gallery/3Nnlo",
    form_run_state: "Open",
    form_title: "2022【醫美認知與消費意願之研究】調查表問卷"
}

export default Item

