from db.db import get_db
from flask import request, jsonify, Blueprint
from flasgger.utils import swag_from
import psycopg2.extras  # get the results in form of dictionary

form_bp = Blueprint('form', __name__)


# DAO


def replied(student_id):
    # input: User.student_id
    # output: Form.{form_title, form_picture, form_end_date, form_run_state, form_delete_state}
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = '''SELECT Form.form_title, Form.form_picture, Form.form_end_date, Form.form_run_state, Form.form_delete_state
    from UserForm
    JOIN Users on student_id = UserForm.User_student_id
    JOIN Form on form_id = UserForm.Form_form_id
    WHERE Users.student_id = (%s)
    '''
    cursor.execute(query, [student_id])
    db.commit()
    return cursor.fetchall()


# route


@form_bp.route('/SurveyManagement', methods=["POST"])
@swag_from('replier_form_specs.yml', methods=['POST'])
def returnReplierForm():
    req_json = request.get_json()
    student_id = req_json["student_id"]
    results = replied(student_id)  # list
    response = []
    for result in results:  # result: psycopg2.extras.DictRow
        del_state = result['form_delete_state']
        if (del_state == 0):  # filter
            response.append(dict(result))
    return jsonify(response)
