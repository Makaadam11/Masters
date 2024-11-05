from transformers import Speech2TextProcessor, Speech2TextForConditionalGeneration
from flask import Flask, request, jsonify
import logging
import torchaudio
from pydub import AudioSegment
import io
import os

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)


model = Speech2TextForConditionalGeneration.from_pretrained("facebook/s2t-small-librispeech-asr")
processor = Speech2TextProcessor.from_pretrained("facebook/s2t-small-librispeech-asr")

def transcribe_audio(audio_path):
    logging.info("hello from transcribe_audio")
    waveform, sample_rate = torchaudio.load(audio_path)
    # Assume 'processor' and 'model' are used here for transcription
    inputs = processor(waveform.squeeze(), sampling_rate=sample_rate, return_tensors="pt")
    generated_ids = model.generate(inputs["input_features"], attention_mask=inputs["attention_mask"])
    transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)
    return transcription

@app.route('/transcribe_speech', methods=['POST'])
def transcribe_speech():
    logging.info("hello from api")
    if 'audio' not in request.files:
        logging.warning("No audio file provided")
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio']
    logging.debug(f"Received audio file: {audio_file.filename}")
    
    # Assuming transcribe_audio function accepts a file-like object directly
    try:
        # Directly pass the file-like object to the transcription function
        transcription = transcribe_audio(audio_file)
    except Exception as e:
        logging.error(f"Error during transcription: {e}")
        return jsonify({"error": "Transcription failed"}), 500

    return jsonify({"transcription": transcription})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8082)