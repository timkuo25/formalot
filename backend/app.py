from flask import Flask, render_template
from flasgger import Swagger
from Form.form import form_bp
from Member.member import app_members
from Lottery.lottery import lottery_bp
from datetime import timedelta
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.secret_key = "Your Key"
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)


# register blueprint
app.register_blueprint(form_bp)
app.register_blueprint(app_members)
app.register_blueprint(lottery_bp)

# flasgger
swag = Swagger(app)


@app.route('/')
def index():
    return "home"


# if __name__ == "__main__":
#     app.run(host='127.0.0.1', debug=True)