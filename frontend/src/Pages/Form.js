import '../css/Lottery.css';
import '../css/Fill-in.css';
import '../css/Form.css';
import callrefresh from '../refresh.js';
import { Footer } from './Components/Footer';
import { Navbar } from './Components/Navbar';
import { Fillin } from './Fill-in';
import { Lottery } from './Lottery';
import { SurveyStatistics } from './SurveyStatistics';
// import { TagList } from './SetTagList';
import React, { useState, useEffect, useCallback } from 'react';
import {useParams} from 'react-router-dom';
import ReactLoading from "react-loading";
import Loading from 'react-loading';
import { Avator } from './Components/Avator';
import { LoginModal } from './Components/LoginModal';
import { useTranslation } from "react-i18next";




const Form = () => {
    const props = useParams();
    const FORM_ID = props.form_id; // 傳入想要看的 formID
    const [gifts, setGifts] = useState([]);
    const [haveGifts, setHaveGifts] = useState(true);
    const [formDetail, setFormDetail] = useState([]);
    const [formStatus, setFormStatus] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [tags, setTags] = useState([])
    const [showTag, setShowTag] = useState('填寫問卷')
    const [isLoading, setIsLoading] = useState(true);
    const [lotteryResults, setLotteryResults] = useState({
        "status":"Open",
        "results":[],
        "isLoading":true,  // 控制是否還在 loading
    });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { t, i18n } = useTranslation();
    


    // 使用 useEffect Hook
    useEffect(() => {

        let abortController = new AbortController();  
        console.log('Form.js: execute function in useEffect');

        // 等問卷資料載入完畢再進入頁面
        const fetchData = async () => {
            try{
                await Promise.all([
                    fetchCurrentGifts(),
                    fetchFormDetail(),
                    fetchFormStatus(),
                ]);
                await fetchIsOwner()
                setIsLoading(false);
                fetchLotteryResults();
            }
            catch(error){
                console.log('Form Page Fetch Error', error)
            }
            if (!(localStorage.getItem('jwt'))){
                await delay(5000);
                alert("請先進行登入");
                setShowLoginModal(true);
                // window.location.href="/"
            }
        }
        fetchData();
        return () => {  
            abortController.abort();  
        }  
    }, []);  // dependency 

    const delay = (s) => {
        return new Promise(resolve => {
          setTimeout(resolve,s); 
        });
      };

    const fetchFormStatus = async () =>
    {
        const response = await fetch(
            `https://be-sdmg4.herokuapp.com/GetFormStatus?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`  
                }
            }
        );
        if(response.status === 401){
            callrefresh();
        }
        else{
            const resJson = await response.json();
            console.log("Form Status?", resJson);
            setFormStatus(resJson.status)
            if(resJson.status === 'Open' && tags.length+2 <= 3){
                setTags((prevState) => ([...prevState, '填寫問卷','抽獎結果']))
                setShowTag('填寫問卷')
            }
            else if (resJson.status !== 'Open' && tags.length+1 <= 3){
                setTags((prevState) => ([...prevState, '抽獎結果']))
                setShowTag('抽獎結果')
            }
        }
    }


    const fetchIsOwner = async () =>
    {
        const response = await fetch(
            `https://be-sdmg4.herokuapp.com/FormOwnerCheck?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`  
                }
            }
        );
        if(response.status === 401){
            callrefresh();
        }
        else{
            const resJson = await response.json();
            console.log("Is owner?", resJson);
            setIsOwner(resJson.form_owner_status)

            if(resJson.form_owner_status === true && tags.length+1 <= 3){
                setTags((prevState) => ([...prevState, '填答結果']))
            }
        }
    };
    
    const fetchCurrentGifts = async () => {
        const response = await fetch(
            `https://be-sdmg4.herokuapp.com/GetGift?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊 應該要拿掉
                }
        });
        if(response.status === 401){
            callrefresh();
        }
        else{
            const responseJson = await response.json();
            setGifts(responseJson.data);
            console.log('Giftsdata',responseJson.data);
            if(responseJson.data.length===0){
                setHaveGifts(false);
            }
        }
    };

    const fetchFormDetail = async () => {
        try {
            const response = await fetch(
                `https://be-sdmg4.herokuapp.com/GetFormDetail?form_id=${encodeURIComponent(FORM_ID)}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${localStorage.getItem('jwt')}`  // 驗證使用者資訊 可拿掉
                    }
                }
            )
            if(response.status === 401){
                callrefresh();
            }
            else{
                const resJson = await response.json();
                console.log('Form Detail',resJson);
                setFormDetail({
                    form_title : resJson.form_title,
                    form_owner_id : resJson.user_student_id,
                    form_owner_pic_url : resJson.user_pic_url,
                    form_create_date : new Intl.DateTimeFormat('zh-TW', {
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date(resJson.form_create_date)),
                    form_end_date : new Intl.DateTimeFormat('zh-TW', {
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date(resJson.form_end_date)),
                    form_draw_date : new Intl.DateTimeFormat('zh-TW', {
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date(resJson.form_draw_date))
                })
            }
        } catch (err){
            console.log('fetch form result error', err);
        }
    };

    const fetchLotteryResults = async () =>
    {
        const response = await fetch(
            `https://be-sdmg4.herokuapp.com/GetLotteryResults?form_id=${encodeURIComponent(FORM_ID)}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('jwt')}`,  //驗證使用者資訊
                }
            }
        )
        if (response.status===401){
            callrefresh();
        } else{
            const resJson = await response.json();
            console.log('Lottery Results',resJson);     
            setLotteryResults({
                "status": resJson['status'],
                "results": resJson.data['results'],
                "isLoading": false,
            })   
        }
    };

    function changePage(showTag){
        if (showTag === "填寫問卷"){
            return <Fillin form_id = {FORM_ID} form_title={formDetail.form_title} />
        }
        else if (showTag === "抽獎結果"){
            return <Lottery form_id = {FORM_ID} lr = {lotteryResults} form_title={formDetail.form_title} isOwner={isOwner}  haveGifts={haveGifts}/> 
        }
        else if (showTag === "填答結果"){
            return <SurveyStatistics form_id = {FORM_ID} form_title={formDetail.form_title} lotteryResults={lotteryResults}/> 
        }
        else{
            return <Lottery form_id = {FORM_ID} lr = {lotteryResults} form_title={formDetail.form_title} haveGifts={haveGifts}/> 
        }
    };

    function show(){
        if(formStatus ==="NotExist"){
            return(
                <> <div className='modalBackground'>
                    <div className="alert-modal">
                        <h2>{t("此問卷不存在")}</h2>
                        <button className="Btn create-account-button" onClick={() => {window.location.href='/'}}>{t("回首頁")}</button>
                    </div>
                </div></>
            )
        }
        else if(formStatus ==="Delete"){
            return(
                <> <div className='modalBackground'>
                    <div className="alert-modal">
                        <h2>{t("此問卷已被作者刪除")}</h2>
                        <button className="Btn create-account-button" onClick={() => {window.location.href='/'}}>{t("回首頁")}</button>
                    </div>
                </div></>
            )
        }
        else {
            return(
                <>
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
                        >{t(item)}</div>
                    )
                })}
                </div>
                <section className='lottery-container'>
                    {/* 問卷左半部 */}
                    {changePage(showTag)}

                    {/* 問卷右半部基本問卷資訊 */}
                    <section className='form-info card-shadow'>
                        <h2> {t("問卷資訊")} </h2>
                        {t("發布時間")}：{formDetail.form_create_date} <br />
                        {t("截止時間")}：{formDetail.form_end_date} <br />
                        {haveGifts && <>{t("抽獎時間")}：{formDetail.form_draw_date}</>}
                        <h2> {t("製作者")} </h2>
                        <Avator user_name={formDetail.form_owner_id}  user_pic_url={formDetail.form_owner_pic_url}/> 
                        {/* 缺製作者的圖片 url */}
                        <h2> {t("獎品")} </h2>
                        {haveGifts===false ? <h3>{t("此問卷沒有抽獎")}</h3> :  
                            gifts.map(gift => {
                                return (
                                    <div className='prize-container' key={gift.gift_name}>
                                        <h3> {gift.gift_name} × {gift.amount} </h3>
                                        <img className='prize-image' src={gift.gift_pic_url} alt=''/>
                                    </div>
                                )
                            })
                        }
                    </section>
                </section>
                </>
            )
        }
    }


    return (
        <>
        <Navbar/>
        { isLoading ? <> <section className='loading-container'> <ReactLoading type="spinningBubbles" color="#432a58" /> <h3> Loading </h3></section> </> :
            <>
            {console.log('render form page')}
            {/* 選擇要填寫問卷、查看抽獎、查看填寫結果 */}
            <section className='lottery-page-container'>
                {showLoginModal && <LoginModal closeModal={setShowLoginModal}/>}
                {show()}
            </section>
            </>
        }
        <Footer />
        </>
    )
}
export { Form }