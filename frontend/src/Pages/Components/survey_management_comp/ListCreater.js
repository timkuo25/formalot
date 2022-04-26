import Item from "./Item"


const ListCreater = ({ listData , deleteData}) => {

        return <div className="list">
            {
                listData.map((item) =>{
                    const { id, name, time, drawTime, memberShip} = item
                        if (memberShip=="製作者") {
                            return (
                                <div>
                                    <Item
                                        id = {id} 
                                        title = {name} 
                                        due_time = {time}
                                        lottery_time = {drawTime}
                                        memberShip = {memberShip}
                                        deleteData={deleteData}
                                    />
                                </div>
                            )
                        }
                })

            }

            </div>
    
}

export default ListCreater

// {
//     arr.map(item => <div>{item}</div>)
// }