import pickle
import xgboost as xgb
import sys
import os
import numpy as np

# Add parent directory to path for module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml.features import extract_features

def log_debug(message):
    print(f"[DEBUG] {message}", file=sys.stderr, flush=True)

# Load XGBoost LTR model from disk
def load_ltr_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'model_data', 'ltr_model.pkl')

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"LTR model not found at {model_path}")

    log_debug(f"📦 Loading model from {model_path}")
    with open(model_path, 'rb') as f:
        model = pickle.load(f)

    log_debug("✅ Model loaded successfully")
    return model

# Main ranking function
def rank_applicants(applicants, job_description):
    if not applicants or not job_description:
        raise ValueError("Applicants and job description must be provided")

    model = load_ltr_model()

    features_list = []
    for i, profile in enumerate(applicants):
        try:
            features = extract_features(profile, job_description)
            features_list.append(features)
        except Exception as e:
            log_debug(f"❌ Feature extraction failed for applicant index {i}: {e}")
            raise ValueError(f"Feature extraction error for applicant index {i}: {e}")

    features_array = np.array(features_list)
    log_debug(f"📊 Feature array shape: {features_array.shape}")

    try:
        scores = model.predict(features_array)
    except Exception as e:
        raise RuntimeError(f"Model prediction failed: {e}")

    ranked = sorted(zip(applicants, scores), key=lambda x: x[1], reverse=True)
    return ranked
