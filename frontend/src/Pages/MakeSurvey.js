// import { Navbar } from './Components/Navbar';
// import React, {Component} from 'react';
// import { useNavigate } from "react-router-dom";


// class MakeSurvey extends Component{
//     //const [myTasks, moveMyTask] = useState(props.tasks);
//     constructor(props){
//         super(props);
//         this.state={
//             storedElements:[],
//             surveyDict:[]
//         };
//         this.renderCrudDiv = this.renderCrudDiv.bind(this);
//         this.divList = this.divList.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//         this.handleChange = this.handleChange.bind(this);
//     }

//     renderCrudDiv(type){
//         var temp={}
//         if (type==='description'){
//             temp = {
//                 Question:"",
//                 Qtype: type,
//                 option:""
//             }
//         }

//         //temp['Question'] = 'default'
//         this.setState({
//             storedElements:[...this.state.storedElements, type], 
//             surveyDict:[...this.state.surveyDict, temp]
        
//         });
//         //console.log(this.state.surveyDict)
//       }

//     divList() {
//         const rowList = [];
//         for (let i = 0; i < this.state.storedElements.length; i++) {
//             if (this.state.storedElements[i]=='description'){
//                 rowList.push(
//                     <div className='makeSurvey-card' key={i}>
//                     <h4>簡答</h4>
//                     <p>
//                         <input id={i} type="text" placeholder="Question" style={{width: "100%", height:"50px"}} onChange={this.handleChange}/>
//                     </p>
//                     <p>
//                         <input type="text" placeholder="Answer" disabled = {1} style={{width: "80%", height:"80px"}}/>
//                     </p>
        
//                 </div>
//                   );
//             }
 
//         }
//         return rowList;

//       }
//     handleSubmit(event) {
        
//         console.log(this.state.surveyDict)
//         event.preventDefault();
//         window.location.href = "/MakeSurvey2";//暫時用jS去寫換頁

//       }

//     handleChange(evt) {
//         const value = evt.target.id;
//         console.log(value)
//         var surveyDictTemp = this.state.surveyDict.slice()
//         var item = this.state.surveyDict[value];
//         item.Question = evt.target.value;
//         surveyDictTemp[value] = item;
//         this.setState({
//             surveyDict:surveyDictTemp
//         });
//         //console.log(this.state.surveyDict)
//       }

    
//     render(){
//         return (

//             <>
//             <Navbar/>
//             {/*react dnd*/}
//             <section className='makeSurvey-container'>
        
//                 <section className='makeSurvey-results'>
//                     <div>
//                         <h3>製作問卷 > 填寫抽獎資訊 > 發布問卷 </h3>
//                     </div>

//                     <form onSubmit={this.handleSubmit}>
//                     <div className='makeSurvey-card'>
//                         <h3>表單標題</h3>
//                         <p>
//                             <input type="text" placeholder="問卷題目" style={{width: "100%", height:"50px"}} defaultValue="Untitled"/>
//                         </p>
//                         <p>
//                             <input type="text" placeholder="問卷描述" style={{width: "100%", height:"30px"}}/>
//                         </p>
    
//                     </div>
//                     {this.divList()}
//                         <input className='Btn NextBtn' type='submit' value="下一步"/>
                    
//                         </form> 
  
                    
                    
    
//                 </section>  
                
//                 <section className='makeSurvey-info'>

//                     <div className='makeSurvey-card sticky-div'>
//                         <p>
//                             <button className='Btn SurveyDescriptionBtn' onClick = {()=>this.renderCrudDiv('description')}>
//                              簡答
//                             </button>
//                         </p>

//                         <p>
//                             <button className='Btn SurveyOptionBtn'>
//                                單選題
//                             </button>
//                         </p>
//                         <p>
//                             <button className='Btn SurveyOptionBtn'>
//                                多選題
//                             </button>
//                         </p>
//                         <p>
//                             <button className='Btn SurveyOptionBtn'>
//                                下拉式選單
//                             </button>
//                         </p>
//                         <p>
//                             <button className='Btn SurveyOptionBtn'>
//                                線性量表問題
//                             </button>
//                         </p>
//                     </div>
//                 </section>
                
//             </section>
//             </>
//         )
//     }
// }

// export { MakeSurvey };