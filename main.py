import pyaudio
import os 
import speech_recognition as sr
import playsound
from gtts import gTTS 
import openai

file_path= os.path.join('audio_files')
api_key = "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"

class AudioManager:
    def record_audio(self):
        # Initialize a recognizer for speech recognition
        recognizer = sr.Recognizer()
        # Use the microphone as the source of audio input
        with sr.Microphone(device_index=1) as source:
            # Listen to the source and record the audio
            audio = recognizer.listen(source)
        return audio  # Return the recorded audio

    @staticmethod
    def play_audio(file_path):
        # Play an audio file from a given path
        playsound.playsound(file_path)

class SpeechRecognition:
    def __init__(self):
        # Initialize a speech recognizer
        self.recognizer = sr.Recognizer()

    def recognize_speech(self, audio):
        # Convert the audio to text using Google's speech recognition
        try:
            text = self.recognizer.recognize_google(audio)
            return text
        except Exception as e:
            # Handle exceptions and print an error message
            print(f"Speech Recognition Error: {e}")
            return None

class TextToSpeech:
    def __init__(self, lang='en'):
        # Initialize the TextToSpeech with a language setting
        self.lang = lang

    def text_to_speech(self, text, file_path):
        # Convert text to speech and save it as an audio file
        speech = gTTS(text=text, lang=self.lang, slow=False, tld="com.au")
        speech.save(file_path)

class OpenAIChatbot:
    def __init__(self, api_key):
        # Set the API key for OpenAI
        openai.api_key = api_key

    def get_response(self, message):
        # Get a response from OpenAI's GPT-3 model
        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": message}])
        return completion.choices[0].message.content

class MainApplication:
    def __init__(self, api_key):
        # Initialize all components of the application
        self.audio_manager = AudioManager()
        self.speech_recognition = SpeechRecognition()
        self.text_to_speech = TextToSpeech()
        self.chatbot = OpenAIChatbot(api_key)

    def run(self):
        # Main loop of the application
        while True:
            audio = self.audio_manager.record_audio()
            said = self.speech_recognition.recognize_speech(audio)

            if said:
                print(said)
                # Check for specific keywords in the recognized text
                if "Banana" in said:
                    # Get a response from the chatbot
                    response = self.chatbot.get_response(said)
                    # Convert the response to speech
                    self.text_to_speech.text_to_speech(response, "response.mp3")
                    # Play the response
                    self.audio_manager.play_audio("response.mp3")

                if "stop" in said:
                    break  # Exit the loop if 'stop' is said

if __name__ == "__main__":
    api_key = "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"  # Replace with your actual API key
    app = MainApplication(api_key)
    app.run()  # Run the main application
