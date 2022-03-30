from flask import Flask
from flasgger import Swagger
from Form.form import form_bp

app = Flask(__name__)


# register blueprint
app.register_blueprint(form_bp)


# flasgger
swag = Swagger(app)


@app.route('/')
def index():
    return "home"


# run
if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)
