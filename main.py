import pyaudio  # Imports the PyAudio library for handling audio input/output
import asyncio  # Imports the asyncio library for asynchronous programming
import websockets  # Imports the websockets library for WebSocket support
import socket  # Imports the socket library for network connections
import os  # Imports the os library for interacting with the operating system
import speech_recognition as sr  # Imports the speech_recognition library for speech-to-text conversion
import playsound  # Imports the playsound library for playing audio files
from gtts import gTTS  # Imports the Google Text-to-Speech (gTTS) library for text-to-speech conversion
import openai  # Imports the OpenAI library for interacting with OpenAI's APIs
import json  # Imports the json library for JSON parsing and encoding
import threading  # Imports the threading library for concurrent execution
import logging  # Imports the logging library for logging
from keys import OPENAI_AUTH_TOKEN  # Imports the OpenAI authentication token from a separate keys module
import time
from websockets.legacy.protocol import State

openai.api_key = OPENAI_AUTH_TOKEN  # Sets the OpenAI API key for authentication

file_path = os.path.join("response.mp3")  # Defines the file path for saving audio responses
client = OPENAI_AUTH_TOKEN  # Sets the client variable to the OpenAI authentication token

# Define an asynchronous function to handle WebSocket connections and interactions
async def websocket_handler(websocket, path):
    try:
        origin = websocket.request_headers.get('Origin')  # Gets the origin of the WebSocket request
        if origin is not None and origin_allowed(origin):  # Checks if the origin is allowed
            app.set_start_websocket(websocket)  # Sets the WebSocket connection in the application
            async for message in websocket:  # Iterates over incoming messages asynchronously
                print(f"\nRECEIVED MESSAGE: {message}\n")
                if message == "start_recording":  # Checks if the message is to start recording
                    print("Starting recording...")
                    await app.start_recording()  # Starts audio recording
                    await app.handle_speech_interaction()  # Handles the speech interaction
                    print("Recording complete.")
                    continue
                
        else:
            await websocket.close()  # Closes the WebSocket connection if the origin is not allowed
    except Exception as e:
        if websocket.state == State.OPEN:
            await websocket.close()  # Closes the WebSocket connection on exception

async def second_websocket_handler(websocket, path):
    try: 
        origin = websocket.request_headers.get('Origin')
        if origin is not None and origin_allowed(origin):
            app.set_stop_websocket(websocket)
            async for message in websocket:
                print(f"\nRECEIVED MESSAGE: {message}\n")
                if message == "stop_recording":
                    print("Stopping recording...")
                    await app.stop_recording()
                elif message == "start_recording":
                    await app.start_recording()
                    await app.handle_speech_interaction()
    except Exception as e:
        if websocket.state == State.OPEN:
            await websocket.close()


# Define a function to check if the origin of the WebSocket request is allowed
def origin_allowed(origin):
    allowed_origins = ["http://localhost:3000"]  # List of allowed origins
    return origin in allowed_origins  # Returns True if the origin is in the allowed list

# Define a function to start the WebSocket server in a separate thread
def start_websocket_server():
    loop = asyncio.new_event_loop()  # Creates a new asyncio event loop
    asyncio.set_event_loop(loop)  # Sets the created event loop as the current loop
    start_server = websockets.serve(websocket_handler, "localhost", 6789)  # Starts the WebSocket server
    loop.run_until_complete(start_server)  # Runs the server until it is complete
    loop.run_forever()  # Runs the event loop forever

def start_second_websocket_server():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    start_second_server = websockets.serve(second_websocket_handler, "localhost", 5678)
    loop.run_until_complete(start_second_server)
    loop.run_forever()
class AudioManager:
    def __init__(self, main_app):
        # Initialize the AudioManager instance with default values.
        self.is_recording = False  # A flag to indicate whether recording is ongoing.
        self.audio = None          # Variable to store the recorded audio.
        self.recognizer = sr.Recognizer()  # Creates a Recognizer instance for speech recognition
        self.main_app = main_app  # Stores the reference to the main application
    
    # Define a method to handle the speech interaction.
    # Define a method to start audio recording.
    async def start_recording(self):
        self.is_recording = True  # Sets the recording flag to True
        last_speech_time = time.time()  # Initialize the last speech time

        with sr.Microphone() as source:  # Opens the microphone as the audio source
            print("Adjusting for ambient noise...")
            self.recognizer.adjust_for_ambient_noise(source)  # Adjusts the recognizer sensitivity to ambient noise

            while self.is_recording:  # Continuously records audio while the flag is True
                try:
                    print("Listening...")
                    audio = self.recognizer.listen(source, timeout=5)  # Listens to the source for 5 seconds
                    print("Audio captured successfully.")

                    recognized_text = self.recognize_speech(audio)  # Converts the audio to text

                    if recognized_text:
                        print("Recognized text:", recognized_text)
                        # Reset the last speech time on recognizing speech
                        last_speech_time = time.time()

                        # Here, send the recognized text to OpenAI and handle the response
                        await self.main_app.handle_speech_interaction(recognized_text)  # Handles the interaction based on recognized text
                        print("done handle speech ")

                    # Check if the time since the last speech exceeds 60 seconds (1 minute)
                    if time.time() - last_speech_time > 45:
                        print("No speech detected for 45 seconds, stopping recording.")
                        self.is_recording = False  # Stop recording

                except sr.WaitTimeoutError:
                    print("No audio detected within the timeout. Still listening...")
                except Exception as e:
                    print(f"An error occurred: {e}")

        print("Recording stopped.")

    def stop_recording(self):
        # Set the 'is_recording' flag to False, which will end the recording loop.
        self.is_recording = False
    # Define a method to recognize speech from audio.
    def recognize_speech(self, audio):
        try:
            print("Recognizing...")
            text = self.recognizer.recognize_google(audio)  # Uses Google's speech recognition to convert audio to text
            
            return text  # Returns the recognized text
        except Exception as e:
            print(f"Speech Recognition Error: {e}")
            return None  # Returns None if speech recognition fails

    def record_audio(self):
        with sr.Microphone() as source:  # Opens the microphone as the audio source
            print("Adjusting for ambient noise...")
            self.recognizer.adjust_for_ambient_noise(source, duration=1)  # Adjusts the recognizer sensitivity to ambient noise for 1 second
            print("Listening...")
            audio = self.recognizer.listen(source)  # Listens to the source
            return audio  # Returns the captured audio

    @staticmethod
    def play_audio(file_path):
        try:
            print(f"Attempting to play audio from {file_path}")
            playsound.playsound(file_path)  # Plays the audio file located at the specified file path
        except Exception as e:
            print(f"Error in playing audio: {e}")  # Logs an error message if audio playback fails
        
