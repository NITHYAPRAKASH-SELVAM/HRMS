import os
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity

def load_vectorizer(path=None):
    if path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir, "model_data", "tfidf_rank.pkl")
    with open(path, 'rb') as f:
        vectorizer = pickle.load(f)
    return vectorizer


def extract_features_for_rank(profile, job_description, vectorizer=None):
    """
    Extract features for Learning to Rank model from profile and job_description.

    Features:
    - normalized experience years (0 to 1)
    - encoded education level (0=be/bachelor, 1=master, 2=phd)
    - TF-IDF cosine similarity between resume text and job description
    - number of skills
    - number of projects
    - number of certifications
    """

    # Calculate total experience years
    exp_list = profile.get('experience', [])
    experience_years = 0
    for exp in exp_list:
        try:
            start_year = int(exp.get('from', 0))
            end_year = int(exp.get('to', start_year))
            if start_year > end_year:
                end_year = start_year
            experience_years += max(0, end_year - start_year)
        except Exception:
            pass

    # Normalize experience (cap at 50 years)
    experience = min(max(experience_years, 0), 50) / 50.0

    # Education level encoding
    edu_map = {'be': 0, 'bachelor': 0, 'master': 1, 'phd': 2}
    education_level = 'be'  # default
    edu_list = profile.get('education', [])
    if edu_list:
        degree = edu_list[0].get('degree', 'be').lower()
        education_level = degree if degree in edu_map else 'be'
    education_encoded = edu_map.get(education_level, 0)

    # Other numeric features
    skills = profile.get('skills', [])
    num_skills = len(skills)

    projects = profile.get('projects', [])
    num_projects = len(projects)

    certifications = profile.get('certifications', [])
    num_certifications = len(certifications)

    # Prepare text fields for TF-IDF similarity
    resume_text_parts = [
        profile.get('objective', ''),
        " ".join(skills),
        " ".join([exp.get('description', '') for exp in exp_list if isinstance(exp, dict)]),
        " ".join([proj.get('description', '') for proj in projects if isinstance(proj, dict)])
    ]
    resume_text = " ".join(resume_text_parts).strip() or "N/A"

    job_text_parts = [
        job_description.get('title', ''),
        job_description.get('description', '')
    ]
    job_text = " ".join(job_text_parts).strip() or "N/A"

    # Load vectorizer if not provided
    if vectorizer is None:
        vectorizer = load_vectorizer()

    tfidf_job = vectorizer.transform([job_text])
    tfidf_resume = vectorizer.transform([resume_text])
    text_similarity = cosine_similarity(tfidf_job, tfidf_resume)[0, 0]

    # Final feature vector
    features = np.array([
        experience,
        education_encoded,
        text_similarity,
        num_skills,
        num_projects,
        num_certifications
    ])

    return features
