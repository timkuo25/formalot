import { Avator } from './Avator';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import ItemsCarousel from 'react-items-carousel';

function ItemSlider(props) {
  return (
    <div style={{ padding: `0 ${props.chevronWidth}px` }}>
    <ItemsCarousel
        requestToChangeActive={props.setActiveItemIndex}
        activeItemIndex={props.activeItemIndex}
        numberOfCards={5}
        gutter={5}
        rightChevron={
            <RightCircleOutlined style={{ fontSize: '1.5em', color: '#8864b3'}}/>
          }
          leftChevron={
            <LeftCircleOutlined style={{ fontSize: '1.5em', color: '#8864b3'}}/>
          }
        outsideChevron
        chevronWidth={props.chevronWidth}
    >
        {props.candidateList.map( (candidate) => {
            return (
                <Avator
                    key={candidate.student_id}
                    user_name={candidate.student_id}
                    user_pic_url={candidate.user_pic_url}
                />
            )
        })}
    </ItemsCarousel>
    </div>
  )
}

export {ItemSlider}