from db.db import get_db
from hashlib import md5
import re
import uuid
from smtplib import SMTPException
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from flask_mail import Mail, Message
import psycopg2.extras  # get the results in form of dictionary
from datetime import timedelta

members_bp = Blueprint('members_bp', __name__)

@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return current_user

def addMember(user_email, user_firstname, user_lastname, student_id, user_hashed_pwd):
    db = get_db()
    cursor = db.cursor()
    try:
        query = '''
        INSERT into Users (user_email, user_firstname, user_lastname, student_id, user_hashed_pwd) values (%s,%s,%s,%s,%s);
        '''
        cursor.execute(query, (user_email, user_firstname, user_lastname, student_id, user_hashed_pwd))
        db.commit()
        # return 'Succeed in adding member.'
        print('Succeed in adding member.')
    except:
        db.rollback()
        print('Failed to add member.')
        # return 'Failed to add member.'
    finally:
        db.close()

def updateMember(password_hash, student_id):
    db = get_db()
    cursor = db.cursor()
    try:
        query ='''
        UPDATE Users SET user_hashed_pwd = (%s)
        WHERE student_id = (%s);
        '''
        cursor.execute(query, (password_hash, student_id))
        db.commit()
        # return 'Succeed in updating member password.'
    except:
        db.rollback()
        # return 'Failed to update member password.'
    finally:
        db.close()

def updateMemberInfo(Info, student_id, diffinfo):
    db = get_db()
    cursor = db.cursor()
    try:
        if diffinfo == "first_name":
            query = '''
            UPDATE Users SET user_firstname = (%s)
            WHERE student_id = (%s);
            '''
        elif diffinfo == "last_name":
            query = '''
            UPDATE Users SET user_lastname = (%s)
            WHERE student_id = (%s);
            '''
        elif diffinfo == "password":
            query = '''
            UPDATE Users SET user_hashed_pwd = (%s)
            WHERE student_id = (%s);
            '''

        cursor.execute(query, (Info, student_id))
        db.commit()
        # return 'Succeed in updating member info.'
    except:
        db.rollback()
        # return 'Failed to update member info.'
    finally:
        db.close()

def updateMemberphoto(user_pic_url, student_id):
    db = get_db()
    cursor = db.cursor()
    try:
        query = '''
        UPDATE Users SET user_pic_url = (%s)
        WHERE student_id = (%s);
        '''
        cursor.execute(query, (user_pic_url, student_id))
        db.commit()
        # return 'Succeed in  updating member photo.'
    except psycopg2.DatabaseError as error:
        db.rollback()
        print(error)
        # return 'Failed to update member photo.'
    finally:
        db.close()

def getMemberByStudentId(student_id):
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        query = '''
        SELECT student_id, user_firstname, user_lastname, user_pic_url, user_email
        From Users 
        WHERE Users.student_id = (%s);
        '''
        cursor.execute(query, [student_id])
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        # return 'Failed to retrieve member.'
    finally:
        db.close()

def getPasswordByUserEmail(user_email):
    db = get_db()
    cursor = db.cursor()
    try:
        query = '''
        SELECT user_hashed_pwd 
        from Users 
        WHERE Users.user_email = (%s);
        '''
        cursor.execute(query, [user_email])
        db.commit()
        return cursor.fetchall()
    except:
        db.rollback()
        # return 'Failed to retrieve member's password.'
    finally:
        db.close()

@members_bp.route('/Email', methods=["POST"])
def Email():
    req_json = request.get_json(force=True)
    condition = request.args.get('condition')
    email = req_json["email"]
    response_return = {
        "status": "",
        "message": ""
    }
    if email_check(email):
        return sendemail(email, condition)
    else:
        response_return["status"] = "error"
        response_return["message"] = "請確認信箱格式"
        return jsonify(response_return)

@members_bp.route('/Register', methods=["POST"])
def Register():
    response_return = {
        "status": "",
        "message": ""
    }
    req_json = request.get_json(force=True)
    code = req_json["code"]
    session_code = req_json["session_code"]

    if code_check(code, session_code):
        email = req_json["email"]
        id = email[:email.find('@')]
        first_name = req_json["first_name"]
        last_name = req_json["last_name"]
        password = req_json["password"]
        password2 = req_json["password2"]

        rows = getMemberByStudentId(id)
        if rows != []:
            response_return["status"] = "error"
            response_return["message"] = "此帳號已被註冊"
        else:
            if password_check(password, password2):
                password_hash = str(md5(password.encode("utf-8")).hexdigest())
                addMember(email, first_name, last_name, id, password_hash)
                response_return["status"] = "success"
                response_return["message"] = "註冊成功"
            else:
                response_return["status"] = "error"
                response_return["message"] = "密碼不一致"
    else:
        response_return["status"] = "error"
        response_return["message"] = "驗證碼錯誤"

    return jsonify(response_return)

@members_bp.route('/Login', methods=["POST"])
def Login():
    req_json = request.get_json(force=True)
    email = req_json["email"]
    id = email[:email.find('@')]
    password = req_json["password"]
    response_return = {
        "status": "",
        "message": "",
        "test": ""
    }
    if login_check(email, password) == True:
        # access_token = create_access_token(identity=id, expires_delta = timedelta(seconds=10))
        # refresh_token = create_refresh_token(identity=id, expires_delta = timedelta(seconds=20))
        access_token = create_access_token(identity=id, expires_delta = timedelta(minutes=120))
        refresh_token = create_refresh_token(identity=id, expires_delta = timedelta(days=1))
        return jsonify({'access_token': access_token, 'refresh_token': refresh_token, "status": "success", "message": "登入成功"})
    elif login_check(email, password) == False:
        response_return["status"] = "error"
        response_return["message"] = "密碼錯誤"
        return jsonify(response_return)
    else:
        response_return["status"] = "error"
        response_return["message"] = "請先註冊"
        response_return["test"] = login_check(email, password)
        return jsonify(response_return)

