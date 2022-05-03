from db.db import get_db
from flask import Blueprint, request, jsonify
import psycopg2.extras  # get the results in form of dictionary
import difflib

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


def retrieveInfo():

    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("""
    SELECT FormWithTags.form_id, FormWithTags.form_title, FormWithTags.form_description, FormWithTags.form_create_date, FormWithTags.form_end_date, FormWithTags.form_pic_url, FormWithTags.form_run_state, FormWithTags.tag_name, FormWithTags.field_name, COUNT(Gift.form_form_id) AS num_gift
    FROM(
        SELECT ValidForm.form_id, ValidForm.form_title, ValidForm.form_description, ValidForm.form_create_date, ValidForm.form_end_date, ValidForm.form_pic_url, ValidForm.form_run_state, Tag.tag_name, Field.field_name 
        FROM (
            SELECT form_id, form_title, form_description, form_create_date, form_end_date, form_pic_url, form_run_state
            FROM Form
            WHERE form_run_state = 'Open' AND form_delete_state = 0) AS ValidForm
        LEFT JOIN Formtag
        ON ValidForm.form_id = Formtag.form_form_id
        LEFT JOIN Tag
        ON Tag.tag_id = Formtag.tag_tag_id
        LEFT JOIN Formfield
        ON ValidForm.form_id = Formfield.form_form_id
        LEFT JOIN Field
        ON Formfield.field_field_id = Field.field_id) AS FormWithTags
    LEFT JOIN Gift
    ON FormWithTags.form_id = Gift.form_form_id
    GROUP BY FormWithTags.form_id, FormWithTags.form_title, FormWithTags.form_description, FormWithTags.form_create_date, FormWithTags.form_end_date, FormWithTags.form_pic_url, FormWithTags.form_run_state, FormWithTags.tag_name, FormWithTags.field_name;
    """)
    result = cursor.fetchall()
    return result

def fuzzySearch(keyword, formInfo):

    for form in formInfo:
        # 比對項目：禮物標籤、學術領域標籤、問卷標題、問卷說明
        form['score'] = difflib.SequenceMatcher(None, str(form['field_name'])+str(form['tag_name'])+str(form['form_title'])+str(form['form_description']), keyword).quick_ratio()
    formInfo = list(filter(lambda x: x['score'] > 0, formInfo))
    formInfo = sorted(formInfo, key=lambda k: k['score'], reverse=True)
    return formInfo

# CORS issue
@explore_bp.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    header['Access-Control-Allow-Methods'] = '*'
    header['Content-type'] = 'application/json'
    return response

# route
@explore_bp.route('/GetFormByKeyWord', methods=['GET'])
def GetFormByKeyWord():
    KeywordType = request.args.get('KeywordType')
    Keyword = request.args.get('Keyword')
    result = getForm(KeywordType,Keyword)
    result.sort(key=lambda x: x['form_create_date'], reverse = True)
    return jsonify(result)

'''
[Wei] 目前是沒效率的寫法，每輸入新的keyword就要重新query db一次。
'''
@explore_bp.route('/explore/', methods=['GET'])
def exploreFuzzySearch():
    keyword = request.args.get('keyword')
    forms = retrieveInfo()
    response = fuzzySearch(keyword, forms)
    return jsonify(response)