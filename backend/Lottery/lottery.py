from cmath import nan
from db.db import get_db
from flask import request, jsonify, Blueprint, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import random
from flask_apscheduler import APScheduler

lottery_bp = Blueprint('lottery', __name__)
scheduler = APScheduler()

@lottery_bp.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    header['Access-Control-Allow-Methods'] = '*'
    header['Content-type'] = 'application/json'
    return response


@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return current_user



def getFormDeleteStatueByFormId(form_id):
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT form_delete_state
    FROM form
    WHERE form_id = (%s);
    '''
    cursor.execute(query, [form_id])
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()
    return result

def getCandidateByFormId(form_id):
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT student_id, user_pic_url 
    FROM users 
    JOIN userform 
    ON users.student_id = userform.user_student_id
    WHERE form_form_id = (%s) ;
    '''
    cursor.execute(query, [form_id])
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()
    return result


def getGiftAmountByFormId(form_id):
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT  gift_name, COUNT(gift_name), gift_pic_url
    from gift
    WHERE form_form_id = (%s)
    GROUP BY gift_name, gift_pic_url;
    '''
    cursor.execute(query, [form_id])
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()
    return result


def getGiftDetailByFormId(form_id):
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT gift_name, number
    FROM gift
    WHERE form_form_id = (%s);
    '''
    cursor.execute(query, [form_id])
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()
    return result


def getFormRunStatueByFormId(form_id):
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT form_run_state
    FROM form
    WHERE form_id = (%s);
    '''
    cursor.execute(query, [form_id])
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()
    return result


def updateWinner(form_id, student_id, num, gift_name):
    db = get_db()
    cursor = db.cursor()
    query = '''
    UPDATE gift SET user_student_id = (%s)
    WHERE number = (%s) AND gift_name = (%s) AND form_form_id = (%s);
    '''
    cursor.execute(query, [student_id, num, gift_name, form_id])

    stateQuery = '''
    UPDATE form SET form_run_state = 'Closed'
    WHERE form_id = (%s);
    '''
    cursor.execute(stateQuery, [form_id])
    db.commit()
    db.close()

    # result = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in cursor.fetchall()]
    return 


def getUserAvatar(student_id):
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT user_pic_url
    FROM USERS
    WHERE student_id = (%s); 
    '''
    cursor.execute(query, [student_id])
    db.commit()
    db.close()
    result = cursor.fetchone()[0]

    return result


def getClosedFormResult(form_id):
    db = get_db()
    cursor = db.cursor()

    count_query = '''
    SELECT count(distinct(gift_name))
    FROM gift
    WHERE form_form_id = (%s);
    '''

    cursor.execute(count_query, [form_id])
    count_result = [dict((cursor.description[i][0], value)
                         for i, value in enumerate(row)) for row in cursor.fetchall()]
    count = count_result[0]["count"]

    get_detail_query = '''
    SELECT gift_name, count(gift_name) AS amount, gift_pic_url
    FROM gift
    WHERE form_form_id = (%s)
    GROUP BY gift_name, gift_pic_url;
    '''
    cursor.execute(get_detail_query, [form_id])
    detail_result = [dict((cursor.description[i][0], value)
                          for i, value in enumerate(row)) for row in cursor.fetchall()]

    db.commit()
    db.close()
    return count, detail_result


def getClosedFormWinner(form_id, gift_name):
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT user_student_id, user_pic_url
    FROM gift 
    JOIN users ON users.student_id = gift.user_student_id
    WHERE form_form_id = (%s) AND gift_name = (%s);
    '''
    cursor.execute(query, [form_id, gift_name])
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()

    return result


def getFormDetailByFormId(form_id):
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT form_title, form_create_date, form_end_date, form_draw_date
    FROM form
    WHERE form_id = (%s);
    '''
    cursor.execute(query, [form_id])
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()
    return result


@lottery_bp.route('/GetCandidate', methods=["GET"])
# @jwt_required()
def getCandidate():
    form_id = request.args.get('form_id')
    results = getCandidateByFormId(form_id)
    response = {
        "status": "",
        "data": {"candidates": []},
        "message": ""
    }

    # check whether the candidate list is empty
    if(len(results) == 0):
        response["status"] = "error"
        response["message"] = "The form does not exist or the number of the repliers is 0 !!!"
    else:
        for i in results:
            response["status"] = "success"
            temp_data = {
                "user_student_id": i["student_id"],
                "user_pic_url": i["user_pic_url"]
            }
            response["data"]["candidates"].append(temp_data)
            response["message"] = "Get candidates successfully!!!"

    return jsonify(response)


@lottery_bp.route('/GetGift', methods=["GET"])
# @jwt_required()
def getGift():
    form_id = request.args.get('form_id')
    results = getGiftAmountByFormId(form_id)
    response = {
        "status": "",
        "data": [],
        "message": ""
    }

    if(len(results) == 0):
        response["status"] = "error"
        response["message"] = "The form does not exist!!!"
    else:
        response["status"] = "success"
        response["message"] = "Get gifts successfully!!!"
        for i in range(len(results)):
            data = {
                "gift_name": results[i]["gift_name"],
                "amount": results[i]["count"],
                "gift_pic_url": results[i]['gift_pic_url']
            }
            response["data"].append(data)

    return jsonify(response)