class TextToSpeech:
    def __init__(self, lang='en'):
        # Initialize the TextToSpeech with a language setting
        self.lang = lang  # Sets the language for text-to-speech conversion

    def text_to_speech(self, text, file_path):
        try:
            speech = gTTS(text=text, lang=self.lang, slow=False, tld="us")  # Converts the text to speech using gTTS
            speech.save(file_path)  # Saves the speech audio to the specified file path
            print(f"Audio file saved at {file_path}")
        except Exception as e:
            print(f"Error in saving audio file: {e}")  # Logs an error message if saving the audio file fails

def save_to_json(new_data, file_path):
    try:
        with open(file_path, 'r') as file:  # Opens the file in read mode
            data = json.load(file)  # Loads the existing data from the file
    except (FileNotFoundError, json.JSONDecodeError):
        data = []  # Initializes an empty list if the file is not found or if there's a JSON decode error

    data.append(new_data)  # Appends the new data to the existing data

    with open(file_path, 'w') as file:  # Opens the file in write mode
        json.dump(data, file)  # Writes the updated data back to the file

class OpenAIChatbot:
    def __init__(self, OPENAI_AUTH_TOKEN):
        self.api_key = OPENAI_AUTH_TOKEN  # Sets the API key for OpenAI
        self.websocket = None  # Initializes the WebSocket connection as None

    def set_start_websocket(self, websocket):
        self.websocket = websocket  # Sets the WebSocket connection

    async def get_response(self, message):
        completion = await asyncio.to_thread(
                openai.ChatCompletion.create,
                model="gpt-4",
                messages=[{"role": "system", "content": ""}, {"role": "user", "content": message}])  # Sends the message to OpenAI and gets a response
        
        response_text = completion.choices[0].message.content  # Extracts the content of the response
        # formatted_message = f"PROMPT: {message}\nRESPONSE: {response_text}"
        combined_message = {"prompt": message, "response": response_text}  # Combines the prompt and response into a single message
        save_to_json(combined_message, "response.json")  # Saves the combined message to a JSON file
        return response_text  # Returns the response text
class MainApplication:
    def __init__(self, OPENAI_AUTH_TOKEN):
        # Initialize the MainApplication with necessary components.
        self.audio_manager = AudioManager(self)  # Manage audio recording and processing.
        self.text_to_speech = TextToSpeech()     # Handle text-to-speech conversion.
        self.chatbot = OpenAIChatbot(OPENAI_AUTH_TOKEN)  # Set up the chatbot with OpenAI token.
        self.start_websocket = None    
        self.stop_websocket = None             # Initialize websocket to None.

    def set_start_websocket(self, websocket):
        # Set and share the WebSocket connection.
        self.start_websocket = websocket
        self.chatbot.set_start_websocket(websocket)
        
    def set_stop_websocket(self, websocket):
        self.stop_websocket = websocket 

    async def start_recording(self):
        # Start recording audio.
        await self.audio_manager.start_recording()  # Trigger the audio recording process.

    async def stop_recording(self):
        # Stop the ongoing audio recording.
        await self.audio_manager.stop_recording()         # Stop the audio recording process.

    async def handle_speech_interaction(self, recognized_text):
        # Handle interaction after speech is recognized.
        if recognized_text:
            # If there is recognized text, process it.
            response = await self.chatbot.get_response(recognized_text)  # Get response from chatbot.

            if response:
                # If a response is received, prepare and send it.
                full_message = f"PROMPT: {recognized_text}\nRESPONSE: {response}"  # Format message.
                if self.start_websocket and not self.start_websocket.closed:
                    await self.start_websocket.send(full_message)  # Send the message over the websocket.

                # Convert the response to speech and play it.
                self.text_to_speech.text_to_speech(response, "response.mp3")  # Convert text to speech.
                self.audio_manager.play_audio("response.mp3")  # Play the converted speech.
        else:
            print("No speech recognized")  # Log if no speech was recognized.

    async def run(self):
        # Run the main application.
        print("MainApplication is running. Waiting for WebSocket connections...")  # Log the running status.

async def main_loop():
    # Define the main loop of the application.
    try:
        while True:
            await asyncio.sleep(1)  # Keep the loop running.
    except KeyboardInterrupt:
        print("Application terminated by user")  # Handle user interruption.

import threading

if __name__ == "__main__":
    # Start the application if this script is the main program.
    app = MainApplication(OPENAI_AUTH_TOKEN)  # Instantiate the main application.

    # Start the first websocket server in a thread
    threading.Thread(target=start_websocket_server, daemon=True).start()

    # Start the second websocket server in a different thread
    threading.Thread(target=start_second_websocket_server, daemon=True).start()

    asyncio.run(main_loop())  # Run the asyncio main loop.
