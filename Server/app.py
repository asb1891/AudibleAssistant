from flask import Flask, request, make_response, jsonify
from flask_migrate import Migrate
from models import db, Prompts, Responses
from flask_cors import CORS
from flask_socketio import SocketIO
import threading
import sys 
from pathlib import Path 
sys.path.append(str(Path(__file__).resolve().parent.parent))
from main import AudioManager

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")  # Fixed typo

audio_manager = AudioManager(app)

DATABASE = "sqlite:///app.db"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
app.debug = True
migrate = Migrate(app, db)

db.init_app(app)

def start_recording():
    audio_manager.record_audio()
    # socketio.emit('recording_complete", {'data': 'Recording complete'})')

@socketio.on('start_recording')
def handle_start_recording(message):
    print("Received message to start recording: ", message)
    threading.Thread(target=start_recording).start()
    socketio.emit('message', {'data': 'Recording started'})


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
        return make_response(jsonify(new_prompt.to_dict()), 201)
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
        return make_response(jsonify(new_response.to_dict()), 201)
    except: 
        return make_response(jsonify({"error": "Could not add a new response"}), 400)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5500)