def autoLottery(form_id):
    num_of_lottery = 0
    candidate_list = []

    # form_id = request.args.get('form_id')

    # get_form_det = getFormDetailByFormId(form_id)
    get_gift = getGiftAmountByFormId(form_id)
    get_candidate = getCandidateByFormId(form_id)
    get_gift_detail = getGiftDetailByFormId(form_id)
    get_run_state = getFormRunStatueByFormId(form_id)
    response = {
        "status": "",
        "data": {"lottery_results": []},
        "message": ""
    }
    if(get_run_state == []):
        response["status"] = "error"
        response["message"] = "The form does not exist!!!"
    elif (get_run_state[0]["form_run_state"] == "WaitForDraw"):
        # lottery_list = []
        for i in get_candidate:
            candidate_list.append(i["student_id"])

        for i in range(len(get_gift)):
            num_of_lottery += get_gift[i]["count"]

        lottery_list = random.sample(candidate_list, num_of_lottery)
        for i in range(len(get_gift_detail)):
            prize = {
                "gift": get_gift_detail[i]["gift_name"],
                "number": get_gift_detail[i]["number"],
                "winner": lottery_list[i],
                "winner_avatar_url": getUserAvatar(lottery_list[i])
            }
            response["data"]["lottery_results"].append(prize)
            response["status"] = "success"
            response["message"] = "The draw is complete and the result is stored in database!!!"
            updateWinner(
                form_id, lottery_list[i], get_gift_detail[i]["number"], get_gift_detail[i]["gift_name"])
    else:
        response["status"] = "error"
        if(get_run_state[0]["form_run_state"] == "Closed"):
            response["message"] = "The form has been closed!!!"
        elif(get_run_state[0]["form_run_state"] == "Open"):
            response["message"] = "The form is still open!!!"

    return 0


@lottery_bp.route('/GetLotteryResults', methods=["GET"])
# @jwt_required()
def getLotteryResults():
    form_id = request.args.get('form_id')
    response = {
        "status": "",
        "data": {
            '禮物數量': 0,
            'results': []},
        "message": ""
    }

    try:
        form_run_state = getFormRunStatueByFormId(form_id)[0]['form_run_state']
        form_del_state = getFormDeleteStatueByFormId(form_id)[0]['form_delete_state']
        if(form_run_state == 'Closed' and form_del_state == 0):
            gift_categoryamount = getClosedFormResult(form_id)[0]
            gift_total = getClosedFormResult(form_id)[1]
            response['data']['禮物數量'] = (gift_categoryamount).tostring()

            for gift in gift_total:
                response['data']['results'].append(gift)

            for gift_detail in response["data"]['results']:
                gift_name = gift_detail['gift_name']
                gift_detail['winner'] = getClosedFormWinner(form_id, gift_name)
                response["status"] = "Closed"
                response["message"] = "Get lottery results successfully!!!"
        elif(form_run_state == 'WaitForDraw'):
            response["status"] = 'WaitForDraw'
            response["message"] = 'The form is waiting for draw!!!'
        elif(form_run_state == 'Open'):
            response["status"] = 'Open'
            response["message"] = 'The form is still open!!!'
        elif(form_run_state == 'Closed' and form_del_state == 1):
            response["status"] = 'Delete'
            response["message"] = 'The form is deleted!!!!!'

    except:
        response["status"] = 'NotExist'
        response["message"] = 'The form is not exist!!!'

    return jsonify(response)


@lottery_bp.route('/GetFormDetail', methods=["GET"])
def getFormDetail():
    form_id = request.args.get('form_id')
    result = getFormDetailByFormId(form_id)[0]

    return jsonify(result)



# fetch draw form
def autolotteryfunc():
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT form_id
    FROM form
    WHERE form_run_state = 'WaitForDraw' AND form_draw_date < CURRENT_TIMESTAMP + (8 * interval '1 hour') ;
    '''
    cursor.execute(query)
    result = [dict((cursor.description[i][0], value)
                   for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()

    for i in result:
        form_id = i['form_id']
        autoLottery(form_id)
        print(str(form_id) + 'lottery is complete!')

    return "complete"



@lottery_bp.route('/AutolotteryOnTime', methods=["GET"])
def AutolotteryOnTime():
    scheduler.add_job(id = 'AutoLottery', func=autolotteryfunc, trigger="cron", minute=0)
    scheduler.start()

    return 'lottery running'
    
@lottery_bp.route('/GetUserForm', methods=["GET"])
def getUserForm():
    form_id = request.args.get('form_id')
    db = get_db()
    cursor = db.cursor()
    query = '''
    SELECT form_id, questioncontent
    FROM form
    WHERE form_id = (%s);
    '''
    cursor.execute(query, [form_id])
    result = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in cursor.fetchall()]
    db.commit()
    db.close()
    
    return jsonify(result)


