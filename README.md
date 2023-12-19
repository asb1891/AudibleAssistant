![Example Image](images/diagram.jpg)


Audible Assistant
Introduction
Welcome to Audible Assistant, a cutting-edge full-stack application that brings the power of voice-activated technology to your fingertips. Leveraging OpenAI's advanced GPT-4 model, Audible Assistant transforms the way you interact with technology through speech.

Features
Speech Recognition: Utilizing Google's speech recognition to understand your spoken words.
Text to Speech: Bringing chatbot responses to life with audible speech.
OpenAI Chatbot: Powered by OpenAI's GPT-4 for smart, interactive conversations.
Requirements
Python 3.x
PyAudio
SpeechRecognition
gTTS (Google Text-to-Speech)
playsound
OpenAI Key
JavaScript/React
Flask
Socketio
Websockets
Threading
Time
Installation
Clone this repository or download the source code.
Ensure Python 3.x is installed.
Install required Python packages: pip install -r requirements.txt
Install JavaScript/React packages: npm install
Install Flask dependencies: pip install Flask
Configuration
Obtain an OpenAI API key from OpenAI. Set this key in keys.py as OPENAI_AUTH_TOKEN.

How to Use
Start the Python server: python3 main.py
Launch the React app: npm start
Run the Flask server: flask --app app.py --debug run -p 5500