from db.db import get_db
from hashlib import md5
import re
import uuid
from smtplib import SMTPException
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from flask_mail import Mail, Message

app_members = Blueprint('app_members', __name__)
db = get_db()

@app_members.after_request 
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

@app_members.route('/Email',methods = ["POST"])
def Email():
    req_json = request.get_json(force=True)
    condition=request.args.get('condition')
    email = req_json["email"]
    response_return = {
        "status": "",
        "message": "" 
    }
    if email_check(email):
        return sendemail(email,condition)
    else:
        response_return["status"] = "error"
        response_return["message"] = "請確認信箱格式"
        return jsonify(response_return)

@app_members.route('/Register',methods = ["POST"])
def Register():
    response_return = {
        "status": "",
        "message": "" 
    }
    req_json = request.get_json(force=True)
    code = req_json["code"]
    session_code = req_json["session_code"]
    
    if code_check(code,session_code):
        email = req_json["email"]
        id = email[:9]
        first_name = req_json["first_name"]
        last_name = req_json["last_name"]
        password = req_json["password"]
        password2 = req_json["password2"]
        result = db.cursor()
        query = '''
        SELECT Users.student_id 
        from Users 
        WHERE Users.student_id = (%s);
        '''
        result.execute(query, [id])
        rows = result.fetchall()

        if rows != []:
            response_return["status"] = "error"
            response_return["message"] = "此帳號已被註冊"
        else:
            if password_check(password, password2):
                password_hash = str(md5(password.encode("utf-8")).hexdigest())
                query = '''
                INSERT into Users (user_firstname, user_lastname, student_id, user_hashed_pwd) values (%s,%s,%s,%s);
                '''
                result.execute(query,(first_name,last_name,id,password_hash))
                db.commit() 
                response_return["status"] = "success"
                response_return["message"] = "註冊成功"
            else:
                response_return["status"] = "error"
                response_return["message"] = "密碼不一致"
    else:
        response_return["status"] = "error"
        response_return["message"] = "驗證碼錯誤"
    
    return jsonify(response_return)

@app_members.route('/Login',methods = ["POST"])
def Login():
    req_json = request.get_json(force=True)
    email = req_json["email"]
    id = email[:9]
    password = req_json["password"]
    response_return = {
        "status": "",
        "message": "" 
        }
    if login_check([id], password) == True:
        access_token = create_access_token(identity = id)
        return jsonify({'access_token': access_token, "status" : "success","message" : "登入成功"}) 
    elif login_check([id], password) == False:
        response_return["status"] = "error"
        response_return["message"] = "密碼錯誤"
        return jsonify(response_return)
    else:
        response_return["status"] = "error"
        response_return["message"] = "請先註冊"
        return jsonify(response_return)

@app_members.route('/ForgetPsw',methods = ["PUT"])
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
        if code_check(code,session_code):
            id = email[:9]
            result = db.cursor()
            query = '''
            SELECT *
            from Users 
            WHERE student_id = (%s);
            '''
            result.execute(query, [id])
            rows = result.fetchall()
            response_return = {
                "status": "",
                "message": "" 
                }
            if rows != []:
                password = req_json["password"]
                password2 = req_json["password2"]
                if len(password) != 0 or len(password2) != 0:
                    if password_check(password, password2):
                        password_hash = str(md5(password.encode("utf-8")).hexdigest())
                        query = '''
                        UPDATE Users SET user_hashed_pwd = (%s)
                        WHERE student_id = (%s);
                        '''
                        result.execute(query, (password_hash, id))
                        response_return["status"] = "success"
                        response_return["message"] = "更新成功"
                    else:
                        response_return["status"] = "error"
                        response_return["message"] = "密碼不一致"

                db.commit()
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

@app_members.route('/UserUpdate',methods = ["PUT"])
def UserUpdate():
    id = protected()
    result = db.cursor()
    query = '''
    SELECT *
    from Users 
    WHERE student_id = (%s);
    '''
    result.execute(query, [id])
    rows = result.fetchall()
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
        if len(first_name) != 0:
            query = '''
            UPDATE Users SET user_firstname = (%s)
            WHERE student_id = (%s);
            '''
            result.execute(query, (first_name, id))
            response_return["status"] = "success"
            response_return["message"] = "更新成功" 
        if len(last_name) != 0:
            query = '''
            UPDATE Users SET user_lastname = (%s)
            WHERE student_id = (%s);
            '''
            result.execute(query, (last_name, id))
            response_return["status"] = "success"
            response_return["message"] = "更新成功"
        if len(password) != 0 or len(password2) != 0:
            if password_check(password, password2):
                password_hash = str(md5(password.encode("utf-8")).hexdigest())
                query = '''
                UPDATE Users SET user_hashed_pwd = (%s)
                WHERE student_id = (%s);
                '''
                result.execute(query, (password_hash, id))
                response_return["status"] = "success"
                response_return["message"] = "更新成功"
            else:
                response_return["status"] = "error"
                response_return["message"] = "密碼不一致"

        db.commit()
    else:
        response_return["status"] = "error"
        response_return["message"] = "請先登入"
        
    return jsonify(response_return)

def password_check(password, password2):
    if password == password2:
        return True
    else:
        return False

def login_check(id, password):
    password_hash = str(md5(password.encode("utf-8")).hexdigest())
    result = db.cursor()
    query = '''
    SELECT user_hashed_pwd 
    from Users 
    WHERE Users.student_id = (%s);
    '''
    result.execute(query, id)
    rows = result.fetchone()
    if rows != None:
        if password_hash == rows[0]:
            return True
        else:
            return False

def sendemail(recipient,condition):
    response_return = {
        "status": "",
        "message": "",
        "code": ""
    }
    code = str(uuid.uuid1())[:6]
    if condition == "register":
        msg = Message('Activate your account!', sender = 'sdmg42022@gmail.com', recipients = [recipient])
        msg.body = "Please activate your account. This is your verification code: " + code
    elif condition == "forget_psw":
        msg = Message('Update your password!', sender = 'sdmg42022@gmail.com', recipients = [recipient])
        msg.body = "Please update your password with verification code. Here is your verification code: " + code

    with current_app.app_context():
        mail = Mail(current_app)
        try:
            mail.send(msg)
            response_return["status"] = "success"
            response_return["message"] = "請至信箱查看驗證碼"
            response_return["code"] = str(md5(code.encode("utf-8")).hexdigest())
        except SMTPException as e:
            current_app.logger.error(e.message)
            print()

    return jsonify(response_return)

def email_check(email):
    if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$",email):
        return True
    else:
        return False

def code_check(code,session_code):
    code = str(md5(code.encode("utf-8")).hexdigest())
    if code == session_code:
        return True
    else:
        return False

