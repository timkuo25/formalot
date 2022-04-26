import React from 'react';

function QuestionCard(props) {
    function showQuestion(question){
        const questionBox = [];
        if (question.Type=="單選題"){
            question.Options && question.Options.map(option => {
                questionBox.push ( <input type="radio" name={question.Question} value={option} />)
                questionBox.push ( <label> {option}</label>)
            })
            return(questionBox)
        }
        else if (question.Type=="複選題"){
            question.Options && question.Options.map(option => {
                questionBox.push ( <input type="checkbox" name={question.Question} value={option} />)
                questionBox.push ( <label> {option}</label>)
            })
            return(questionBox)
        }
        else if (question.Type=="簡答題"){
            return (
                <input type="text" placeholder="Answer" className='input-columns' name={question.Question}
                style={{width: "100%", height:"90px"}}/>
            )
        }
    }
  return (
    <div className='lottery-card'>
        {console.log('questions',props.questions)}
        <form>
        {props.questions && props.questions.map(question => {
            return (
                <div key={question.Question}>
                    <h2> {question.Question} </h2>
                    {showQuestion(question)}
                </div>
        )})}
        <br/>
        <input type="submit" className='general-button Btn ' value="送出表單"/>
        </form>
    </div>
  )
}

export {QuestionCard}