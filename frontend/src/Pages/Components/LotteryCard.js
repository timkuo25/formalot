import { Avator } from './Avator';
import React from 'react';

function LotteryCard(props) {
  return (
    <div className="lottery-car card-shadow">
        {/* {console.log('lottery results',props.results.data)} */}
        {props.results && props.results.map(result => {
            <div>
                <h2>{result.gift_name} × {result.amount}  </h2>
                <img className='prize-image card-shadow' src={result.gift_pic_url} alt=''/>
                <div className='avator-container'>
                    {result.winner.map( (winner) => {
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