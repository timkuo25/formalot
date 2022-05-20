import '../css/MakeSurvey.css';
import { Navbar } from './Components/Navbar';
import {ButtonGroup} from "./Components/ButtonGroup";
import React, {Component, useState, useRef, useEffect} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateTimePicker from 'react-datetime-picker';
import ReactLoading from "react-loading";
import moment from 'moment';
import {axios} from 'axios';

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



    useEffect(() => {

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

      }
      setrerenderkey(rerenderkey+1)
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
        imgurURL:imgurURL

      }
      window.sessionStorage.setItem('form_info', JSON.stringify(form_info));
  }, [DateForFormEnd, DateForLottery, displayBtnOrNot, giftNum, giftType, formType, gift_info, imgurURL]);


    const displayBtn = (event) => {
      if (event.target.name === '是'){
        setDisplayBtnOrNot("是")
        if (giftNum===0){
          setGiftNum(1);
          let gift={
            id:gift_info.length,
            gift_name:"",
            gift_pic_url:"https://i.imgur.com/sKBuD6v.png",
            quantity:1
          }
          setGiftInfo((gift_info.concat(gift)));
        }
      }
      else{
        setDisplayBtnOrNot("否");
        setGiftType("無抽獎活動");
        setGiftNum(0);
        setGiftInfo([]);
      }

    };

    const addGift =()=>{
      let gift={
        id:gift_info.length,
        gift_name:"",
        gift_pic_url:"https://i.imgur.com/sKBuD6v.png",
        quantity:1
      }
      setGiftInfo((gift_info.concat(gift)));

    }


    const DisplayGiftBtn = ()=>{
      return(
        <div>
          <button className='add-giftBtn Btn' onClick={addGift}>新增禮物</button>
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
        
        <div className='makeSurvey-card'>
        <h4>抽獎獎品類別？</h4>
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
        imgurURL:imgurURL

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
      let dateForEnd  = dataValuesEnd[0]+'-'+dataValuesEnd[1]+'-'+dataValuesEnd[2]+' '+dataValuesEnd[3]+":"+ dataValuesEnd[4]+":"+dataValuesEnd[5]
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
      var dateForlottory  = dataValueslot[0]+'-'+dataValueslot[1]+'-'+dataValueslot[2]+' '+dataValueslot[3]+":"+ dataValueslot[4]+":"+dataValueslot[5]

      let surveyData = {
        form_title: surveycontent.form_title,
        form_description: surveycontent.form_description,
        questioncontent: surveycontent.questioncontent,
        form_end_date: dateForEnd,
        form_draw_date: dateForlottory,
        form_pic_url: imgurURL,
        form_gift_type: giftType,
        form_field_type: formType,
        gift_info:gift_info
      }

      //做合法性判斷
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
        errorMsg = "問卷問題未製作"
      }


  
      console.log(surveyData)
      console.log("---------")
      console.log(legalsubmit)
      
      if(legalsubmit===1)
      {
        
        const result =  await fetch("http://127.0.0.1:5000/SurveyManagement/new", {
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
          window.location.href = "/";
        }
        else{

          alert("問卷製作失敗，請稍候再試一次")
          
        }
      }
      else{
        alert(errorMsg)
        setload(false)
      }
      //
    }

    const changeGiftName = evt =>{
      /*
      change question content(get by id)
      */
      console.log(evt.target.id)
      let id = Number(evt.target.id)
      let tempArr = gift_info
      tempArr[id].gift_name=evt.target.value
      setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
          
        setGiftInfo(tempArr)
          return gift_info
      })


  }
  const deleteGiftImage = evt =>{
    console.log(evt.target.id)

    let id = Number(evt.target.id)
    let tempArr = gift_info
    tempArr[id].gift_pic_url="https://i.imgur.com/sKBuD6v.png"
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
    let id = Number(evt.target.id)
    let tempArr = gift_info
    tempArr[id].quantity=Number(evt.target.value)
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
          let id = Number(event.target.id)
          let tempArr = gift_info
          tempArr[id].gift_pic_url=imgururl
          setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
            setGiftInfo(tempArr)
            setrerenderkey(rerenderkey+1)
            return gift_info
          })

        }
      })

    }
}



