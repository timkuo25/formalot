from db.db import get_db
from flask import Blueprint, request, jsonify
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


def deleteForm(form_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        query = '''UPDATE Form
        SET form_delete_state = '1'
        WHERE form_id = (%s) AND form_run_state = 'Closed'
        '''
        cursor.execute(query, [form_id])
        db.commit()
        return True
    except:
        db.rollback()
        return False
    finally:
        db.close()


def closeForm(form_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        query = '''UPDATE Form
        SET form_run_state='Closed'
        WHERE form_id = (%s)
        '''
        cursor.execute(query, [form_id])
        db.commit()
        return True
    except:
        db.rollback()
        return False
    finally:
        db.close()


'''
[Wei]: addForm可能會再更新，以確保db transaction process。（但變數不會改變，前端可以照用）
'''


def addForm(form_title, form_description, questioncontent, form_create_date, form_end_date, form_draw_date, student_id, form_pic_url, form_field_type, form_gift_type, gift_info):
    db = get_db()
    # db cursor is lightweight, so it's better to declare multiple curosrs instead of running multiple db connections.
    cursor1 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor2 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor3 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor4 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor5 = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        # Write Form
        query = """
        INSERT INTO Form(form_id, form_title, form_description, questioncontent, form_create_date, form_end_date, form_draw_date, form_run_state, form_delete_state, User_student_id, form_pic_url)
        SELECT Max(form_id)+1, %s, %s, %s, %s, %s, %s, 'Open', 0, %s, %s FROM Form;
        """
        cursor1.execute(query, [form_title, form_description, questioncontent, form_create_date, form_end_date,form_draw_date, student_id, form_pic_url])

        # Find Max form_id
        query = """SELECT MAX(form_id) FROM form;"""
        cursor2.execute(query)
        result = cursor2.fetchall()
        form_id = result[0]['max']

        # Write Formtag
        query = """
        INSERT INTO Formtag(form_form_id, tag_tag_id)
        SELECT %s, tag_id FROM Tag WHERE tag_name = %s;
        """
        cursor3.execute(query, [form_id, form_gift_type])

        # Write Gift
        query = """
        INSERT INTO Gift(form_form_id, gift_name, gift_pic_url, number)
        VALUES 
        """
        for gift in gift_info:
            for i in range(gift['quantity']):
                query += """({}, '{}', '{}', {}),""".format(form_id,
                                                            gift['gift_name'], gift['gift_pic_url'], i)
        query = query[:-1]
        cursor4.execute(query)

        # Write FormField
        query = """
        INSERT INTO FormField(form_form_id, field_field_id)
        SELECT %s, field_id FROM Field WHERE field_name = %s;
        """
        cursor5.execute(query, [form_id, form_field_type])

        db.commit()
        return True

    except psycopg2.DatabaseError as error:
        db.rollback()
        return error

    finally:
        db.close()


def getAns(form_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        query = '''SELECT UserForm.answercontent, UserForm.user_student_id
        FROM UserForm
        WHERE UserForm.form_form_id = %s;
        '''
        cursor.execute(query, [form_id])
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        return False
    finally:
        db.close()


def searchResponseByID(student_id, form_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        query = '''
        SELECT *
        From UserForm
        WHERE Form_form_id = (%s) and User_student_id = (%s)
        '''
        cursor.execute(query, [form_id, student_id])
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        # return 'Failed to retrieve member.'
    finally:
        db.close()


def addResponse(student_id, form_id, answer_time, answercontent):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        query = """
        INSERT INTO UserForm(User_student_id, Form_form_id, Form_answer_time, Answercontent)
        values (%s,%s,%s,%s);
        """
        cursor.execute(query, [student_id, form_id,
                       answer_time, answercontent])
        db.commit()
        return True
    except psycopg2.DatabaseError as error:
        db.rollback()
        print(error)
    finally:
        db.close()


# get jwt function
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return current_user


# route
@ form_bp.route('/FillForm', methods=['POST'])
def FillForm():
    student_id = protected()
    req_json = request.get_json(force=True)
    form_id = req_json["form_id"]
    response = {
        "status": "",
        "message": ""
    }
    rows = searchResponseByID(student_id, form_id)
    print(rows)
    if rows != []:
        response["status"] = "error"
        response["message"] = "您已填寫過此表單"
    else:
        answercontent = json.dumps(
            req_json["answercontent"], ensure_ascii=False)
        answer_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if addResponse(student_id, form_id, answer_time, answercontent):
            response["status"] = 'success'
            response["message"] = 'Reponse added.'
        else:
            response["status"] = 'fail'
            response["message"] = 'Reponse aborted.'

    return jsonify(response)


@ form_bp.route('/SurveyManagement', methods=['GET'])
def returnForm():
    student_id = protected()
    # student_id = 'r10725051'  # test data
    response = [{'replied': replied(student_id),
                'created': created(student_id)}]
    return jsonify(response)


@ form_bp.route('/SurveyManagement', methods=["PUT"])
def modifyForm():
    req_json = request.get_json()
    form_id = req_json["form_id"]
    action = req_json["action"]
    response_return = {
        "status": "",
        "message": ""
    }
    if action == "delete":
        if deleteForm(form_id):
            response_return["status"] = "success"
            response_return["message"] = "Deleted form"
        else:
            response_return["status"] = "fail"
            response_return["message"] = "Cannot delete form"
    elif action == "close":
        closeForm(form_id)
        response_return["status"] = "success"
        response_return["message"] = "Closed form"
    return jsonify(response_return)


@ form_bp.route('/SurveyManagement/new', methods=['GET', 'POST'])
def createForm():

    # form_title = 'addForm測試'  # test data
    # questioncontent = '[{"測試題目":"測試題目"}]'  # test data
    # form_description = '這是一份測試問卷'
    # form_create_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # test data
    # form_end_date = datetime.datetime(2022, 9, 10, 23, 59, 59)  # test data
    # form_draw_date = datetime.datetime(2022,9, 11, 23, 59, 59)  # test data
    # student_id = 'r10725051'  # test data
    # form_pic_url = 'https://imgur.com/gallery/05YcgLz'  # test data
    # form_tag_name = '美妝保養類'  # test data
    # gift_info = [{"gift_name":"星巴克","gift_pic_url":"imgur.com/1","quantity":3},{"gift_name":"iPhone", "gift_pic_url":"imgur.com/2","quantity":2}]  # test data

    req_json = request.get_json(force=True)
    form_title = req_json['form_title']
    form_description = req_json['form_description']
    questioncontent = json.dumps(req_json['questioncontent'], ensure_ascii=False)
    form_create_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    form_end_date = req_json['form_end_date']
    form_draw_date = req_json['form_draw_date']
    student_id = protected()
    form_pic_url = req_json['form_pic_url']
    form_field_type = req_json['form_field_type']
    form_gift_type = req_json['form_gift_type']
    gift_info = req_json['gift_info']

    response = {
        "status": "",
        "message": ""
    }
    if addForm(form_title, form_description, questioncontent, form_create_date, form_end_date, form_draw_date, student_id, form_pic_url, form_field_type, form_gift_type, gift_info):
        response["status"] = 'success'
        response["message"] = 'Form added.'
    else:
        response["status"] = 'fail'
        response["message"] = 'Form aborted.'
    return jsonify(response)



@ form_bp.route('/SurveyManagement/detail', methods=['GET'])
def statisticForm():
    form_id = request.args.get('form_id')
    results = getAns(form_id)
    response = {
        "status": "",
        "data": [],
        "message": ""
    }

    if(len(results) == 0):
        response["status"] = "fail"
        response["message"] = "The form does not exist or the number of the repliers is 0"
    else:
        for i in results:
            response["status"] = "success"
            temp = {
                "reply": i["answercontent"],
                "user": i["user_student_id"]
            }
            response["data"].append(temp)
            response["message"] = "Get answer successfully"

    return jsonify(response)


@ form_bp.route('/FormRespondentCheck', methods=["GET"])
def FormRespondentCheck():
    response = {
        "has_responded":0
    }
    student_id = protected()
    form_id = request.args.get('form_id')
    rows = searchResponseByID(student_id, form_id)
    print(rows)
    if rows != []:
        return "True"

    else:
        return "False"

# 取得該問卷的題目與題型


@ form_bp.route('/GetUserForm', methods=["GET"])
def getUserForm():
    form_id = request.args.get('form_id')
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT form_id, form_description, form_pic_url, questioncontent
    FROM form
    WHERE form_id = (%s);
    '''
    cursor.execute(query, [form_id])
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()

    return jsonify(result)
