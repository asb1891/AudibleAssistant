import pyaudio
import asyncio
import websockets
import socket 
import os 
import speech_recognition as sr
import playsound
from gtts import gTTS 
from openai import OpenAI
import json
import threading

from keys import OPENAI_AUTH_TOKEN

file_path= os.path.join('/audio_files')
api_key = OPENAI_AUTH_TOKEN

client = OpenAI(api_key=api_key)


async def websocket_handler(websocket, path):
    origin = websocket.request_headers.get('Origin')
    if origin is not None and origin_allowed(origin):
        # If the origin is allowed, proceed with setting up the WebSocket connection
        app.set_websocket(websocket)
        async for message in websocket:
            if message == "start_recording":
                await app.start_recording()  # Assuming this is an async function
            # Add more commands as needed
    else:
        # If the origin is not allowed, close the connection
        await websocket.close()

def origin_allowed(origin):
    allowed_origins = ["http://localhost:3000"]  # Add other origins as needed
    return origin in allowed_origins

# Start WebSocket Server in a separate thread
def start_websocket_server():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    start_server = websockets.serve(websocket_handler, "localhost", 6789)
    loop.run_until_complete(start_server)
    loop.run_forever()

threading.Thread(target=start_websocket_server, daemon=True).start()

class AudioManager:
    def record_audio(self):
        recognizer = sr.Recognizer()
        with sr.Microphone(device_index=1) as source:
            # Adjust the recognizer sensitivity to ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = recognizer.listen(source)
        return audio
    
    @staticmethod
    def play_audio(file_path):
        playsound.playsound(file_path)

class SpeechRecognition:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def recognize_speech(self, audio):
        try:
            text = self.recognizer.recognize_google(audio)
            return text
        except Exception as e:
            print(f"Speech Recognition Error: {e}")
            return None
        
class TextToSpeech:
    def __init__(self, lang='en'):
        # Initialize the TextToSpeech with a language setting
        self.lang = lang
        # self.engine = pyttsx3.init()

    def text_to_speech(self, text, file_path):
        # Convert text to speech and save it as an audio file
        speech = gTTS(text=text, lang=self.lang, slow=False, tld="us")
        speech.save(file_path)

def save_to_json(new_data, file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []

    data.append(new_data)

    with open(file_path, 'w') as file:
        json.dump(data, file)

class OpenAIChatbot:
    def __init__(self, api_key):
        self.api_key = api_key
        self.websocket = None

    def set_websocket(self, websocket):
        self.websocket = websocket

    async def get_response(self, message):
        completion = client.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": message}])
        response_text = completion.choices[0].message.content
        if self.websocket:
            await self.websocket.send(response_text)
        save_to_json({"prompt": message, "response": response_text}, "response.json")
        return response_text


class OpenAIChatbot:
    def __init__(self, api_key):
        # Set the API key for OpenAI
        self.api_key = api_key
        
    def get_response(self, message):
        # Get a response from OpenAI's GPT-3 model
        completion = client.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": message}])
        response_text = completion.choices[0].message.content
        print(completion.choices[0].message.content)
        save_to_json({"prompt": message, "response": response_text}, "response.json")  # Save to JSON file
        return response_text
        return completion.choices[0].message.content
    
class MainApplication:
    def __init__(self, api_key):
        self.audio_manager = AudioManager()
        self.speech_recognition = SpeechRecognition()
        self.text_to_speech = TextToSpeech()
        self.chatbot = OpenAIChatbot(api_key)
        self.websocket = None

    def set_websocket(self, websocket):
        self.websocket = websocket
        self.chatbot.set_websocket(websocket)

    async def handle_recording_process(self):
        audio = self.audio_manager.record_audio()
        said = self.speech_recognition.recognize_speech(audio)

        if said is not None:
            print("User said:", said)
            response = await self.chatbot.get_response(said)
            if response:
                print("OpenAI responded:", response)
                self.text_to_speech.text_to_speech(response, "response.mp3")
                self.audio_manager.play_audio("response.mp3")
                if self.websocket:
                    await self.websocket.send(response)
        else:
            print("No speech recognized or an error occurred.")

    def run(self):
        while True:
            audio = self.audio_manager.record_audio()
            said = self.speech_recognition.recognize_speech(audio)

            if said:
                print(said)
                trigger = "question"
                if trigger in said:
                    response = self.chatbot.get_response(said)
                    self.text_to_speech.text_to_speech(response, "response.mp3")
                    self.audio_manager.play_audio("response.mp3")

                if "stop" in said:
                    break

# class MainApplication:
#     def __init__(self, api_key):
#         self.audio_manager = AudioManager()
#         self.speech_recognition = SpeechRecognition()
#         self.text_to_speech = TextToSpeech()
#         self.chatbot = OpenAIChatbot(api_key)
#         self.websocket = None

#     def set_websocket(self, websocket):
#         self.websocket = websocket
#         self.chatbot.set_websocket(websocket)

#     async def handle_recording_process(self):
#         audio = self.audio_manager.record_audio()
#         said = self.speech_recognition.recognize_speech(audio)

#         if said is not None:
#             print("User said:", said)
#             response = await self.chatbot.get_response(said)
#             if response:
#                 print("OpenAI responded:", response)
#                 self.text_to_speech.text_to_speech(response, "response.mp3")
#                 self.audio_manager.play_audio("response.mp3")
#                 if self.websocket:
#                     await self.websocket.send(response)
#         else:
#             print("No speech recognized or an error occurred.")

# class MainApplication:
#     def __init__(self, api_key):
#         # Initialize all components of the application
#         self.audio_manager = AudioManager()
#         self.speech_recognition = SpeechRecognition()
#         self.text_to_speech = TextToSpeech()
#         self.chatbot = OpenAIChatbot(api_key)

#     def run(self):
#         # Main loop of the application
#         while True:
#             audio = self.audio_manager.record_audio()
#             said = self.speech_recognition.recognize_speech(audio)

#             if said:
#                 print(said)
#                 # Check for specific keywords in the recognized text
#                 trigger = "question"
#                 if trigger in said:
#                     # Get a response from the chatbot
#                     response = self.chatbot.get_response(said)
#                     # Convert the response to speech
#                     self.text_to_speech.text_to_speech(response, "response.mp3")
#                     # Play the response
#                     self.audio_manager.play_audio("response.mp3")

#                 if "stop" in said:
#                     break  # Exit the loop if 'stop' is said

if __name__ == "__main__":
    print("Starting the application...")
    api_key = OPENAI_AUTH_TOKEN # Replace with your actual API key
    app = MainApplication(api_key)
    app.run()  # Run the main application
