import requests

class Speech2Text2Transcriber:
    def __init__(self):
        self.api_url = 'http://localhost:8082/transcribe_speech'

    def generate_transcription(self, wav_io):
        print("Sending audio for transcription...")
        files = {'audio': ('audio.wav', wav_io, 'audio/wav')}
        response = requests.post(self.api_url, files=files)

        if response.status_code == 200:
            print("Request was successful.")
            transcription = response.json().get('transcription', '')
            print("Transcription: ", transcription)
            return transcription
        else:
            print(f"Request failed with status code {response.status_code}.")
            return {"error": f"Request failed with status code {response.status_code}."}