from db.db import get_db
from flask import Blueprint, request, session, jsonify
from flasgger.utils import swag_from
import psycopg2.extras  # get the results in form of dictionary

form_bp = Blueprint('form', __name__)
db = get_db()

# DAO


def replied(student_id):
    # input: User.student_id
    # output: Form.{form_title, form_picture, form_end_date, form_run_state, form_id}
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = '''SELECT Form.form_title, Form.form_picture, Form.form_end_date, Form.form_run_state, Form_form_id
    from UserForm
    JOIN Users on student_id = UserForm.User_student_id
    JOIN Form on form_id = UserForm.Form_form_id
    WHERE Form.form_delete_state='0' AND Users.student_id = %s
    '''
    cursor.execute(query, [student_id])
    db.commit()
    return cursor.fetchall()


def win_lottery_check(form_id, student_id):
    # input: Userform.form_id, student_id
    # output: "未中獎"/"中獎"
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = '''SELECT *
        FROM gift
        WHERE form_form_id = %s AND user_student_id= %s
        '''
    cursor.execute(query, (form_id, student_id))
    rows = cursor.fetchall()

    if rows != []:
        return "中獎"
    return "未中獎"


# route


@form_bp.route('/SurveyManagement', methods=["GET"])
@swag_from('replier_form_specs.yml', methods=["GET"])
def returnReplierForm():
    # req_json = request.get_json()
    student_id = session.get('student_id')
    # student_id = req_json["student_id"]
    results = replied(student_id)  # list
    response = []
    for result in results:  # result: psycopg2.extras.DictRow
        result_dict = dict(result)
        form_id = result_dict['form_form_id']
        result_dict['winning_status'] = win_lottery_check(form_id, student_id)
        response.append(result_dict)
    return jsonify(response)
