from flask import Flask, request, make_response, jsonify, render_template
import os
from flask_migrate import Migrate
from models import db, Prompts, Responses
from flask_cors import CORS

# run this command to start flask server "flask --app app.py --debug run -p 5500"

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


DATABASE = "sqlite:///app.db"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
app.debug = True
migrate = Migrate(app, db)

db.init_app(app)

#HOME PAGE ROUTE 
@app.route('/', methods=['GET'])
def home():
    return {"message:": "Welcome to Audible Assistant"}

#GET ROUTE TO GET ALL PROMPTS
@app.route('/prompts', methods=['GET'])
def get_prompts():
    prompts = Prompts.query.all()
    data = [prompts.to_dict() for prompts in prompts]

    return make_response(jsonify(data), 200)

#POST ROUTE TO ADD A NEW PROMPT
@app.route('/prompts', methods=['POST'])
def add_new_prompt():
    try: 
        new_prompt = Prompts(
            prompt_question=request.json['prompt_question']
        )
        db.session.add(new_prompt)
        db.session.commit()
        return make_response(jsonify(new_prompt.do_dict()), 201)
    except: 
        return make_response(jsonify({"error": "Could not add a new prompt"}), 400)

#GET ROUTE TO GET ALL RESPONSES
@app.route('/responses', methods=['GET'])
def get_responses():
    responses = Responses.query.all()
    data = [responses.to_dict() for responses in responses]

    return make_response(jsonify(data), 200)

#POST ROUTE TO ADD A NEW RESPONSE
@app.route('/responses', methods=['POST'])
def add_new_response():
    try: 
        new_response = Responses(
            response_answer=request.json['response_answer']
        )
        db.session.add(new_response)
        db.session.commit()
        return make_response(jsonify(new_response.do_dict()), 201)
    except: 
        return make_response(jsonify({"error": "Could not add a new response"}), 400)

if __name__ == '__main__':
    app.run(port=5500)