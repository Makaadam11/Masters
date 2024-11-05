import requests
import json
import replicate

class MusicGen:
    def __init__(self):
        self.model = "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb"

    def generate_music(self, duration, description=None, audio_file_path=None):
        input_data = {
            "top_k": 250,
            "top_p": 0,
            "temperature": 1.1,
            "continuation": False,
            "model_version": "stereo-melody-large",
            "output_format": "wav",
            "continuation_start": 0,
            "multi_band_diffusion": False,
            "normalization_strategy": "peak",
            "duration": duration,
            "classifier_free_guidance": 8,
        }

        if description:
            input_data["prompt"] = description

        if audio_file_path:
            print("musicgen audio_file_path: ", audio_file_path)
            input_data["input_audio"] = audio_file_path
        try:
            print("\n\n  ----------- Generating music... -----------  \n\n")
            output = replicate.run(self.model, input=input_data)
        except Exception as e:
            print(f"Error generating music: {str(e)}")
            return None
        if output:
            print("\n\n  ----------- Music generation successful. -----------  \n\n")
            return output
        else:
            print("Music generation failed.")
            return None
