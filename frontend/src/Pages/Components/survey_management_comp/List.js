import Item from "./Item"


const List = ({ listData , deleteData}) => {

        return <div className="list">
            {
                listData.map((item) =>{
                    const { form_id, form_title, form_create_date, form_end_date, form_draw_date, form_pic_url, form_run_state} = item

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
    listData: [ { "form_create_date": 0, "form_draw_date": 0, "form_end_date": 0, "form_id": 0, "form_pic_url": "https://imgur.com/gallery/3Nnlo", "form_run_state": "Open", "form_title": "2022【醫美認知與消費意願之研究】調查表問卷" }, { "form_create_date": "Wed, 20 Apr 2022 21:49:49 GMT", "form_draw_date": "Sat, 30 Apr 2022 23:59:59 GMT", "form_end_date": "Fri, 01 Apr 2022 23:59:59 GMT", "form_id": 0, "form_pic_url": 0, "form_run_state": 0, "form_title": 0 } ]
}



export default List

