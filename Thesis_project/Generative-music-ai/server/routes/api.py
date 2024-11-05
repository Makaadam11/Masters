from flask import Flask, request, jsonify, Blueprint, send_from_directory
from flask_cors import CORS, cross_origin
from google.cloud import storage
from werkzeug.utils import secure_filename
from models.mistralai import MistralAI
from models.deepface import DeepFaceModel
from models.speech2text import Speech2Text2Transcriber
from models.basicpitch import BasicPitch
from models.musicgen import MusicGen
from collections import defaultdict
from uuid import uuid4
import shutil
from datetime import datetime
import tempfile
import requests
import threading
import pyautogui
import numpy as np
import pandas as pd
import base64
import time
import cv2
from pydub import AudioSegment
import os
import io

api = Blueprint('api', __name__)
CORS(api, origins=["http://localhost:3000"], supports_credentials=True)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'C:\\5.ComputionalEnt\\generative-music-ai\\server\\secrets\\musicgen.json'

BUCKET_NAME = 'musicgen-songs'

@api.route('/generate_text', methods=['POST'])
@cross_origin()
def generate_text():
    text = request.json.get('text')
    print("generate_text description on server api: ", text)
    mistralai_model = MistralAI()
    response = mistralai_model.generate_text(text)
    return jsonify({"response": response}), 200

@api.route('/analyze_face', methods=['POST'])
@cross_origin()
def analyze_face():
    data = request.get_json()
    base64_image = data['image'].split(',')[1]
    decoded_image = base64.b64decode(base64_image)
    nparr = np.frombuffer(decoded_image, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    model = DeepFaceModel()
    response = model.process_frame(frame)

    return jsonify({"response": response}), 200

@api.route('/transcribe_speech', methods=['POST'])
@cross_origin()
def transcribe_speech():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file in request"}), 400
    audio_file = request.files['audio']
    try:
        audio = AudioSegment.from_file(audio_file, format="webm")
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav", parameters=["-ac", "1", "-ar", "16000"])  # Mono channel, 16000Hz
        wav_io.seek(0) 

        s2t2_model = Speech2Text2Transcriber()
        transcription = s2t2_model.generate_transcription(wav_io)

        if transcription is None or "error" in transcription:
            error_message = transcription.get("error", "Unknown error")
            print("Error transcription: ", error_message)
            return jsonify({"error": error_message}), 500

        return jsonify({"transcription": transcription}), 200
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

duration = 30

@api.route('/set_duration', methods=['POST'])
@cross_origin()
def set_duration():
    global duration
    data = request.get_json()
    new_duration = data.get('duration')
    
    if new_duration not in [30, 60, 120, 180, 300]:
        return jsonify({"error": "Invalid duration value"}), 400

    duration = new_duration
    return jsonify({"message": f"Duration set to {duration} seconds"}), 200

@api.route('/generate_with_description', methods=['POST'])
@cross_origin()
def generate_with_description():
    description = request.json.get('description')
    music_gen = MusicGen()
    song_url = music_gen.generate_music(duration,description)
    print("song_url: ", song_url)
    return jsonify({"songUrl": song_url}), 200


def upload_to_gcs(file, filename):
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_file(file)
    blob.make_public()
    return blob.public_url, blob.name

def delete_from_gcs(blob_name):
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)
    blob.delete()

@api.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Generate a unique filename using UUID
    unique_id = uuid4()
    original_filename = secure_filename(file.filename)
    filename, file_extension = original_filename.rsplit('.', 1) if '.' in original_filename else (original_filename, '')
    unique_filename = f"{filename}_{unique_id}.{file_extension}" if file_extension else f"{filename}_{unique_id}"

    file_url, blob_name = upload_to_gcs(file, unique_filename)
    return jsonify({"file_url": file_url, "blob_name": blob_name}), 200


