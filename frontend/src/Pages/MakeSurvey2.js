import '../css/MakeSurvey.css';
import { Navbar } from './Components/Navbar';
import {ButtonGroup} from "./Components/ButtonGroup";
import { Footer } from './Components/Footer';
import React, {useState, useRef, useEffect} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import ReactLoading from "react-loading";
import moment from 'moment';
import callrefresh from '../refresh.js';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import { FaLastfmSquare } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';



//import { DndProvider } from "react-dnd";
//import { HTML5Backend } from 'react-dnd-html5-backend';
//import {SurveyBoard} from './Components/SurveyBoard';





const MakeSurvey2 = () => {
    //const [myTasks, moveMyTask] = useState(props.tasks);
  
    const [DateForFormEnd, setDateForFormEnd] = useState(new Date());
    const [DateForLottery, setDateForLottery] = useState(new Date());
    const [displayBtnOrNot, setDisplayBtnOrNot] = useState("否");
    const [giftNum, setGiftNum] = useState(0);
    const [imgurURL, setImgurURL] = useState("");
    const [giftType, setGiftType] = useState("無抽獎活動");
    const [formType, setFormType] = useState("商業及管理學門");
    const [gift_info, setGiftInfo] = useState([])
    const [rerenderkey, setrerenderkey] = useState(0)
    const [loading, setload] = useState(false)
    const [formImageLoading, setFormImageLoading] = useState(false)
    const inputFormFile = useRef(null) 
    const [openAlert, setOpenAlert] = useState(false);
    const [errorMessage, setErrorMsg] = useState("");
    const [gid, setgid]=useState(0)
    const { t, i18n } = useTranslation();


    useEffect(() => {

      if (!(localStorage.getItem('jwt'))){
        alert("你沒登入，請先登入")
        window.location.href="/"
      }

      let form_info = window.sessionStorage.getItem('form_info')

      if (form_info){
        form_info = JSON.parse(form_info)
        setDateForFormEnd(new Date(form_info.form_end_date))
        setDateForLottery(new Date(form_info.form_draw_date))
        setGiftNum(form_info.giftNum)
        setGiftInfo(form_info.gift_info)
        setImgurURL(form_info.imgurURL)
        setFormType(form_info.form_field_type)
        setDisplayBtnOrNot(form_info.displayBtnOrNot)
        setGiftType(form_info.form_gift_type)
        setgid(form_info.gid)

      }
      setrerenderkey(r=>r+1)
    }, []);

    useEffect(() => {
      let form_info={
        form_end_date:DateForFormEnd,
        form_draw_date:DateForLottery,
        giftNum:giftNum,
        form_gift_type:giftType,
        form_field_type:formType,
        displayBtnOrNot:displayBtnOrNot,
        gift_info:gift_info,
        imgurURL:imgurURL,
        gid:gid

      }
      window.sessionStorage.setItem('form_info', JSON.stringify(form_info));
  }, [DateForFormEnd, DateForLottery, displayBtnOrNot, giftNum, giftType, formType, gift_info, imgurURL, gid]);


    const displayBtn = (event) => {
      if (event.target.name === '是'){
        setDisplayBtnOrNot("是")
        if (giftNum===0){
          setGiftNum(1);
          let gift={
            id:gid,
            gift_name:"",
            gift_pic_url:"https://i.imgur.com/sKBuD6v.png",
            quantity:1
          }
          setGiftInfo((gift_info.concat(gift)));
          setgid(g=>g+1)
        }
      }
      else{
        setDisplayBtnOrNot("否");
        setGiftType("無抽獎活動");
        setGiftNum(0);
        setGiftInfo([]);
        setgid(0)
      }

    };

    const addGift =()=>{
      console.log(gid)
      let gift={
        id:gid,
        gift_name:"",
        gift_pic_url:"https://i.imgur.com/sKBuD6v.png",
        quantity:1
      }
      setGiftInfo((gift_info.concat(gift)));
      setgid(g=>g+1)
    }


    const DisplayGiftBtn = ()=>{
      return(
        <div>
          <button className='add-giftBtn Btn' onClick={addGift}>+{t("新增獎品")}</button>
        </div>
    
      );
    }

    const giftTypeBtn = event =>{
      setGiftType(event.target.name)
      setrerenderkey(rerenderkey+1)
    }

    const formTypeBtn = evt =>{
      setFormType(evt.target.name)
      setrerenderkey(rerenderkey+1)
      console.log(evt.target.name)
    }

    const DisplayGiftTypeBtn = ()=>{
      return(
        
        <div className='lottery-card card-shadow'>
        <h3>{t("抽獎獎品類別？")}</h3>
          <div className='BtnGroupContainer'>
            <ButtonGroup buttons={["飲料類", "食物類", "兌換卷類", "服裝飾品類", "3C類", "美妝保養類", "圖書類", "日用品類", "運動戶外類", "現金類"]} btnFunc={giftTypeBtn} defaultvalue={giftType}/>
          </div>
        </div>
    
      );
    }


    const onImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        setFormImageLoading(true)
        //console.log(event.target.files[0])
        let img = event.target.files[0];
        console.log(img)
        console.log(URL.createObjectURL(img))
        

        const formdata = new FormData() 
        formdata.append("image", img)

        fetch('https://api.imgur.com/3/image/', {
          method:"POST",
          headers:{
            Authorization: "Client-ID 5535a8facba4790"
          },
          body: formdata
        }).then(data => data.json())
        .then(data => {
          //我們要的imgur網址
          setFormImageLoading(false)
          let imgururl = data.data.link
          if (imgururl===undefined){
            alert("上傳圖片失敗")
          }
          else{
            console.log(imgururl)

            setImgurURL(imgururl)
            setrerenderkey(rerenderkey+1)

          }
        })
        
      }
    };

    const back =()=>{
        
      let form_info={
        form_end_date:DateForFormEnd,
        form_draw_date:DateForLottery,
        giftNum:giftNum,
        form_gift_type:giftType,
        form_field_type:formType,
        displayBtnOrNot:displayBtnOrNot,
        gift_info:gift_info,
        imgurURL:imgurURL,
        gid:gid

      }
      window.sessionStorage.setItem('form_info', JSON.stringify(form_info));
      
      //event.preventDefault();
      window.location.href = "/MakeSurvey";//暫時用jS去寫換頁
    }
    const cancel =()=>{
        
        
      window.sessionStorage.removeItem('form_info'); 
      window.sessionStorage.removeItem('form'); 
      //event.preventDefault();
      window.location.href = "/";//暫時用jS去寫換頁
    }

    

    const handleSubmit = async()=>{

      setOpenAlert(false)
      setload(true)
      var errorMsg = ""
      var legalsubmit=1
      let surveycontent = window.sessionStorage.getItem('form')
      surveycontent = JSON.parse(surveycontent)

      var dateForEndbeforeProcess = DateForFormEnd.getTime()
      let dateEnd = new Date(dateForEndbeforeProcess);
      let dataValuesEnd = [
        dateEnd.getFullYear(),
        dateEnd.getMonth() + 1,
        dateEnd.getDate(),
        dateEnd.getHours(),
        dateEnd.getMinutes(),
        dateEnd.getSeconds(),
        ];

      let detected_end = Number(dataValuesEnd[3]) - 8 
      let detected_day_end = Number(dataValuesEnd[2])
      if(detected_end < 0) {
        detected_end = detected_end + 24
        detected_day_end = detected_day_end - 1
      }  
      let dateForEnd  = dataValuesEnd[0]+'-'+dataValuesEnd[1]+'-'+String(detected_day_end)+' '+ String(detected_end) +":"+ dataValuesEnd[4]+":"+dataValuesEnd[5]
      console.log(dateForEnd)



      let dateForlotbeforeProcess = DateForLottery.getTime()
      let dateForlot = new Date(dateForlotbeforeProcess);
      let dataValueslot = [
          dateForlot.getFullYear(),
          dateForlot.getMonth() + 1,
          dateForlot.getDate(),
          dateForlot.getHours(),
          dateForlot.getMinutes(),
          dateForlot.getSeconds(),
        ];
      let detected = Number(dataValueslot[3]) - 8 
      let detected_day = Number(dataValueslot[2])
      if(detected < 0) {
        detected = detected + 24
        detected_day = detected_day - 1
      }
      var dateForlottory  = dataValueslot[0]+'-'+dataValueslot[1]+'-'+String(detected_day)+' ' + String(detected) + ":"+ dataValueslot[4]+":"+dataValueslot[5]

      let qArr = surveycontent.questioncontent
      let qoptArr = []
      for(let i=0; i<qArr.length;i++){
        qoptArr = []
        if(qArr[i].Type!=='簡答題'){
          for(let j=0;j<qArr[i].Options.length;j++){
              qoptArr = qoptArr.concat(qArr[i].Options[j].opt)
          }
        }
        qArr[i].Options = qoptArr
      }

      let surveyData = {
        form_title: surveycontent.form_title,
        form_description: surveycontent.form_description,
        questioncontent: qArr,
        form_end_date: dateForEnd,
        form_draw_date: dateForlottory,
        form_pic_url: imgurURL,
        form_gift_type: giftType,
        form_field_type: formType,
        gift_info:gift_info
      }

      //做合法性判斷
      if(dateForEndbeforeProcess<=Date.now()){
        console.log("flag 0")
        legalsubmit=0
        errorMsg = "問卷截止時間不得早於現在的時間"
      }
      if(displayBtnOrNot==="是")
      {
        console.log("flag 1")
        if(giftType==="無抽獎活動"){
          console.log("flag 2")
          legalsubmit=0
          errorMsg = "抽獎獎品類別未選擇"
        }
        if (dateForEndbeforeProcess>dateForlotbeforeProcess)
        {
          console.log("flag 7")
          legalsubmit=0
          errorMsg = "問卷截止日不得晚於問卷抽獎日"
        }
        if(dateForlotbeforeProcess<=Date.now()){
          legalsubmit=0
          errorMsg = "問卷抽獎時間不得早於現在的時間"
        }
        for(let i=0; i<surveyData.gift_info.length;i++){
          if(surveyData.gift_info[i].gift_name===""){
            console.log("flag 3")
            legalsubmit=0
            errorMsg = "禮物名稱不得為空"
          }
          if(!Number.isInteger(surveyData.gift_info[i].quantity) || surveyData.gift_info[i].quantity<=0){
            console.log("flag 3")
            legalsubmit=0
            errorMsg = "禮物數量請填入正整數"
          }
        }
      }
      else{
        console.log("flag 4")
        surveyData.form_draw_date=null
      }

      if(surveyData.form_title===""){
        console.log("flag 5")
        legalsubmit=0
        errorMsg = "問卷標題未填寫"
      }
      if(surveyData.questioncontent.length===0){
        console.log("flag 6")
        legalsubmit=0
        errorMsg = "問卷題目未製作"
      }
      else{
        for(let i=0; i<surveyData.questioncontent.length;i++){
          if(surveyData.questioncontent[i].Question===""){
            console.log("flag 7")
            legalsubmit=0
            errorMsg = "問卷題目不得為空"
          }
        }
      }



  
      console.log(surveyData)
      console.log("---------")
      console.log(legalsubmit)
      
      if(legalsubmit===1)
      {
        
        const result =  await fetch("https://be-sdmg4.herokuapp.com/SurveyManagement/new", {
          method: "POST",
          headers:{
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
        },
          body: JSON.stringify(surveyData),
        });
        console.log(result);
        setload(false)
        
        if (result.status===200){
  
          window.sessionStorage.removeItem('form_info'); 
          window.sessionStorage.removeItem('form'); 
          alert("問卷製作成功")
          window.location.href = "/SurveyManagement";
        }
        else if(result.status===401){

          callrefresh();
          alert("再試一次喔")
        }
        else{
          alert("問卷製作失敗，請稍候再試一次")
        }
      }
      else{
        
        setErrorMsg(errorMsg)
        setload(false)
        setOpenAlert(true);
      }
      //
    }

    const changeGiftName = evt =>{
      /*
      change question content(get by id)
      */
      console.log(evt.target.id)
      let index = Number(evt.target.id)
      let tempArr = gift_info
      for(let i=0; i<tempArr.length;i++){
        if (tempArr[i].id===index){
          tempArr[i].gift_name=evt.target.value
        }
      }
      
      setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
          
        setGiftInfo(tempArr)
          return gift_info
      })


  }
  const deleteGiftImage = evt =>{
    console.log(evt.target.id)

    let index = Number(evt.target.id)
    let tempArr = gift_info

    for(let i=0; i<tempArr.length;i++){
      if (tempArr[i].id===index){
        tempArr[i].gift_pic_url="https://i.imgur.com/sKBuD6v.png"
      }
    }

    setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
      setGiftInfo(tempArr)
      setrerenderkey(rerenderkey+1)
      return gift_info
    })

  }

  const changeGiftquantity = evt =>{
    /*
    change question content(get by id)
    */
    console.log(evt.target.id)
    let index = Number(evt.target.id)
    let tempArr = gift_info

    for(let i=0; i<tempArr.length;i++){
      if (tempArr[i].id===index){
          tempArr[i].quantity=Number(evt.target.value)
      }
    }

    setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
        
      setGiftInfo(tempArr)
        return gift_info
    })

  }
  
  const changeGiftURL = event =>{
    /*

    */
    console.log(event.target.id)


    if (event.target.files && event.target.files[0]) {

  
      //console.log(event.target.files[0])
      let img = event.target.files[0];
      console.log(img)
      console.log(URL.createObjectURL(img))
      

      const formdata = new FormData() 
      formdata.append("image", img)

      fetch('https://api.imgur.com/3/image/', {
        method:"POST",
        headers:{
          Authorization: "Client-ID 5535a8facba4790"
        },
        body: formdata
      }).then(data => data.json())
      .then(data => {
        //我們要的imgur網址
  

        let imgururl = data.data.link
        if (imgururl===undefined){
          alert("上傳圖片失敗")
        }
        else{
          
          console.log(imgururl)
          let index = Number(event.target.id)
          let tempArr = gift_info
          console.log(tempArr)

          for(let i=0; i<tempArr.length;i++){
            if(tempArr[i].id===index){
              tempArr[i].gift_pic_url=imgururl
            }
          }

          setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
            setGiftInfo(tempArr)
            setrerenderkey(r=>r+1)
            return gift_info
          })

        }
      })

    }
}



