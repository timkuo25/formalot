const callrefresh = async (type) => {
    const data = await fetch('https://be-sdmg4.herokuapp.com/refresh',{
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
        },
    });
    let resJson = await data.json();
    if (resJson.access_token){
        localStorage.setItem('jwt', resJson.access_token);
        console.log("Refresh Success");
        console.log(resJson.access_token);
        if(type !== "reload"){
            alert("若非頁面跳轉，請重新執行動作");
        }
        window.location.reload();   
    }else{
        localStorage.removeItem('jwt', resJson.access_token);
        localStorage.removeItem('refresh_token', resJson.refresh_token);
        console.log("Refresh 已過期，請重新登入!");
        alert("請重新登入!");
        window.location.replace("/")
    };
};

export default callrefresh;