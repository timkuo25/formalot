from flask import Flask, jsonify
from Form.form import form_bp
from Member.member import members_bp
from Lottery.lottery import lottery_bp
from Homepage.homePage import homePage_bp
from Explore.exploreform import explore_bp
from datetime import timedelta
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token


app = Flask(__name__)


# register blueprint
app.register_blueprint(form_bp)
app.register_blueprint(members_bp)
app.register_blueprint(lottery_bp)
app.register_blueprint(homePage_bp)
app.register_blueprint(explore_bp)


# set JWT
app.config['JWT_SECRET_KEY'] = 'this-should-be-change'
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config['CORS_HEADERS'] = 'Content-Type'
jwt = JWTManager(app)


# set email
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'sdmg42022@gmail.com'
app.config['MAIL_PASSWORD'] = 'akiukmpmtqehjxnv'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True


# set CORS
CORS(app)


# set header after every request
@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    header['Access-Control-Allow-Methods'] = '*'
    header['Content-type'] = 'application/json'
    header['Cache-control'] = 'max-age=300'  # general content cache
    header['Access-Control-Max-Age'] = 30  # preflight response cache
    return response


# refresh token
@ app.route("/refresh", methods=["POST"])
@ jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(
        identity=identity, expires_delta=timedelta(minutes=120))
    # access_token = create_access_token(identity=identity, expires_delta = timedelta(seconds=10))
    return jsonify(access_token=access_token, message="success")
