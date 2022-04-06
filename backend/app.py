from flask import Flask, render_template
from flasgger import Swagger
from Form.form import form_bp
from Member.member import app_members
from datetime import timedelta

app = Flask(__name__)
app.secret_key = "Your Key"
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)


# register blueprint
app.register_blueprint(form_bp)
app.register_blueprint(app_members)


# flasgger
swag = Swagger(app)


@app.route('/')
def index():
    return "home"

# @app.route('/', methods=['GET'])
# def index():
#         return render_template('index.html')