@members_bp.route('/ForgetPsw', methods=["PUT"])
def ForgetPsw():
    response_return = {
        "status": "",
        "message": ""
    }
    req_json = request.get_json(force=True)
    email = req_json["email"]
    if email_check(email):
        code = req_json["code"]
        session_code = req_json["session_code"]
        if code_check(code, session_code):
            id = email[:email.find('@')]
            rows = getMemberByStudentId(id)
            if rows != []:
                password = req_json["password"]
                password2 = req_json["password2"]
                if len(password) != 0 or len(password2) != 0:
                    if password_check(password, password2):
                        password_hash = str(md5(password.encode("utf-8")).hexdigest())
                        updateMember(password_hash, id)
                        response_return["status"] = "success"
                        response_return["message"] = "更新成功"
                    else:
                        response_return["status"] = "error"
                        response_return["message"] = "密碼不一致"
            else:
                response_return["status"] = "error"
                response_return["message"] = "請先註冊"
        else:
            response_return["status"] = "error"
            response_return["message"] = "驗證碼錯誤"
    else:
        response_return["status"] = "error"
        response_return["message"] = "請確認信箱格式"
    return jsonify(response_return)

@members_bp.route('/UserUpdate', methods=["PUT"])
def UserUpdate():
    id = protected()
    rows = getMemberByStudentId(id)
    response_return = {
        "status": "",
        "message": ""
    }
    if rows != []:
        req_json = request.get_json(force=True)
        first_name = req_json["first_name"]
        last_name = req_json["last_name"]
        password = req_json["password"]
        password2 = req_json["password2"]
        detect = ""
        if len(first_name) != 0:
            updateMemberInfo(first_name, id, "first_name")
            response_return["status"] = "success"
            response_return["message"] = "更新成功"
            detect = 1
        if len(last_name) != 0:
            updateMemberInfo(last_name, id, "last_name")
            response_return["status"] = "success"
            response_return["message"] = "更新成功"
            detect = 1
        if len(password) != 0 or len(password2) != 0:
            detect = 1
            if password_check(password, password2):
                password_hash = str(md5(password.encode("utf-8")).hexdigest())
                updateMemberInfo(password_hash, id, "password")
                response_return["status"] = "success"
                response_return["message"] = "更新成功"
            else:
                response_return["status"] = "error"
                response_return["message"] = "密碼不一致"
        if detect != 1:
            response_return["status"] = "success"
            response_return["message"] = "所有資料皆與原資料相同，故暫不進行變更！"
    else:
        response_return["status"] = "error"
        response_return["message"] = "請先登入"

    return jsonify(response_return)

@members_bp.route('/GetUserProfile', methods=["GET"])
def GetUserProfile():
    id = protected()
    rows = getMemberByStudentId(id)
    return jsonify(rows)

@members_bp.route('/UpdateMemberPhoto', methods=["PUT"])
def UpdateMemberPhoto():
    response_return = {
        "message": ""
    }
    req_json = request.get_json(force=True)
    pic_url = req_json["pic_url"]
    id = protected()
    updateMemberphoto(pic_url, id)

    if pic_url != "" :
        response_return["message"] = "使用者照片更新成功"
    else:
        response_return["message"] = "使用者照片更新失敗"
    
    return jsonify(response_return)

def password_check(password, password2):
    if password == password2:
        return True
    else:
        return False

def login_check(user_email, password):
    password_hash = str(md5(password.encode("utf-8")).hexdigest())
    rows = getPasswordByUserEmail(user_email)
    if rows != []:
        if password_hash == rows[0][0]:
            return True
        else:
            return False
    
def sendemail(recipient, condition):
    response_return = {
        "status": "",
        "message": "",
        "code": ""
    }
    code = str(uuid.uuid1())[:6]
    if condition == "register":
        msg = Message('Formalot 開始使用你的帳號!',
                      sender='sdmg42022@gmail.com', recipients=[recipient])
        msg.body = "請使用驗證碼激活您的 Formalot 帳號。 這是您的驗證碼: " + code
    elif condition == "forget_psw":
        msg = Message('Formalot 請更新您的密碼!',
                      sender='sdmg42022@gmail.com', recipients=[recipient])
        msg.body = "請使用驗證碼更改您的 Formalot 密碼。 這是您的驗證碼:: " + code

    with current_app.app_context():
        mail = Mail(current_app)
        try:
            mail.send(msg)
            response_return["status"] = "success"
            response_return["message"] = "請至信箱查看驗證碼"
            response_return["code"] = str(
                md5(code.encode("utf-8")).hexdigest())
        except SMTPException as e:
            current_app.logger.error(e.message)
            print()

    return jsonify(response_return)

def email_check(email):
    if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email):
        return True
    else:
        return False

def code_check(code, session_code):
    code = str(md5(code.encode("utf-8")).hexdigest())
    if code == session_code:
        return True
    else:
        return False
