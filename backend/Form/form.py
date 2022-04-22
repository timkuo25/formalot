from db.db import get_db
from flask import Blueprint, request, session, jsonify
from flasgger.utils import swag_from
import psycopg2.extras  # get the results in form of dictionary
import json
import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

form_bp = Blueprint('form', __name__)

# DAO

def replied(student_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        # 直覺寫法（有更有效率的結構但我還沒想到怎麼寫QQ）
        query = '''SELECT UserForm.Form_form_id, Form.Form_title, Form.Form_end_date, Form.Form_draw_date, Form.Form_run_state, Form.Form_pic_url, Gift.Gift_name AS draw_result
        FROM UserForm
        LEFT JOIN Form ON UserForm.Form_form_id = Form.Form_id
        LEFT JOIN Gift ON UserForm.Form_form_id = Gift.Form_form_id AND UserForm.User_student_id = Gift.User_student_id
        WHERE Form.form_delete_state = 0 AND UserForm.User_student_id = %s;
        '''
        cursor.execute(query, [student_id])
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        return 'failed to retrieve form.'
    finally:
        db.close() 


def created(student_id):
    # input: User.student_id
    # output: Form.{form_id, form_title, form_pic_url, form_create_date, form_end_date, form_run_state}
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        query = """
        SELECT form_id, form_title, form_pic_url, form_create_date, form_end_date, form_draw_date, form_run_state
        FROM Form 
        WHERE User_student_id = %s AND form_delete_state = 0;
        """
        cursor.execute(query, [student_id])
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        return 'failed to retrieve form.'
    finally:
        db.close()


'''
@ Wei: 我把win_lottery_check和replied合併，讓查詢replied form 時只要I/O db一次
'''
# def replied(student_id):
#     # input: User.student_id
#     # output: Form.{form_title, form_picture, form_end_date, form_run_state, form_id}
#     db = get_db()
#     cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
#     query = '''SELECT Form.form_title, Form.form_pic_url, Form.form_end_date, Form.form_run_state, Form_form_id
#     from UserForm
#     JOIN Users on student_id = UserForm.User_student_id
#     JOIN Form on form_id = UserForm.Form_form_id
#     WHERE Form.form_delete_state='0' AND Users.student_id = %s
#     '''
#     cursor.execute(query, [student_id])
#     db.commit()
#     db.close()
#     return cursor.fetchall()


# def win_lottery_check(form_id, student_id):
#     # input: Userform.form_id, student_id
#     # output: "未中獎"/"中獎"
#     db = get_db()
#     cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
#     query = '''SELECT *
#         FROM gift
#         WHERE form_form_id = %s AND user_student_id= %s
#         '''
#     cursor.execute(query, (form_id, student_id))
#     rows = cursor.fetchall()
#     db.close()

#     if rows != []:
#         return "中獎"
#     return "未中獎"


def deleteForm(form_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = '''UPDATE Form
    SET form_delete_state = '1'
    WHERE form_id = %s
    '''
    cursor.execute(query, [form_id])
    db.commit()
    db.close()
    return True


def closeForm(form_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = '''UPDATE Form
    SET form_run_state='Closed'
    WHERE form_id = %s
    '''
    cursor.execute(query, [form_id])
    db.commit()
    db.close()
    return True


'''
[Wei]: addForm可能會再更新，以確保db transaction process。（但變數不會改變，前端可以照用）
'''
def addForm(form_title, questioncontent, form_create_date, form_end_date, form_draw_date, student_id, form_pic_url, form_tag_name, gift_info):
    db = get_db()
    # db cursor is lightweight, so it's better to declare multiple curosrs instead of running multiple db connections.
    cursor1 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor2 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor3 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor4 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        # Write Form
        query = """
        INSERT INTO Form(form_id, form_title, questioncontent, form_create_date, form_end_date, form_draw_date, form_run_state, form_delete_state, User_student_id, form_pic_url)
        SELECT Max(form_id)+1, %s, %s, %s, %s, %s, 'Open', 0, %s, %s FROM Form;
        """
        cursor1.execute(query, [form_title, questioncontent, form_create_date, form_end_date,form_draw_date, student_id, form_pic_url])

        # Find Max form_id
        query = """SELECT MAX(form_id) FROM form;"""
        cursor2.execute(query)
        result = cursor2.fetchall()
        form_id = result[0]['max']
        print('Find Max form_id = {}'.format(form_id))

        # Write Formtag
        query = """
        INSERT INTO Formtag(form_form_id, tag_tag_id)
        SELECT %s, tag_id FROM Tag WHERE tag_name = %s;
        """
        cursor3.execute(query, [form_id, form_tag_name])
        print('Write Formtag')

        # Write Gift
        query = """
        INSERT INTO Gift(form_form_id, gift_name, gift_pic_url, number)
        VALUES 
        """
        for gift in gift_info:
            for i in range(gift['quantity']):
                query += """({}, '{}', '{}', {}),""".format(form_id, gift['gift_name'], gift['gift_pic_url'], i)
        query = query[:-1]
        cursor4.execute(query)
        print('Write Gift')

        db.commit()
        return True

    except psycopg2.DatabaseError as error:
        db.rollback()
        return error

    finally:
        db.close()


# CORS issue
@form_bp.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    header['Access-Control-Allow-Methods'] = '*'
    header['Content-type'] = 'application/json'
    return response


# get jwt function
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return current_user


# route


@ form_bp.route('/SurveyManagement', methods=['GET'])
def returnForm():
    student_id = protected()
    # student_id = 'r10725051'  # test data
    response = [{'replied':replied(student_id),
                'created':created(student_id)}]
    return jsonify(response)


# @ form_bp.route('/SurveyManagement', methods=["GET"])
# @ swag_from('replier_form_specs.yml', methods=["GET"])
# def returnReplierForm():
#     student_id = protected()  # get id
#     results = replied(student_id)  # list
#     response = []
#     for result in results:  # result: psycopg2.extras.DictRow
#         result_dict = dict(result)
#         form_id = result_dict['form_form_id']
#         result_dict['winning_status'] = win_lottery_check(form_id, student_id)
#         response.append(result_dict)
#     return jsonify(response)


@ form_bp.route('/SurveyManagement', methods=["PUT"])
@ swag_from('modify_form_specs.yml', methods=["PUT"])
def modifyForm():
    req_json = request.get_json()
    form_id = req_json["form_id"]
    action = req_json["action"]
    response_return = {
        "status": "",
        "message": ""
    }
    if action == "delete":
        deleteForm(form_id)
        response_return["status"] = "success"
        response_return["message"] = "Deleted form"
    elif action == "close":
        closeForm(form_id)
        response_return["status"] = "success"
        response_return["message"] = "Closed form"
    return jsonify(response_return)


# @ form_bp.route('/SurveyManagement/author', methods=['GET'])
# def returnAuthorForm():
#     # student_id = 'r10725051'  # test data
#     student_id = session.get('student_id')
#     results = created(student_id)
#     return jsonify(results)


@ form_bp.route('/SurveyManagement/new', methods=['GET', 'POST'])
def createForm():

    # form_title = 'addForm測試'  # test data
    # questioncontent = '[{"測試題目":"測試題目"}]'  # test data
    # form_create_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # test data
    # form_end_date = datetime.datetime(2022, 9, 10, 23, 59, 59)  # test data
    # form_draw_date = datetime.datetime(2022,9, 11, 23, 59, 59)  # test data
    # student_id = 'r10725051'  # test data
    # form_pic_url = 'https://imgur.com/gallery/05YcgLz'  # test data
    # form_tag_name = '美妝保養類'  # test data
    # gift_info = [{"gift_name":"星巴克","gift_pic_url":"imgur.com/1","quantity":3},{"gift_name":"iPhone", "gift_pic_url":"imgur.com/2","quantity":2}]  # test data
    
    req_json = request.get_json(force=True)
    form_title = req_json['form_title']
    questioncontent = json.dumps(req_json['questioncontent'], ensure_ascii=False)
    form_create_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    form_end_date = req_json['form_end_date']
    form_draw_date = req_json['form_draw_date']
    student_id = protected()
    form_pic_url = req_json['form_pic_url']
    form_tag_name = req_json['form_tag_name']
    gift_info = req_json['gift_info']

    response = {
        "status": "",
        "message": ""
    }
    if addForm(form_title, questioncontent, form_create_date, form_end_date, form_draw_date, student_id, form_pic_url, form_tag_name, gift_info):
        response["status"] = 'success'
        response["message"] = 'Form added.'
    else:
        response["status"] = 'fail'
        response["message"] = 'Form aborted.'
    return jsonify(response)
