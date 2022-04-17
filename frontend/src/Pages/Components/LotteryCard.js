import { Avator } from './Avator';

const LotteryCard = ({gift_name, gift_amount, gift_pic_url}) => {
    
    return (
        <div className="lottery-card">
            <h2>{gift_name} × {gift_amount}  </h2>
            <img className='prize-image' src={gift_pic_url} alt=''/>
            <div className='avator-container'>
                <Avator/>
                <Avator/>
                <Avator/>
            </div>
        </div>
    )
}

export { LotteryCard };