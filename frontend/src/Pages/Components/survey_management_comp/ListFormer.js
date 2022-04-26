import Item from "./Item"


const ListFormer = ({ listData , deleteData}) => {

        return <div className="list">
            {
                listData.map((item) =>{
                    const { id, name, time, drawTime, memberShip} = item
                        if (memberShip=="填寫者") {
                            return (
                                <div>
                                    {/* <h1>{JSON.stringify(listData, null, 2) }</h1> */}

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

export default ListFormer

// {
//     arr.map(item => <div>{item}</div>)
// }