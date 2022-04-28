import { ItemSlider } from './ItemSlider'
import React, { useState, useEffect } from 'react';


function LotteryCard(props) {
    const [activeItemIndex, setActiveItemIndex] = useState(0);
  return (
        <div className='lottery-card card-shadow' key={props.result.gift_name}>
            <h2> {props.result.gift_name} × {props.result.amount}  </h2>
            <img className='prize-image card-shadow' src={props.result.gift_pic_url} alt=''/>
            <div >
                {console.log('winner', props.result['winner'])}
                <ItemSlider candidateList={props.result['winner']} 
                    activeItemIndex={activeItemIndex} setActiveItemIndex={setActiveItemIndex}/>
            </div>
        </div>
  )
}

export {LotteryCard}