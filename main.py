import pyaudio
import asyncio
import websockets
import socket 
import os 
import speech_recognition as sr
import playsound
from gtts import gTTS 
import openai 
import json
import threading
import logging

from keys import OPENAI_AUTH_TOKEN
openai.api_key = OPENAI_AUTH_TOKEN

file_path= os.path.join('/audio_files')


client = OPENAI_AUTH_TOKEN


async def websocket_handler(websocket, path):
    try:
        origin = websocket.request_headers.get('Origin')
        if origin is not None and origin_allowed(origin):
            app.set_websocket(websocket)
            async for message in websocket:
                if message == "start_recording":
                    print("Starting recording...")
                    await app.start_recording() 
                # Add more commands as needed
        else:
            await websocket.close()
    except Exception as e:
        logging.error(f"WebSocket error: {e}")
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
        with sr.Microphone() as source:
            print(source)
            # Adjust the recognizer sensitivity to ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = recognizer.listen(source)
            print("Listening...")
        return audio
    
    @staticmethod
    def play_audio(file_path):
        playsound.playsound(file_path)

class SpeechRecognition:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def recognize_speech(self, audio):
        try:
            print("Recognizing...")
            text = self.recognizer.recognize_google(audio)
            return text
        except Exception as e:
            print(f"Speech Recognition Error: {e}")
            return None
        
class TextToSpeech:
    def __init__(self, lang='en'):
        # Initialize the TextToSpeech with a language setting
        self.lang = lang

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
    def __init__(self, OPENAI_AUTH_TOKEN):
        self.api_key = OPENAI_AUTH_TOKEN
        self.websocket = None

    def set_websocket(self, websocket):
        self.websocket = websocket

    async def get_response(self, message):
        # Use the openai module directly for API calls
        completion = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "talk to me like I am a three-year-old child"},
                {"role": "user", "content": message}
            ]
        )
        response_text = completion.choices[0].message.content

        formatted_message = f"PROMPT: {message}\nRESPONSE: {response_text}"

        if self.websocket:
            print("Sending formattedd message:", formatted_message)
            await self.websocket.send(formatted_message)

        combined_message = {"prompt": message, "response": response_text}
        save_to_json(combined_message, "response.json")
        return response_text 

    
class MainApplication:
    def __init__(self, OPENAI_AUTH_TOKEN):
        self.audio_manager = AudioManager()
        self.speech_recognition = SpeechRecognition()
        self.text_to_speech = TextToSpeech()
        self.chatbot = OpenAIChatbot(OPENAI_AUTH_TOKEN)
        self.websocket = None

    def set_websocket(self, websocket):
        self.websocket = websocket
        self.chatbot.set_websocket(websocket)

    async def start_recording(self):
        try:
            audio = self.audio_manager.record_audio()
            said = self.speech_recognition.recognize_speech(audio)

            if said is not None:
                logging.info(f"User said: {said}")
                response = await self.chatbot.get_response(said)
                if response:
                    logging.info(f"OpenAI responded: {response}")
                    self.text_to_speech.text_to_speech(response, "response.mp3")
                    self.audio_manager.play_audio("response.mp3")
                    if self.websocket:
                        await self.websocket.send(response)
            else:
                logging.warning("No speech recognized or an error occurred.")
        except Exception as e:
            logging.error(f"Error during recording: {e}")

    async def run(self):  # Make this an async method
        while True:
            audio = self.audio_manager.record_audio()
            said = self.speech_recognition.recognize_speech(audio)

            if said:
                logging.info(f"User said: {said}")
                trigger = "question"
                if trigger in said:
                    response = await self.chatbot.get_response(said)  # Await the async method
                    self.text_to_speech.text_to_speech(response, "response.mp3")
                    self.audio_manager.play_audio("response.mp3")

                if "stop" in said:
                    break
if __name__ == "__main__":
    logging.info("Starting the application...")
    app = MainApplication(OPENAI_AUTH_TOKEN)
    asyncio.run(app.run())
