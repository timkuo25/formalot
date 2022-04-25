import { Avator } from './Avator';
import React from 'react';

function QuestionCard(props) {
  return (
    <div className="lottery-card card-shadow">
        {console.log('questions',props.questions)}
        {props.questions && props.questions.map(question => {
            return (
                <div className='lottery-card' key={question.Question}>
                    <h2> {question.Question}  </h2>
                </div>
            )
        })}
    </div>
  )
}

export {QuestionCard}