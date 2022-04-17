const Avator = ({user_name, user_pic_url}) => {
    
    return (
        <div className="avator">
            <img alt="" className="avator-image" src={process.env.PUBLIC_URL + 'dog.png'}/>
            <p> {user_name} </p>
        </div>
    )
}

export { Avator };