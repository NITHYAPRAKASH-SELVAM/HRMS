import pickle
import numpy as np
import sys
import os

# Ensure ml/features.py is importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ml.features import extract_features

# Load model once globally
_model = None

def load_model():
    global _model
    if _model is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))  # path to logistic_model.py
        model_path = os.path.join(base_dir, "model_data", "logistic_model.pkl")
        with open(model_path, 'rb') as f:
            _model = pickle.load(f)
    return _model

def predict_fit(profile, job_description_text):
    if not profile or not job_description_text:
        raise ValueError("Profile and job description must be provided")
    model = load_model()
    features = extract_features(profile, job_description_text)  # pass text, not dict
    prob = model.predict_proba([features])[0][1]
    return prob

