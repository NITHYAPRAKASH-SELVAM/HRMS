import pickle
import xgboost as xgb
import sys
import os
import numpy as np
import time

# Add parent directory to path for module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml.features import extract_features

# Global model cache
_model_cache = {}

def log_debug(message):
    print(f"[DEBUG] {message}", file=sys.stderr, flush=True)

def load_ltr_model():
    global _model_cache
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'model_data', 'ltr_model.pkl')

    if model_path in _model_cache:
        return _model_cache[model_path]

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"LTR model not found at {model_path}")

    log_debug(f"📦 Loading model from {model_path}")
    with open(model_path, 'rb') as f:
        model = pickle.load(f)

    log_debug("✅ Model loaded successfully")
    _model_cache[model_path] = model
    return model

def rank_applicants(applicants, job_description):
    if not applicants or not job_description:
        raise ValueError("Applicants and job description must be provided")

    log_debug(f"🔍 Ranking {len(applicants)} applicants...")
    start_time = time.time()

    model = load_ltr_model()
    features_list = []
    valid_applicants = []

    for i, profile in enumerate(applicants):
        try:
            features = extract_features(profile, job_description)
            features_list.append(features)
            valid_applicants.append(profile)
        except Exception as e:
            log_debug(f"⚠️ Skipping applicant index {i} due to feature extraction error: {e}")
            continue  # Skip invalid profile instead of crashing all

    if not features_list:
        log_debug("❌ No valid applicants after feature extraction.")
        raise ValueError("All applicants failed feature extraction.")

    features_array = np.array(features_list)
    log_debug(f"📊 Feature array shape: {features_array.shape}")

    try:
        scores = model.predict(features_array)
    except Exception as e:
        raise RuntimeError(f"🚨 Model prediction failed: {e}")

    ranked = sorted(zip(valid_applicants, scores), key=lambda x: x[1], reverse=True)

    duration = time.time() - start_time
    log_debug(f"✅ Ranking completed in {duration:.2f} seconds.")
    return ranked
