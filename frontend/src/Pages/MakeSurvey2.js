import { Navbar } from './Components/Navbar';
import {ButtonGroup} from "./Components/ButtonGroup";
import React, {Component, useState, useRef} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import { DndProvider } from "react-dnd";
//import { HTML5Backend } from 'react-dnd-html5-backend';
//import {SurveyBoard} from './Components/SurveyBoard';


const DisplayGiftDiv = ()=>{
  return(
    
    <div className='lottery-card'>
    <h4>輸入獎品資訊</h4>
      <p>
          <input type="text" placeholder="獎品名稱" style={{width: "60%", height:"40px", border:' 2px solid #8864b3'}}/>
      </p>
      <p>
          <input type="text" placeholder="獎品數量" style={{width: "60%", height:"40px", border:' 2px solid #8864b3'}}/>
      </p>
      <p>
          <input type="text" placeholder="獎品圖片url網址" style={{width: "60%", height:"40px", border:' 2px solid #8864b3'}}/>
      </p>

    </div>

  );
}


const MakeSurvey2 = () => {
    //const [myTasks, moveMyTask] = useState(props.tasks);
    const [DateForFormEnd, setDateForFormEnd] = useState(new Date());
    const [DateForLottery, setDateForLottery] = useState(new Date());
    const [displayBtnOrNot, setDisplayBtnOrNot] = useState(0);
    const [giftNum, setGiftNum] = useState(0);
    const [image, setImage] = useState(null);
    const inputFile = useRef(null) 

    const displayBtn = (event) => {
      if (event.target.name === '是'){
        setDisplayBtnOrNot(1)
        if (giftNum===0){
          setGiftNum(1)
        }
      }
      else{
        setDisplayBtnOrNot(0)
        setGiftNum(0)
      }

    };
    const DisplayGiftBtn = ()=>{
      return(
        
        <div>
          <button className='add-giftBtn Btn' onClick={()=>{setGiftNum(giftNum+1)}}><img className='add-gift-image' src={process.env.PUBLIC_URL + 'giftbox.png'} alt='Gift'/></button>
  
        </div>
    
      );
    }

    const giftDiv = ()=>{
      var rowList = [];
      
      for (let i = 0; i < giftNum; i++) {
        rowList.push(
          <DisplayGiftDiv/>
        );

      }
      return rowList
    }

    const onImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        let img = event.target.files[0];
        setImage(URL.createObjectURL(img))
      }
    };


    return (
        <>
        <Navbar/>
        {/*react dnd*/}
        <section className='page-container'>
          <div className='breadcrumb'>
            <h3>製作問卷 > 填寫抽獎資訊 > 發布問卷 </h3>
          </div>
          <section className='makeSurvey-container'>
              <section className='makeSurvey-info'>
                  <div className='makeSurvey-card'>
                    <h3 style={{textAlign: "center"}}>截止與抽獎時間</h3>
                    <h4>問卷截止時間</h4>
                    <p>
                    <DatePicker selected={DateForFormEnd} onChange={(date:Date) => setDateForFormEnd(date)} />
                    </p>
                    <h4>抽獎時間</h4>
                    <p>
                    <DatePicker selected={DateForLottery} onChange={(date:Date) => setDateForLottery(date)} />
                    </p>
                    <h4>問卷縮圖圖片</h4>
                    <div>
                      <input className='Btn SurveyOptionBtn' ref={inputFile} type="file" name="myImage" onChange={onImageChange} style={{display:'none'}}/>
                      <button className='Btn SurveyOptionBtn' onClick={()=>inputFile.current.click()}>
                        選擇圖片
                    </button>
                      </div>
                      <br></br>
                      <div>
                      <img src={image} style={{  height: '300px', width: '400px'}}/>
                    </div>

                  
                      
                  </div>
                  
                  
              </section>  
              
              <section className='makeSurvey-results '>

                  <div className='makeSurvey-card'>
                  
                    <div className='makeSurvey-card'>
                      <h4>是否有抽獎？</h4>
                      <div className='BtnGroupContainer'>
                        <ButtonGroup buttons={["是", "否"]} btnFunc={displayBtn} />
                      </div>
                      
                    </div>
                    <div className='makeSurvey-card'>
                      <h4>抽獎獎品類別？</h4>
                        <div className='BtnGroupContainer'>
                          <ButtonGroup buttons={['3C', "食物", "飲料", '文具', '美妝', '禮卷', '現金', '其他']} />
                        </div>
                    </div>
                    {displayBtnOrNot ? giftDiv()  : null}
                    {displayBtnOrNot ? <DisplayGiftBtn/>  : null}

                  </div>
                  <div className='BtnGroupContainer' style={ {position:'relative', left:'50%'}}>
                    <button className='NextBtn Btn'>
                        上一步
                    </button>
                    <button className='NextBtn Btn'>
                        下一步
                    </button>

                  </div>
              </section>
            </section>

        </section>
        </>
    );
  }

export { MakeSurvey2 };