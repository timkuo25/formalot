from db.db import get_db
# from db.db import row_to_dict # For sqlite
from flask import Blueprint, request, jsonify
from flasgger.utils import swag_from
import psycopg2.extras  # get the results in form of dictionary
from flask_jwt_extended import jwt_required, get_jwt_identity

homePage_bp = Blueprint('homePage', __name__)

# DAO
def formRecommendation():

    db = get_db()
    
    # postgresql
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # sqlite (In case postgresql shutdown)
    # db.row_factory = row_to_dict
    # cursor = db.cursor()
    
    try:
        query = """
        SELECT FormNumAnswer.form_id, FormNumAnswer.form_title, FormNumAnswer.form_run_state, FormNumAnswer.form_create_date, FormNumAnswer.form_end_date, FormNumAnswer.form_pic_url, FormNumAnswer.num_answer, COUNT(Gift.form_form_id) AS num_gift
        FROM(
            SELECT ValidForm.form_id, ValidForm.form_title, ValidForm.form_run_state, ValidForm.form_create_date, ValidForm.form_end_date, ValidForm.form_pic_url, COUNT(DISTINCT UserForm.User_student_id) AS num_answer
            FROM (
                SELECT Form.form_id, Form.form_title, Form.form_run_state, Form.form_create_date, Form.form_end_date, Form.form_pic_url
                FROM Form
                WHERE Form.form_delete_state = 0 AND Form.form_run_state = 'Open'
                    ) AS ValidForm
                LEFT JOIN UserForm
                ON ValidForm.form_id = UserForm.Form_form_id
                GROUP BY ValidForm.form_id, ValidForm.form_title, ValidForm.form_run_state, ValidForm.form_create_date, ValidForm.form_end_date, ValidForm.form_pic_url) AS FormNumAnswer
        LEFT JOIN Gift
        ON FormNumAnswer.form_id = Gift.form_form_id
        GROUP BY FormNumAnswer.form_id, FormNumAnswer.form_title, FormNumAnswer.form_run_state, FormNumAnswer.form_create_date, FormNumAnswer.form_end_date, FormNumAnswer.form_pic_url, FormNumAnswer.num_answer;
        """
        cursor.execute(query)
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        return 'Failed to retrieve form.'
    finally:
        db.close()

# get jwt function
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return current_user

# route
@homePage_bp.route('/home', methods=['GET'])
@swag_from('homePage_specs.yml', methods=['GET'])
def get_formRecommendation():

    sortBy = request.args.get('sortBy')
    result = formRecommendation()
    if sortBy == 'newest':
        result.sort(key=lambda x: x['form_create_date'], reverse = True)
    else: # most popular form first by default
        result.sort(key=lambda x: x['num_answer'], reverse = True)
    return jsonify(result)

if __name__ == '__main__':
    print(formRecommendation())