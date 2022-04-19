import { Avator } from './Avator';
import React from 'react'

function LotteryCard(props) {
  return (
    <div className="lottery-card">
        {/* {console.log('lottery results',props.results.data)} */}
        {props && props.map(result => {
            <div>
                <h2>{result.gift_name} × {result.amount}  </h2>
                <img className='prize-image' src={result.gift_pic_url} alt=''/>
                <div className='avator-container'>
                    {props.results.winner.map( (winner) => {
                        return (
                            <Avator
                                user_name={winner.user_stutent_id}
                                user_pic_url={winner.user_pic_url}
                            />
                        )})
                    }
                </div>
            </div>
        })}
    </div>
  )
}

export {LotteryCard}