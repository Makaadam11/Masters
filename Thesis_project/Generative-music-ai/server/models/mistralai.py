import requests
import json
import re
import random

class MistralAI:
    def __init__(self):
        self.api_url = 'http://localhost:8081/generate'
        self.headers = {"Content-Type": "application/json"}

    def generate_text(self, text):
        data = {"text": text}
        json_data = json.dumps(data)
        response = requests.post(self.api_url, data=json_data, headers=self.headers)

        if response.status_code == 200:
            print("\n\n  ----------- Generating song description... -----------  \n\n")
            generated_text = response.json()['output']
            print("\n\n  ----------- Song description created. -----------  \n\n")

            song_description = self.extract_song_description(generated_text)
            return song_description
        else:
            print(f"Request failed with status code {response.status_code}.")
            return None

    def extract_song_description(self, text):
        # Remove the initial part of the response
        cleaned_text = re.sub(r'Input Text:.*?Do not include percentages in any part of the description.\n\n', '', text, flags=re.DOTALL).strip()
        
        # Remove double newlines
        cleaned_text = cleaned_text.replace('\n\n', '\n')

        # Split the description into sentences and limit to 8 sentences
        sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', cleaned_text)
        shortened_description = ' '.join(sentences[:5])

        # Extract parameters
        parameters = [
            "Harmony", "Tonality", "Pitch", "Contour", "Interval", "Rhythm", 
            "Sound Level", "Timbre", "Timing", "Articulation", 
            "Accents on Specific Notes", "Tone Attacks and Decays", "Vibrato"
        ]
        selected_parameters = random.sample(parameters, 3)
        parameter_descriptions = []

        for param in selected_parameters:
            match = re.search(rf'{param}:(.*?)(?=\n[A-Z]|$)', cleaned_text, re.DOTALL)
            if match:
                parameter_descriptions.append(f"{param}: {match.group(1).strip()}")

        # Combine the extracted parts into a single description
        final_description = f"{shortened_description}\n" + '\n'.join(parameter_descriptions)
        
        if final_description:
            return final_description
        else:
            print("Song description not found in the output.")
            return "Song Description: No description available."
