from db.db import get_db
from flask import Blueprint, request, session, jsonify
from hashlib import md5

app_members = Blueprint('app_members', __name__)
db = get_db()

@app_members.route('/Register',methods = ["POST"])
def Register():
    result = db.cursor()
    req_json = request.get_json(force=True)
    email = req_json["email"]
    id = email[:9]
    first_name = req_json["first_name"]
    last_name = req_json["last_name"]
    password = req_json["password"]
    password2 = req_json["password2"]
    query = '''
    SELECT Users.student_id 
    from Users 
    WHERE Users.student_id = (%s);
    '''
    result.execute(query, [id])
    rows = result.fetchall()

    response_return = {
        "status": "",
        "message": "" 
        }

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
    return jsonify(response_return)



@app_members.route('/Login',methods = ["POST"])
def Login():
    req_json = request.get_json(force=True)
    email = req_json["email"]
    id = email[:9]
    password = req_json["password"]
    user=session.get('student_id')
    response_return = {
        "status": "",
        "message": "" 
        }
    if user != None:
        response_return["status"] = "error"
        response_return["message"] = "請先登出"
    else:
        if login_check([id], password) == True:
            session['student_id'] = id
            session.permanent = True
            response_return["status"] = "success"
            response_return["message"] = "登入成功"
        elif login_check([id], password) == False:
            response_return["status"] = "error"
            response_return["message"] = "密碼錯誤"
        else:
            response_return["status"] = "error"
            response_return["message"] = "請先註冊"

    return jsonify(response_return)


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
        


@app_members.route('/Logout')
def Logout():
    response_return = {
        "status": "",
        "message": "" 
        }
    user=session.get('student_id') 
    if user == None:
        response_return["status"] = "error"
        response_return["message"] = "請先登入"
    else:
        session.pop('student_id')
        response_return["status"] = "success"
        response_return["message"] = "已登出"

    return jsonify(response_return)

@app_members.route('/UserUpdate',methods = ["PUT"])
def UserUpdate():
    id = session.get('student_id')
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
        if len(last_name) != 0:
            query = '''
            UPDATE Users SET user_lastname = (%s)
            WHERE student_id = (%s);
            '''
            result.execute(query, (last_name, id))
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
