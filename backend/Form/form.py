from db.db import get_db
from flask import request, jsonify, Blueprint
from flasgger.utils import swag_from


form_bp = Blueprint('form', __name__)


# DAO


def replied(student_id):
    # input: User.student_id
    # output: Form.{form_title, form_picture, form_end_date, form_run_state, form_delete_state}
    db = get_db()
    cursor = db.cursor()
    query = '''SELECT Form.form_title, Form.form_picture, Form.form_end_date, Form.form_run_state, Form.form_delete_state
    from UserForm
    JOIN User  on student_id = UserForm.User_student_id
    JOIN Form on form_id = UserForm.Form_form_id
    WHERE User.student_id = ?
    '''
    cursor.execute(query, [student_id])  # list object
    db.commit()
    return cursor.fetchall()


# route


@form_bp.route('/SurveyManagement', methods=["POST"])
@swag_from('replier_form_specs.yml', methods=['POST'])
def returnReplierForm():
    req_json = request.get_json()
    student_id = req_json["student_id"]
    results = replied(student_id)

    response = []
    for result in results:  # result is a sqlite3.Row object which can turn into dictionary
        del_state = dict(result)['form_delete_state']
        if (del_state == 0):  # filter
            response.append(dict(result))
    return jsonify(response)
