import Item from "./Item"


const List = ({ listData , deleteData}) => {

        return <div className="list">
            {
                listData.map((item) =>{
                    let { form_id, form_title, form_create_date, form_end_date, form_draw_date, form_pic_url, form_run_state} = item
                    
                    console.log("123",form_create_date)
                    if (!form_end_date){
                        console.log("123",form_create_date)
                        form_create_date = form_create_date.slice(-4)
                        form_end_date = form_end_date.slice(-4)
                        form_draw_date = form_draw_date.slice(-4)
                    }
                    return (
                        <div>
                            <Item
                                form_id = {form_id} 
                                form_title = {form_title} 
                                form_create_date = {form_create_date}
                                form_end_date = {form_end_date}
                                form_draw_date = {form_draw_date}
                                form_pic_url = {form_pic_url}
                                form_run_state={form_run_state}
                            />
                        </div>

                    )
                        
                })

            }

            </div>    
}

List.defaultProps = {
    listData: [  ]
}



export default List

