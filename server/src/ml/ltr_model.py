import pickle
import xgboost as xgb
import sys
import os
import numpy as np

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ml.features import extract_features

# Load LTR model from disk
def load_ltr_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'model_data', 'ltr_model.pkl')
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def rank_applicants(applicants, job_description):
    if not applicants or not job_description:
        raise ValueError("Applicants and job description must be provided")

    model = load_ltr_model()
    features_list = [extract_features(profile, job_description) for profile in applicants]
    features_array = np.array(features_list)

    # Predict ranking scores directly from numpy array for XGBRanker
    scores = model.predict(features_array)

    # Return applicants ranked by predicted score (highest first)
    ranked = sorted(zip(applicants, scores), key=lambda x: x[1], reverse=True)
    return ranked

