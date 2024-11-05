import cv2
from deepface import DeepFace

class DeepFaceModel:

    def process_frame(self, frame):
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = []

        emotion_predictions = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        if isinstance(emotion_predictions, list):
            emotion_predictions = emotion_predictions[0]
        emotion = emotion_predictions['emotion']

        results.append({
            'emotion': emotion,
        })

        return results
