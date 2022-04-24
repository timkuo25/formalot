from db.db import get_db
from flask import Blueprint, request, jsonify
import psycopg2.extras  # get the results in form of dictionary

explore_bp = Blueprint('exploreform', __name__)

def getForm(KeywordType,Keyword):

    db = get_db()
    
    # postgresql
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        if KeywordType == "tag":
            query = """
            SELECT Form.form_id, Form.form_title, Form.form_run_state, Form.form_create_date, Form.form_end_date, Form.form_pic_url, Tag.tag_name
            FROM Form
            RIGHT JOIN FormTag
            ON Form.form_id = FormTag.Tag_Tag_id
            LEFT JOIN Tag
            ON FormTag.Tag_Tag_id = Tag.Tag_id
            WHERE Form.form_delete_state = 0 AND Form.form_run_state = 'Open' AND Tag.Tag_name = (%s);
            """
        elif KeywordType == "field":
            query = """
            SELECT Form.form_id, Form.form_title, Form.form_run_state, Form.form_create_date, Form.form_end_date, Form.form_pic_url, Field.field_name
            FROM Form
            RIGHT JOIN FormField
            ON Form.form_id = FormField.form_form_id
            LEFT JOIN Field
            ON FormField.field_field_id = Field.field_id
            WHERE Form.form_delete_state = 0 AND Form.form_run_state = 'Open' AND Field.field_name = (%s);
            """

        cursor.execute(query,[Keyword])
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        return 'Failed to retrieve form by keyword.'
    finally:
        db.close()


# route
@explore_bp.route('/GetFormByKeyWord', methods=['GET'])
def GetFormByKeyWord():
    KeywordType = request.args.get('KeywordType')
    Keyword = request.args.get('Keyword')
    result = getForm(KeywordType,Keyword)
    result.sort(key=lambda x: x['form_create_date'], reverse = True)
    return jsonify(result)
