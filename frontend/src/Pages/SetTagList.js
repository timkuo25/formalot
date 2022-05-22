import '../css/Lottery.css'
import '../css/Fill-in.css'
import '../css/Form.css'
import React, { useState, useEffect, useCallback } from 'react';


const TagList = (props) => {
    const lotteryResults = props.lotteryResults
    const isOwner = props.isOwner
    const setShowTag = props.setShowTag
    const showTag = props.showTag
    const [tags, setTags] = useState([])

    useEffect(()=> {
        setTagList(lotteryResults, isOwner)
    }, [lotteryResults, isOwner])

    function setTagList(lotteryResults, isOwner)
    {
        return new Promise((resolve, reject) => {
            console.log(lotteryResults.status, isOwner)
            if(isOwner === true)
            {
                if (lotteryResults === 'Closed' || lotteryResults === 'WaitForDraw'){
                    console.log('condition1')
                    setTags(['抽獎結果','填答結果'])
                    setShowTag('抽獎結果')
                }
                else{
                    console.log('condition2')
                    setTags(['填寫問卷', '抽獎結果', '填答結果'])
                    setShowTag('填寫問卷')
                }
            }
            else if(isOwner === false)
            {
                if (lotteryResults === 'Closed' || lotteryResults === 'WaitForDraw'){
                    console.log('condition3')
                    setTags(['抽獎結果'])
                    setShowTag('抽獎結果')
                }
                else{
                    console.log('condition4')
                    setTags(['填寫問卷', '抽獎結果'])
                    setShowTag('填寫問卷')
                }
            }
            else {
                console.log('condition5')
                setTags(['有問題'])
                setShowTag('有問題')
            }
            resolve();
        });
    };


    return(
        <div className='page-navbar'>
        {tags.map(item => {
            return (
                <div
                    className='page-navbar-item card-shadow'
                    key={item}
                    style={item === showTag ? {backgroundColor: 'rgba(77, 14, 179, 0.15)'} : {}}
                    onClick={e => {
                        setShowTag(item);
                    }}
                >{item}</div>
            )
        })}
         </div>
    )
} 
export {TagList}