from db.db import get_db
from flask import Blueprint, request, session, jsonify
from flasgger.utils import swag_from
import psycopg2.extras  # get the results in form of dictionary

form_bp = Blueprint('form', __name__)
db = get_db()

# DAO


def replied(student_id):
    # input: User.student_id
    # output: Form.{form_title, form_picture, form_end_date, form_run_state, form_delete_state}
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = '''SELECT Form.form_title, Form.form_picture, Form.form_end_date, Form.form_run_state
    from UserForm
    JOIN Users on student_id = UserForm.User_student_id
    JOIN Form on form_id = UserForm.Form_form_id
    WHERE Form.form_delete_state='0' AND Users.student_id = %s
    '''
    cursor.execute(query, [student_id])
    db.commit()
    return cursor.fetchall()

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
        response.append(dict(result))
    return jsonify(response)