@api.route('/generate_with_audio', methods=['POST'])
def generate_from_audio():
    data = request.get_json()
    if not data or 'audioLink' not in data or 'blobName' not in data:
        return jsonify({"error": "No audio link or blob name provided"}), 400

    audio_link = data['audioLink']
    blob_name = data['blobName']
    print("audio_link: ", audio_link)
    print("blob_name: ", blob_name)

    temp_audio_path = None
    clean_melody_path = None

    try:
        print("Initializing GCS client...")
        client = storage.Client()
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(blob_name)

        if not blob.exists(client):
            print("File not found in GCS")
            return jsonify({"error": "File not found in GCS"}), 404

        temp_audio_path = "audio.wav"
        print(f"Downloading audio to temporary file: {temp_audio_path}")
        blob.download_to_filename(temp_audio_path)

        basic_pitch = BasicPitch()
        print("BasicPitch object created")
        clean_melody_path = basic_pitch.transcribe_audio(temp_audio_path)
        print("Audio transcription completed", clean_melody_path)

        with open(clean_melody_path, 'rb') as clean_melody_file:
            clean_melody_url, clean_melody_blob_name = upload_to_gcs(clean_melody_file, f"clean_melody.wav")

        print("Generating music using the clean melody...")
        music_gen = MusicGen()
        generated_music_url = music_gen.generate_music(duration, "melodic song", clean_melody_url)
        print(f"Generated music URL: {generated_music_url}")

        return jsonify({"songUrl": generated_music_url}), 200
    except Exception as e:
        print(f"Error in generate_from_audio: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        print("Cleaning up temporary files...")
        if 'clean_melody_blob_name' in locals():
            delete_from_gcs(clean_melody_blob_name)
        if 'temp_audio_path' in locals() and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        if 'clean_melody_path' in locals() and os.path.exists(clean_melody_path):
            os.remove(clean_melody_path)


@api.route('/generate_with_multi', methods=['POST'])
@cross_origin()
def generate_with_multi():
    data = request.get_json()
    if not data or 'description' not in data or 'audioLink' not in data or 'blobName' not in data:
        return jsonify({"error": "No description, audio link, or blob name provided"}), 400

    description = data['description']
    audio_link = data['audioLink']
    blob_name = data['blobName']
    print("audio_link: ", audio_link)
    print("description: ", description)

    temp_audio_path = None
    clean_melody_path = None

    try:
        print("Initializing GCS client...")
        client = storage.Client()
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(blob_name)

        if not blob.exists(client):
            print("File not found in GCS")
            return jsonify({"error": "File not found in GCS"}), 404

        temp_audio_path = "audio.wav"
        print(f"Downloading audio to temporary file: {temp_audio_path}")
        blob.download_to_filename(temp_audio_path)

        basic_pitch = BasicPitch()
        print("BasicPitch object created")
        clean_melody_path = basic_pitch.transcribe_audio(temp_audio_path)
        print("Audio transcription completed", clean_melody_path)
        
        with open(clean_melody_path, 'rb') as clean_melody_file:
            clean_melody_url, clean_melody_blob_name = upload_to_gcs(clean_melody_file, f"clean_melody.wav")

        print("Generating music using the clean melody...")
        music_gen = MusicGen()
        generated_music_url = music_gen.generate_music(duration, description, clean_melody_url)
        print(f"Generated music URL: {generated_music_url}")

        return jsonify({"songUrl": generated_music_url}), 200
    except Exception as e:
        print(f"Error in generate_with_multi: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        print("Cleaning up temporary files...")
        if 'clean_melody_blob_name' in locals():
            delete_from_gcs(clean_melody_blob_name)
        if 'temp_audio_path' in locals() and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        if 'clean_melody_path' in locals() and os.path.exists(clean_melody_path):
            os.remove(clean_melody_path)


recording = False
frames = []
event_log = defaultdict(list)
combined_log = defaultdict(dict)
start_time = None
last_two_logged_interactions = []
isCapturing = False

def record_screen(duration, interval):
    global recording, frames, event_log, start_time
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return
    
    start_time = time.time()

    while recording and (time.time() - start_time) < duration:
        ret, frame = cap.read()
        if (ret and (not isCapturing)):
            try:
                timestamp = round(time.time() - start_time, 2)
                frames.append((timestamp, frame))
                model = DeepFaceModel()
                emotion_result = model.process_frame(frame)
                emotion = emotion_result[0]['emotion']
                
                event_log[timestamp].append({
                    "happy": emotion['happy'],
                    "neutral": emotion['neutral'],
                    "surprise": emotion['surprise'],
                    "sad": emotion['sad'],
                    "angry": emotion['angry'],
                    "fear": emotion['fear'],
                    "disgust": emotion['disgust']
                })
                # print("timestamp: ", timestamp, "Evennt_log", event_log[timestamp])
            except Exception as e:
                print(f"Error processing frame: {e}")
        else:
            print("Error: Could not read frame.")
            break
        time.sleep(interval)
    cap.release()

@api.route('/start_screen_recording', methods=['POST'])
@cross_origin()
def start_screen_recording():
    global recording, frames, event_log, start_time
    recording = True
    frames = []
    event_log = defaultdict(list)
    start_time = time.time()
    interval = 0.15
    threading.Thread(target=record_screen, args=(1800, interval)).start()
    return jsonify({"message": "Screen recording started"}), 200

@api.route('/stop_screen_recording', methods=['POST'])
@cross_origin()
def stop_screen_recording():
    global recording, event_log, frames, combined_log
    recording = False

    for timestamp in event_log.keys():
        emotions = next((item for item in event_log[timestamp] if "happy" in item), {})
        interaction = next((item for item in event_log[timestamp] if "type" in item), {})
        
        combined_log[timestamp] = {
            "emotions": emotions,
            "interaction": interaction
        }
        # print("\n\ntimestamp: ", timestamp, "Combined_log", combined_log[timestamp])

    save_to_excel(combined_log)
    return jsonify({"message": "Screen recording stopped"}), 200

@api.route('/log_interaction', methods=['POST'])
@cross_origin()
def log_interaction():
    global event_log, start_time, last_two_logged_interactions
    interaction_data = request.json.get('interaction')
    if start_time is None:
        start_time = time.time()
        
    timestamp = round(time.time() - start_time, 2)
    
    # print(f"Interaction logged: {interaction_data} at timestamp {timestamp}")
    
    # Check if the new interaction is the same as the last two logged interactions
    if len(last_two_logged_interactions) == 2:
        last_interaction = last_two_logged_interactions[-1]
        second_last_interaction = last_two_logged_interactions[-2]
        
        if (interaction_data.get('type', '') == last_interaction.get('type', '') == second_last_interaction.get('type', '') and
            interaction_data.get('url', '') == last_interaction.get('url', '') == second_last_interaction.get('url', '')):
            print("Duplicate interaction detected, not logging.")
            return jsonify({"message": "Duplicate interaction, not logged"}), 200
    
    event_log[timestamp].append(interaction_data)
    
    # Update the last two logged interactions
    last_two_logged_interactions.append(interaction_data)
    if len(last_two_logged_interactions) > 2:
        last_two_logged_interactions.pop(0)
    
    # print(f"Current event_log: {event_log}")
    
    return jsonify({"message": "Interaction logged"}), 200

def save_to_excel(combined_log):
    current_time = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'sessions_data/interactions_and_emotions_{current_time}.xlsx'
    
    data = []
    for timestamp, log_entry in combined_log.items():
        row = {
            'timestamp': timestamp,
            'happy': log_entry['emotions'].get('happy', ''),
            'neutral': log_entry['emotions'].get('neutral', ''),
            'surprise': log_entry['emotions'].get('surprise', ''),
            'sad': log_entry['emotions'].get('sad', ''),
            'angry': log_entry['emotions'].get('angry', ''),
            'fear': log_entry['emotions'].get('fear', ''),
            'disgust': log_entry['emotions'].get('disgust', ''),
            'interaction_type': log_entry['interaction'].get('type', ''),
            'interaction_element': log_entry['interaction'].get('element', ''),
            'url': log_entry['interaction'].get('url', '').replace('http://localhost:3000', ''),
        }
        data.append(row)
    
    df = pd.DataFrame(data)
    df.to_excel(filename, index=False)
    print(f"Excel file saved: {filename}")

@api.route('/start_capturing', methods=['POST'])
@cross_origin()
def start_capturing():
    global isCapturing
    isCapturing = True
    return jsonify({"message": "Capturing started"}), 200

@api.route('/stop_capturing', methods=['POST'])
@cross_origin()
def stop_capturing():
    global isCapturing, recording
    isCapturing = False
    recording = True
    interval = 0.15
    threading.Thread(target=record_screen, args=(1800, interval)).start()
    return jsonify({"message": "Capturing stopped"}), 200