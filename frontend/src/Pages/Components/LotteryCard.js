import { Avator } from './Avator';
import React from 'react';

function LotteryCard(props) {
  return (
    <div >
        {props.lotteryResults && props.lotteryResults.map(result => {
            return (
                <div className='lottery-card card-shadow' key={result.gift_name}>
                    <h2> {result.gift_name} × {result.amount}  </h2>
                    <img className='prize-image card-shadow' src={result.gift_pic_url} alt=''/>
                    <div className='avator-container'>
                        {console.log('winner', result['winner'])}
                        {result['winner'].map( (winner) => {
                            return(
                                <Avator
                                    user_name={winner.user_student_id}
                                    user_pic_url={winner.user_pic_url}
                                />
                            )
                        })}
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export {LotteryCard}