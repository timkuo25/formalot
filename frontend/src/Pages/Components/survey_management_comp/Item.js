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
        const getprotected = await fetch('http://127.0.0.1:5000/SurveyManagement',{
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
        const getprotected = await fetch('http://127.0.0.1:5000/SurveyManagement',{
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

            <div className="card-container-management ">
                <div className="card-management">
                    <div className="tag-container">
                        
                        <div class="dropdown">
                            <button class="prize-tag-management">選項</button>
                                <div class="dropdown-content">
                                    <button className="forget_submit" onClick={closeFormAPI}>關閉問卷</button>
                                    <button className="forget_submit" onClick={closeFormAPI}>刪除問卷</button>
                                </div>
                        </div>
                        <div className="prize-tag-management">{`${form_run_state}`}</div>

                    </div>
                    
                    <img alt=""  src={form_pic_url} width="260" height="280" />
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
    form_create_date: "",
    form_draw_date: "",
    form_end_date: "",
    form_id: 15,
    form_pic_url: "",
    form_run_state: "",
    form_title: ""
}

export default Item

