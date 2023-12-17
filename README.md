![Example Image](images/diagram.jpg)


Audible Assistant

Description:

This full stack application integrates various components to create a voice-activated chatbot. It uses speech recognition to interpret spoken input, converts text to speech for audible responses, and leverages the OpenAI GPT-4 model for intelligent and interactive conversation. The application provides an interactive experience where users can speak to the application and receive spoken responses from the chatbot.

Features:

- Speech Recognition: Converts spoken words into text using Google's speech recognition.
- Text to Speech: Converts chatbot responses into spoken words.
- OpenAI Chatbot: Integrates with OpenAI's GPT-4 model to generate conversational responses.

Requirements:

    * Python 3.x
    * PyAudio
    * SpeechRecognition
    * gTTS (Google Text-to-Speech)
    * playsound
    * OpenAI Key 
    * JavaScript/React 
    * Flask 
    * Socketio
    * Websockets
    * Threading
    * Time

Installation:

Clone this repository or download the source code.

Ensure Python 3.x is installed on your system.

Install required Python packages in bash terminal

Install required Javascript/React packages in bash terminal

Install required Flask dependencies in bash terminal


Configuration:

Obtain an API key from OpenAI and set it in the keys.py file as OPENAI_AUTH_TOKEN.

How to use: 

Once all required dependencies are installed,

Run 'python3 main.py' in Python terminal
Run 'npm start' in React terminal
Run 'flask --app app.py --debug run -p 5500' in Flask terminal


