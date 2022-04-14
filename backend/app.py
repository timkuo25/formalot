from flask import Flask
from flasgger import Swagger
from Form.form import form_bp
from Member.member import app_members
from Lottery.lottery import lottery_bp
from Homepage.homePage import homePage_bp
from datetime import timedelta
from flask_cors import CORS
from flask_jwt_extended import JWTManager


app = Flask(__name__)
# register blueprint
app.register_blueprint(form_bp)
app.register_blueprint(app_members)
app.register_blueprint(lottery_bp)
app.register_blueprint(homePage_bp)


# set JWT 
app.config['JWT_SECRET_KEY'] = 'this-should-be-change'
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config['CORS_HEADERS'] = 'Content-Type'
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
jwt = JWTManager(app)

# set email
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'sdmg42022@gmail.com'
app.config['MAIL_PASSWORD'] = 'sdm2022g4'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

# set CORS
CORS(app)


app.config.update(
    DEBUG=True,
)

# flasgger
swag = Swagger(app)


@app.route('/')
def index():
    return "home"


# if __name__ == "__main__":
#     app.run(host='127.0.0.1', debug=True)