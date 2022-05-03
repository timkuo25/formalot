import '../css/MakeSurvey.css';
import { Navbar } from './Components/Navbar';
import {ButtonGroup} from "./Components/ButtonGroup";
import React, {Component, useState, useRef, useEffect} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateTimePicker from 'react-datetime-picker';
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
    const [image, setImage] = useState({img:null,display:null });
    const [imgurURL, setImgurURL] = useState("");
    const [giftType, setGiftType] = useState("無抽獎活動");
    const [formType, setFormType] = useState("商業及管理學門");
    const [gift_info, setGiftInfo] = useState([])
    const [rerenderkey, setrerenderkey] = useState(0)
    const inputFile = useRef(null) 


    useEffect(() => {

      let form_info = window.sessionStorage.getItem('form_info')
      if (form_info){
        form_info = JSON.parse(form_info)
        setDateForFormEnd(new Date(form_info.form_end_date))
        setDateForLottery(new Date(form_info.form_draw_date))
        setGiftNum(form_info.giftNum)
        setImage(form_info.formimage)
        setGiftInfo(form_info.gift_info)

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
        formimage:image

      }
      window.sessionStorage.setItem('form_info', JSON.stringify(form_info));
  }, [DateForFormEnd, DateForLottery, displayBtnOrNot, giftNum, giftType, formType, gift_info]);


    const displayBtn = (event) => {
      if (event.target.name === '是'){
        setDisplayBtnOrNot("是")
        if (giftNum===0){
          setGiftNum(1);
          let gift={
            id:gift_info.length,
            gift_name:"",
            gift_pic_url:"",
            quantity:""
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
        gift_pic_url:"",
        quantity:""
      }
      setGiftInfo((gift_info.concat(gift)));
    }


    const DisplayGiftBtn = ()=>{
      return(
        <div>
          <button className='add-giftBtn Btn ' onClick={addGift}><img className='add-gift-image' src={process.env.PUBLIC_URL + 'giftbox.png'} alt='Gift'/></button>
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


    const onImageChange = async(event) => {
      if (event.target.files && event.target.files[0]) {
        //console.log(event.target.files[0])
        let img = event.target.files[0];
        setImage({img:img,display:URL.createObjectURL(img)})
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
        formimage:image

      }
      window.sessionStorage.setItem('form_info', JSON.stringify(form_info));
      //event.preventDefault();
      window.location.href = "/MakeSurvey";//暫時用jS去寫換頁
    }

    

    const handleSubmit =()=>{
      let surveycontent = window.sessionStorage.getItem('form')
      surveycontent = JSON.parse(surveycontent)
      const formdata = new FormData() 
      formdata.append("image", image.img)

      //上傳照片到imgur
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
        console.log(imgururl)

        let surveyData = {
          form_title: surveycontent.form_title,
          form_description: surveycontent.form_description,
          questioncontent: surveycontent.questioncontent,
          form_end_date: DateForFormEnd,
          form_draw_date: DateForLottery,
          form_pic_url: imgururl,
          form_gift_type: giftType,
          form_field_type: formType,
          gift_info:gift_info
        }


        /*const result = fetch("http://127.0.0.1:5000/SurveyManagement/new", {
          method: "POST",
          body: surveyData,
        });
        let resJson = result.json();
        console.log(resJson);
        alert(resJson.message);*/
        
        console.log(surveyData)
      })
      
      window.sessionStorage.setItem('form', '');
      window.sessionStorage.setItem('form_info', '');
      //window.location.href = "/";//暫時用jS去寫換頁
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

  const changeGiftquantity = evt =>{
    /*
    change question content(get by id)
    */
    console.log(evt.target.id)
    let id = Number(evt.target.id)
    let tempArr = gift_info
    tempArr[id].quantity=evt.target.value
    setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
        
      setGiftInfo(tempArr)
        return gift_info
    })


  }
  
  const changeGiftURL = evt =>{
    /*
    change question content(get by id)
    */
    console.log(evt.target.id)
    let id = Number(evt.target.id)
    let tempArr = gift_info
    tempArr[id].gift_pic_url=evt.target.value
    setGiftInfo((gift_info)=>{ //為了解決每次都沒辦法get到最新set的value
        
      setGiftInfo(tempArr)
        return gift_info
    })
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
                    <button className='Btn SurveyOptionBtn card-shadow' onClick={back}>
                        製作問卷
                    </button>
                    <button className='Btn SurveyOptionBtn card-shadow' >
                        填寫抽獎資訊
                    </button>
                    <button className='Btn SurveyOptionBtn card-shadow' onClick={handleSubmit}>
                        發布問卷
                    </button>


          </div>
          <section className='makeSurvey-container'>
              <section className='makeSurvey-info'>
                  <div className='makeSurvey-card card-shadow'>
                    <h3 style={{textAlign: "center"}}>截止與抽獎時間</h3>
                    <h4>問卷截止時間</h4>
                    <p>
                    <DateTimePicker value={DateForFormEnd} onChange={(date:Date) => setDateForFormEnd(date)}  className='input-columns' />
                    </p>
                    <h4>抽獎時間</h4>
                    <p>
                    <DateTimePicker value={DateForLottery} onChange={(date:Date) => setDateForLottery(date)} className='input-columns'/>
                    </p>
                    <h4>問卷縮圖圖片</h4>
                    <div>
                      <img src={image.display} style={{  height: '300px', width: '400px', border: '0px'}} className='input-columns'/>
                      </div>
                      <br></br>
                      <div>
                      <input className='Btn SurveyOptionBtn' ref={inputFile} type="file" name="myImage" onChange={onImageChange} style={{display:'none'}}/>
                      <button className='Btn SurveyOptionBtn card-shadow' onClick={()=>inputFile.current.click()}>
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
                                      <input id={item.id} type="text" placeholder="獎品圖片url網址"  className='input-columns' defaultValue={item.gift_pic_url}  onChange={changeGiftURL}/>
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