const deleteGift =evt=>{

  let index = Number(evt.target.id)

  setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
    setGiftInfo(gift_info.filter(items=>items.id !== index));
    setrerenderkey(r=>r+1)
    return gift_info
})


  
}

    return (
        <>
        <Navbar/>
        {/*react dnd*/}
          <Box sx={{ width: '100%' }}>
            <Collapse in={openAlert}>
              <Alert
              severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenAlert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
              <AlertTitle>{t("問卷製作失敗，請再試一次")}</AlertTitle>
                {t(errorMessage)}
              </Alert>
            </Collapse>

        </Box>
        <section className='page-container'>
          <div className='breadcrumb-container'>
            <div className='breadcrumb'>
                    <button className='SurveyOptionBtn card-shadow' onClick={cancel}>
                        {t("取消")}
                    </button>
                    <button className='SurveyOptionBtn card-shadow' onClick={back}>
                      {t("製作問卷")}
                    </button>
                    <button className='SurveyOptionBtn card-shadow btn-clicked' >
                      {t("填寫資訊")}
                    </button>
                    <button className='SurveyOptionBtn card-shadow' onClick={handleSubmit}>
                      {t("發布問卷")}
                    </button>
              </div>
              {loading ?   <ReactLoading type="spinningBubbles" color="#432a58" /> :null}
          </div>
          <section className='makeSurvey-container'>
              <section className='makeSurvey-info card-shadow'>
                    <h3 style={{textAlign: "center"}}>{t("截止與抽獎時間")}</h3>
                    <h4>{t("問卷截止時間")}</h4>

                    {/*<p>
                      <DateTimePicker2 value={DateForFormEnd} minDate={moment().toDate()} onChange={(date) => setDateForFormEnd(date)} format={"y-MM-dd h:mm:ss a"} className='input-columns'/>
                    </p>*/}

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          renderInput={(props) => <TextField {...props} />}

                          value={DateForFormEnd}
                          onChange={(newValue) => {
                            setDateForFormEnd(newValue);
                            console.log(newValue);
                          }}
                          minDateTime={moment().toDate()}
                        />
                    </LocalizationProvider>

                    {displayBtnOrNot==="是" ?  
                        <>
                        <h4>{t("抽獎時間")}</h4>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          renderInput={(props) => <TextField {...props} />}
                          value={DateForLottery}
                          onChange={(newValue) => {
                            setDateForLottery(newValue);
                            console.log(newValue);
                          }}
                          minDateTime={moment().toDate()}
                        />
                    </LocalizationProvider>
                          </>  : null}



                    {/*displayBtnOrNot==="是" ?  <><h4>{t("抽獎時間")}</h4><p><DateTimePicker value={DateForLottery} minDate={moment().toDate()}
                           onChange={(date) => setDateForLottery(date)} format={"y-MM-dd h:mm:ss a"} className='input-columns' style={{  height: '100%', width: '100%', border: '0px'}}/></p></>  : null*/}
                    <h4>{t("問卷縮圖圖片")}</h4>
                    <div>
                    {formImageLoading ?   <div className='card-container'><ReactLoading type="spinningBubbles" color="#432a58" /></div>:imgurURL==="" ? 
                                            <img src={"https://i.imgur.com/sKBuD6v.png"} style={{  height: '100%', width: '100%', border: '0px'}} className='input-columns' alt="form"/> : 
                                                      <img src={imgurURL} className='input-columns form-thumbnail' alt="form"/>}
                      </div>
                      <br></br>
                      <div>
                      <input className='Btn SurveyOptionBtn' ref={inputFormFile} type="file" name="myImage" onChange={onImageChange} accept="image/png, image/jpeg" style={{display:'none'}}/>
                      <button className='Btn SurveyOptionBtn card-shadow' onClick={()=>inputFormFile.current.click()}>
                        {t("選擇圖片")}
                      </button>


                  
                      
                  </div>
                  
                  
              </section>  
              
              <section className='makeSurvey-results card-shadow' key={rerenderkey}>

                  <div className='lottery-card card-shadow'>
                    <h3>{t("問卷類別")}</h3>
                      <div className='BtnGroupContainer'>
                        <ButtonGroup buttons={["商業及管理學門", "教育學門", "工程學門", "社會及行為科學學門", "民生學門", "人文學門", "電算機學門", "法律學門", "藝術學門", "社會服務學門", "傳播學門", "醫藥衛生學門", "設計學門", "建築及都市規劃學門", "農業科學學門", "運輸服務學門", "自然科學學門", "數學及統計學門", "生命科學學門", "環境保護學門", "軍警國防安全學門", "其他學門", "獸醫學門"]} btnFunc={formTypeBtn} defaultvalue={formType}/>
                      </div>
                    </div>
                  
                    <div className='lottery-card card-shadow'>
                      <h3>{t("是否有抽獎？")}</h3>
                      <div className='BtnGroupContainer'>
                        <ButtonGroup buttons={["是", "否"]} btnFunc={displayBtn} defaultvalue={displayBtnOrNot}/>
                      </div>
                      
                    </div>

                    {displayBtnOrNot==="是"? DisplayGiftTypeBtn() : null}
                    {gift_info.map((item, index) =>{
                        return (
                          <>
                              <div className='lottery-card card-shadow'>
                              {index !== 0 ? <button id={item.id} className="titleCloseBtn" style={{background:"#fbfafc"}} onClick={deleteGift}>X</button> : null}
                              
                                <h3>{t("輸入獎品資訊")}</h3>
                                  <p>
                                      <input id={item.id} maxLength="45" type="text" placeholder={t("獎品名稱")}  className='input-columns' defaultValue={item.gift_name}  onChange={changeGiftName}/>
                                  </p>
                                  <p>
                                      <input id={item.id} type="text" pattern="[0-9]*" placeholder={t("獎品數量")}  className='input-columns' defaultValue={item.quantity}  onChange={changeGiftquantity}/>
                                  </p>
                                  <p>
                                      {/*<input id={item.id} type="text" placeholder="獎品圖片url網址"  className='input-columns' defaultValue={item.gift_pic_url}  onChange={changeGiftURL}/>*/}
                                      {item.gift_pic_url==='https://i.imgur.com/sKBuD6v.png'? null:<button id={item.id} className={'Btn NextBtn'} onClick={deleteGiftImage}> ✕ </button>}
                                      <img id={item.id} src={item.gift_pic_url} className='input-columns gift-thumbnail' alt="gift"/>
                                      <br/>

                                      <input id={item.id}  type="file" name="myImage" accept="image/png, image/jpeg" onChange={changeGiftURL} />
                                  </p>

                                </div>
                          </>

                        );
                        })}
                    {displayBtnOrNot==="是" ? <DisplayGiftBtn/>  : null}
              </section>
            </section>

        </section>
        <Footer />
        </>
    );
  }

export { MakeSurvey2 };