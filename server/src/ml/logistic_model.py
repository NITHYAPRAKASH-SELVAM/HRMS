import pickle
import numpy as np
from ml.features import extract_features

# Load model once globally
_model = None
def load_model():
    global _model
    if _model is None:
        with open('ml/model_data/logistic_model.pkl', 'rb') as f:
            _model = pickle.load(f)
    return _model

def predict_fit(profile, job_description):
    if not profile or not job_description:
        raise ValueError("Profile and job description must be provided")
    model = load_model()
    features = extract_features(profile, job_description)
    prob = model.predict_proba([features])[0][1]
    return prob
