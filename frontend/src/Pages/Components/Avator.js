const Avator = ({user_name, user_pic_url}) => {
    
    return (
        <div className="avator">
            <img alt="" className="avator-image" src={user_pic_url}/>
            <p> {user_name} </p>
        </div>
    )
}

export { Avator };