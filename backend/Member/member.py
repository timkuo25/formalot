from db.db import get_db
from flask import Blueprint, request, session
from hashlib import md5

app_members = Blueprint('app_members', __name__)
db = get_db()

@app_members.route('/Register',methods = ["POST","GET"])
def Register():
    if request.method == 'POST':
        result = db.cursor()
        email = request.args.get("email")
        id = email[:9]
        first_name = request.args.get("first_name")
        last_name = request.args.get("last_name")
        password = request.args.get("password")
        password2 = request.args.get("password2")
        result.execute("SELECT Users.student_id from Users where Users.student_id = %s", [id])
        rows = result.fetchall()

        if rows != []:
            return '此帳號已經被註冊過'
        else:
            if password_check(password, password2):
                password_hash = str(md5(password.encode("utf-8")).hexdigest())
                result.execute("INSERT into Users (user_firstname, user_lastname, student_id, user_hashed_pwd) values (%s,%s,%s,%s)",(first_name,last_name,id,password_hash))
                db.commit() 
                return '註冊成功'
            else:
                return '密碼不一致'
    return '使用者註冊'
    

@app_members.route('/Login',methods = ["POST","GET"])
def Login():
    if request.method == 'POST':
        email = request.args.get("email")
        id = email[:9]
        password = request.args.get("password")
        user=session.get('student_id') 
        if user != None:
            return '請先登出'
        else:
            if login_check([id], password) == True:
                session['student_id'] = id
                session.permanent = True
                return '登入成功'
            elif login_check([id], password) == False:
                return '密碼錯誤'
            else:
                return '請先註冊'
    return '會員登入'

def login_check(id, password):
    password_hash = str(md5(password.encode("utf-8")).hexdigest())
    result = db.cursor()
    result.execute("SELECT user_hashed_pwd from Users where Users.student_id = %s", id)
    rows = result.fetchone()
    if rows != []:
        if password_hash == rows[0]:
            return True
        else:
            return False
    else:
        return '請先註冊'


@app_members.route('/Logout')
def Logout():
    session.pop('student_id')
    return '已登出'


@app_members.route('/UserUpdate',methods = ["PUT","GET"])
def UserUpdate():
    if request.method == 'PUT':
        result = db.cursor()
        id = session.get('student_id')
        result.execute("SELECT * from Users where student_id = %s", [id])
        rows = result.fetchall()
        first_name = request.args.get("first_name")
        last_name = request.args.get("last_name")
        password = request.args.get("password")
        password2 = request.args.get("password2")

        if rows != []:
            if len(first_name) != 0:
                result.execute("UPDATE Users SET user_firstname = %s WHERE student_id = %s", (first_name, id))   
            if len(last_name) != 0:
                result.execute("UPDATE Users SET user_lastname = %s WHERE student_id = %s", (last_name, id))
            if len(password) != 0:
                if password_check(password, password2):
                    password_hash = str(md5(password.encode("utf-8")).hexdigest())
                    result.execute("UPDATE Users SET user_hashed_pwd = %s WHERE student_id = %s", (password_hash, id))
                else:
                    return '密碼不一致'
            db.commit() 
        else:
            return '請先登入'
    return '更新使用者資訊'

def password_check(password, password2):
    if password == password2:
        return True
    else:
        return False