const deleteGift =evt=>{

  let index = Number(evt.target.id)
  setGiftInfo((gift_info)=>{//試了很多方法都行不通...有夠難寫
    setGiftInfo(gift_info.filter(items=>items.id !== index));

      return gift_info
  })

  
}

    return (
        <>
        <Navbar/>
        {/*react dnd*/}
        <section className='page-container'>
          <div className='breadcrumb'>
                    <button className='Btn SurveyOptionBtn card-shadow' onClick={cancel}>
                        取消
                    </button>
                    <button className='Btn SurveyOptionBtn card-shadow' onClick={back}>
                        製作問卷
                    </button>
                    <button className='Btn SurveyOptionBtn card-shadow' >
                        填寫資訊
                    </button>
                    <button className='Btn SurveyOptionBtn card-shadow' onClick={handleSubmit}>
                        發布問卷
                    </button>
                    {loading ?   <div className='card-container'><ReactLoading type="spinningBubbles" color="#432a58" /></div>:null}


          </div>
          <section className='makeSurvey-container'>
              <section className='makeSurvey-info'>
                  <div className='makeSurvey-card card-shadow'>
                    <h3 style={{textAlign: "center"}}>截止與抽獎時間</h3>
                    <h4>問卷截止時間</h4>
                    <p>
                    <DateTimePicker value={DateForFormEnd} minDate={moment().toDate()} onChange={(date) => setDateForFormEnd(date)}   format={"y-MM-dd h:mm:ss a"} className='input-columns' />
                    </p>

                    {displayBtnOrNot==="是" ?  <><h4>抽獎時間</h4><p><DateTimePicker value={DateForLottery} minDate={moment().toDate()} onChange={(date) => setDateForLottery(date)} format={"y-MM-dd h:mm:ss a"} className='input-columns'/></p></>  : null}
                    <h4>問卷縮圖圖片</h4>
                    <div>
                    {formImageLoading ?   <div className='card-container'><ReactLoading type="spinningBubbles" color="#432a58" /></div>:imgurURL==="" ? <img src={"https://i.imgur.com/sKBuD6v.png"} style={{  height: '300px', width: '400px', border: '0px'}} className='input-columns'/>:<img src={imgurURL} style={{  height: '300px', width: '400px', border: '0px'}} className='input-columns'/>}
                      </div>
                      <br></br>
                      <div>
                      <input className='Btn SurveyOptionBtn' ref={inputFormFile} type="file" name="myImage" onChange={onImageChange} accept="image/png, image/jpeg" style={{display:'none'}}/>
                      <button className='Btn SurveyOptionBtn card-shadow' onClick={()=>inputFormFile.current.click()}>
                        選擇圖片
                      </button>

                    </div>

                  
                      
                  </div>
                  
                  
              </section>  
              
              <section className='makeSurvey-results ' key={rerenderkey}>

                  <div className='makeSurvey-card card-shadow'>
                  <div className='makeSurvey-card'>
                    <h4>問卷類別</h4>
                      <div className='BtnGroupContainer'>
                        <ButtonGroup buttons={["商業及管理學門", "教育學門", "工程學門", "社會及行為科學學門", "民生學門", "人文學門", "電算機學門", "法律學門", "藝術學門", "社會服務學門", "傳播學門", "醫藥衛生學門", "設計學門", "建築及都市規劃學門", "農業科學學門", "運輸服務學門", "自然科學學門", "數學及統計學門", "生命科學學門", "環境保護學門", "軍警國防安全學門", "其他學門", "獸醫學門"]} btnFunc={formTypeBtn} defaultvalue={formType}/>
                      </div>
                    </div>
                  
                    <div className='makeSurvey-card'>
                      <h4>是否有抽獎？</h4>
                      <div className='BtnGroupContainer'>
                        <ButtonGroup buttons={["是", "否"]} btnFunc={displayBtn} defaultvalue={displayBtnOrNot}/>
                      </div>
                      
                    </div>

                    {displayBtnOrNot==="是"? DisplayGiftTypeBtn() : null}
                    {gift_info.map((item, index) =>{
                        return (
                          <>
                              <div className='lottery-card card-shadow'>
                              {item.id !== 0 ? <button id={item.id} className="titleCloseBtn" style={{background:"#fbfafc"}} onClick={deleteGift}>X</button> : null}
                                <h4>輸入獎品資訊</h4>
                                  <p>
                                      <input id={item.id} type="text" placeholder="獎品名稱"  className='input-columns' defaultValue={item.gift_name}  onChange={changeGiftName}/>
                                  </p>
                                  <p>
                                      <input id={item.id} type="text" pattern="[0-9]*" placeholder="獎品數量"  className='input-columns' defaultValue={item.quantity}  onChange={changeGiftquantity}/>
                                  </p>
                                  <p>
                                      {/*<input id={item.id} type="text" placeholder="獎品圖片url網址"  className='input-columns' defaultValue={item.gift_pic_url}  onChange={changeGiftURL}/>*/}
                                      
                                      <img id={item.id} src={item.gift_pic_url} style={{  height: '300px', width: '400px', border: '0px'}} className='input-columns'/>
                                      {item.gift_pic_url==='https://i.imgur.com/sKBuD6v.png'? null:<button id={item.id} className={'Btn NextBtn'} onClick={deleteGiftImage}>Ｘ</button>}
                                      <br/>

                                      <input id={item.id}  type="file" name="myImage" accept="image/png, image/jpeg" onChange={changeGiftURL} />



                                  </p>

                                </div>
                          </>

                        );
                        })}
                    {displayBtnOrNot==="是" ? <DisplayGiftBtn/>  : null}

                  </div>

              </section>
            </section>

        </section>
        </>
    );
  }

export { MakeSurvey2 };