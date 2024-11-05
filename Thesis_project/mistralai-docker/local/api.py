from flask import Flask, request, jsonify
from langchain_core.prompts import PromptTemplate
from langchain import PromptTemplate, HuggingFaceHub, LLMChain
import os

os.environ['HUGGINGFACEHUB_API_TOKEN'] = 'YOUR_API_TOKEN'

app = Flask(__name__)

# Define the prompt template for generating song descriptions
template = """Input Text: {text}

Task: Create a song description from the input text. Include 3 randomly chosen parameters in the song description from: genre, tempo, mode, harmony, tonality, pitch, contour, interval, rhythm, sound level, timbre, timing, articulation, accents on specific notes, tone attacks and decays, and vibrato. As you develop the description, build tension and excitement by gradually intensifying the musical elements. Describe a prolonged climax that evolves over multiple phases, incorporating dynamic shifts, layered instrumentation, and emotional depth. Conclude the description with a grand finale that leaves a lasting impression, such as an unexpected key change, a powerful vocal crescendo, or a complex instrumental arrangement that showcases exceptional musicianship. Do not include percentages in any part of the description."""
prompt = PromptTemplate(template=template, input_variables=["text"])

# Initialize the model with appropriate parameters
model = HuggingFaceHub(
    repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
    task="text-generation",
    model_kwargs={
        "max_new_tokens": 512,
        "top_k": 50,
        "temperature": 0.7,
        "repetition_penalty": 1.1,
        "top_p": 0.95,
    },
)

llm_chain = LLMChain(prompt=prompt, llm=model)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data['text']
    try:
        # Generate song description based on input text
        output = llm_chain.invoke({"text": text})
        
        # Check if the output is in a valid format and contains a description
        if output and 'text' in output:
            return jsonify({"output": output['text']})
        else:
            return jsonify({"error": "Song description not found in the output"}), 500
    except Exception as e:
        # Log the error message and return a generic error response
        print(f"Error during text generation: {str(e)}")
        return jsonify({"error": "An error occurred during text generation"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)