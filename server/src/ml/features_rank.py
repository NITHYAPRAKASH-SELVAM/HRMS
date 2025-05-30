import os
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

_vectorizer_cache = None

def load_vectorizer(path=None):
    global _vectorizer_cache
    if _vectorizer_cache is not None:
        return _vectorizer_cache

    if path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir, "model_data", "tfidf_rank.pkl")

    with open(path, 'rb') as f:
        _vectorizer_cache = pickle.load(f)
    return _vectorizer_cache


def extract_features_for_rank(profile, job_description, vectorizer=None):
    if vectorizer is None:
        vectorizer = load_vectorizer()

    # Calculate total experience years
    experience_years = 0
    for exp in profile.get('experience', []):
        try:
            start_year = int(exp.get('from', 0))
            end_year = int(exp.get('to', start_year))
            if start_year > end_year:
                end_year = start_year
            experience_years += max(0, end_year - start_year)
        except Exception:
            continue

    experience = min(max(experience_years, 0), 50) / 50.0

    # Education level encoding
    edu_map = {'be': 0, 'bachelor': 0, 'master': 1, 'phd': 2}
    education_level = 'be'
    edu_list = profile.get('education', [])
    if edu_list:
        degree = edu_list[0].get('degree', 'be').lower()
        education_level = degree if degree in edu_map else 'be'
    education_encoded = edu_map.get(education_level, 0)

    num_skills = len(profile.get('skills', []))
    num_projects = len(profile.get('projects', []))
    num_certifications = len(profile.get('certifications', []))

    resume_text_parts = [
        profile.get('objective', ''),
        " ".join(profile.get('skills', [])),
        " ".join([exp.get('description', '') for exp in profile.get('experience', []) if isinstance(exp, dict)]),
        " ".join([proj.get('description', '') for proj in profile.get('projects', []) if isinstance(proj, dict)])
    ]
    resume_text = " ".join(resume_text_parts).strip() or "N/A"

    job_text_parts = [
        job_description.get('title', ''),
        job_description.get('description', '')
    ]
    job_text = " ".join(job_text_parts).strip() or "N/A"

    tfidf_job = vectorizer.transform([job_text])
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
