import { useState } from "react"


const Edit = ({add}) => {

    const [id, setid] = useState("")
    const [name, setname] = useState("")
    const [time, setTime] = useState("")
    const [drawTime, setdrawTime] = useState("")
    const [memberShip, setmemberShip] = useState("")

    function idChange(e){
        setid(e.target.value)
    }
    function nameChange(e){
        setname(e.target.value)
    }
    function timeChange(e){
        setTime(e.target.value)
    }
    function drawTimeChange(e){
        setdrawTime(e.target.value)
    }
    function memberShipChange(e){
        setmemberShip(e.target.value)
    }

    function addItem(){
        add(function(prevData) {
            return [...prevData, {
                id,
                name,
                time,
                drawTime,
                memberShip
            }]
        })
    }


    console.log(id,name,time,drawTime,memberShip);

    return <div>
        <h1>{id}</h1>
        <h1>問卷管理：</h1>
        <p>ID：</p>
        <input type="text" value={id} onChange={idChange}/>
        <p>問卷主題：</p>
        <input type="text" value={name} onChange={nameChange}/>     
        <p>截止時間：</p>
        <input type="date" value={time} onChange={timeChange}/>
        <p>抽獎時間：</p>
        <input type="date" value={drawTime} onChange={drawTimeChange}/>
        <p>填寫/抽獎：</p>
        <select type="text" value={memberShip} onChange={memberShipChange}>
            <option>填寫者</option>
            <option>製作者</option>
        </select>
        <button onClick={addItem} className="add">新增</button>

    </div>
}

export default Edit