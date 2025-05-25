import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

def load_vectorizer(path=None):
    if path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))  # directory of features.py
        path = os.path.join(base_dir, "model_data", "tfidf_vectorizer.pkl")
    with open(path, 'rb') as f:
        return pickle.load(f)

def extract_features(profile, job_description, vectorizer=None):
    # Structured features
    experience = profile.get('experience_years', 0)
    skills = profile.get('skills', [])
    education_level = profile.get('education_level', 'bachelor')
    
    # Unstructured text from resume/profile
    resume_text = " ".join([
        profile.get('summary', ''),
        " ".join(skills),
        " ".join([exp['description'] for exp in profile.get('experiences', [])]),
        " ".join([proj['description'] for proj in profile.get('projects', [])])
    ])
    
    # Load TF-IDF vectorizer if not provided
    if vectorizer is None:
        vectorizer = load_vectorizer()
    
    # Vectorize job description and resume text
    tfidf_job = vectorizer.transform([job_description])
    tfidf_resume = vectorizer.transform([resume_text])
    
    # Compute cosine similarity between job and resume vectors
    text_similarity = cosine_similarity(tfidf_job, tfidf_resume)[0, 0]
    
    # One-hot encode education level (example mapping)
    edu_map = {'bachelor': 0, 'master': 1, 'phd': 2}
    education_encoded = edu_map.get(education_level.lower(), 0)
    
    # Return feature array
    return np.array([experience, education_encoded, text_similarity])
