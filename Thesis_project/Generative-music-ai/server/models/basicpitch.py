from basic_pitch.inference import predict_and_save, predict
from basic_pitch import ICASSP_2022_MODEL_PATH
import numpy as np
import pretty_midi
import logging
import os
import shutil
import subprocess

logging.basicConfig(level=logging.INFO)

class BasicPitch:
    def transcribe_audio(self, temp_audio_path):
        try:
            logging.info(f"Transcribing audio from {temp_audio_path}")
            model_output, midi_data, note_events = predict(temp_audio_path)

            print(model_output, "\n\n\n", midi_data, "\n\n\n", note_events)
            
            if model_output is None or not isinstance(model_output, dict):
                raise ValueError("Invalid MIDI data returned from prediction")
            
            logging.info("MIDI data generated successfully")
            
            output_wav_path = r'C:\5.ComputionalEnt\generative-music-ai\server\output.wav'
            wavfile_path = self.midi_to_wav(note_events, output_wav_path)
            logging.info(f"WAV file created at {wavfile_path}")

            return wavfile_path
        except Exception as e:
            logging.error(f"Error in transcribe_audio: {e}")
            raise

    def midi_to_wav(self, note_events, output_wav_path, sample_rate=44100):
        try:
            logging.info("Converting MIDI to WAV")
            midi = pretty_midi.PrettyMIDI()
            instrument = pretty_midi.Instrument(program=0)  # 0 is piano
            
            for start, end, pitch, velocity, _ in note_events:
                note = pretty_midi.Note(
                    velocity=int(velocity * 127),  # Convert to MIDI velocity
                    pitch=pitch,
                    start=start,
                    end=end
                )
                instrument.notes.append(note)
            
            logging.info("Instrument converted successfully")
            midi.instruments.append(instrument)
            
            temp_midi_path = r'C:\5.ComputionalEnt\generative-music-ai\server\temp_output.mid'
            midi.write(temp_midi_path)
            
            soundfont_path = r'C:\5.ComputionalEnt\generative-music-ai\server\FluidR3Mono_GM.sf3'
            logging.info(f"Temporary MIDI file created at {temp_midi_path}")
            
            # Check if fluidsynth and soundfont file exist
            if not shutil.which('fluidsynth'):
                raise FileNotFoundError("fluidsynth executable not found")
            if not os.path.isfile(soundfont_path):
                raise FileNotFoundError(f"Soundfont file not found: {soundfont_path}")
            
            # Use fluidsynth to convert MIDI to WAV
            subprocess.run(['fluidsynth', '-ni', soundfont_path, temp_midi_path, '-F', output_wav_path, '-r', str(sample_rate)], check=True)
            logging.info(f"WAV file created at {output_wav_path}")
            
            return output_wav_path
        except Exception as e:
            logging.error(f"Error in midi_to_wav: {e}")
            raise
        finally:
            print("Cleaning up temporary files...")
            if temp_midi_path and os.path.exists(temp_midi_path):
                os.remove(temp_midi_path)