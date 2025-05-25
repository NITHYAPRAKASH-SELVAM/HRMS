import pickle
import xgboost as xgb
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml.features import extract_features
import numpy as np

def load_ltr_model():
    with open('ml/model_data/ltr_model.pkl', 'rb') as f:
        return pickle.load(f)  # this should be an XGBoost model saved with pickle

def rank_applicants(applicants, job_description):
    model = load_ltr_model()
    features_list = [extract_features(profile, job_description) for profile in applicants]
    features_array = np.array(features_list)

    # Predict ranking scores using XGBoost model
    dmatrix = xgb.DMatrix(features_array)
    scores = model.predict(dmatrix)

    # Sort applicants by score descending
    ranked = sorted(zip(applicants, scores), key=lambda x: x[1], reverse=True)
    return ranked
