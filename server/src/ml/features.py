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
    experience = min(max(profile.get('experience_years', 0), 0), 50) / 50.0
    education_level = profile.get('education_level', 'bachelor').lower()
    edu_map = {'bachelor': 0, 'master': 1, 'phd': 2}
    education_encoded = edu_map.get(education_level, 0)

    skills = profile.get('skills', [])
    num_skills = len(skills)
    num_projects = len(profile.get('projects', []))
    num_certifications = len(profile.get('certifications', []))

    # Resume text
    resume_text = " ".join([
        profile.get('summary', ''),
        " ".join(skills),
        " ".join([exp.get('description', '') for exp in profile.get('experiences', []) if exp]),
        " ".join([proj.get('description', '') for proj in profile.get('projects', []) if proj])
    ])
    if not resume_text.strip():
        resume_text = "N/A"

    # TF-IDF similarity
    if vectorizer is None:
        vectorizer = load_vectorizer()

    tfidf_job = vectorizer.transform([job_description])
    tfidf_resume = vectorizer.transform([resume_text])
    text_similarity = cosine_similarity(tfidf_job, tfidf_resume)[0, 0]

    return np.array([
        experience,
        education_encoded,
        text_similarity,
        num_skills,
        num_projects,
        num_certifications
    ])

