import pickle
import numpy as np
import random
import os
import sys
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRanker
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from features_rank import extract_features_for_rank


# ---------- Constants ----------
MODEL_DIR = 'server/src/ml/model_data'
EDU_MAP = {'bachelor': 0, 'master': 1, 'phd': 2}
SKILL_LIST = ['python', 'react', 'node', 'ml', 'java']
MAX_TFIDF_FEATURES = 100

# ---------- Mock Data Generator ----------
def generate_mock_profiles(n=50):
    profiles = []
    for _ in range(n):
        profile = {
            'experience_years': random.randint(0, 10),
            'education_level': random.choice(list(EDU_MAP.keys())),
            'skills': random.sample(SKILL_LIST, k=random.randint(1, 3)),
            'summary': 'Experienced software developer.',
            'experiences': [{'description': 'Worked on backend systems.'}],
            'projects': [{'description': 'Built a recommendation engine.'}]
        }
        profiles.append(profile)
    return profiles

# ---------- Text Extraction ----------
def extract_text(profile):
    return " ".join([
        profile.get('summary', ''),
        " ".join(profile.get('skills', [])),
        " ".join(exp.get('description', '') for exp in profile.get('experiences', [])),
        " ".join(proj.get('description', '') for proj in profile.get('projects', []))
    ])

# ---------- Screening Feature Extraction ----------
def extract_features(profile, job_description, tfidf):
    exp_years = profile.get('experience_years', 0)
    edu_level = EDU_MAP.get(profile.get('education_level', 'bachelor'), 0)
    skills = profile.get('skills', [])
    skill_match_count = len(set(skills).intersection(set(SKILL_LIST)))  # basic overlap count

    tf_job = tfidf.transform([job_description])
    tf_resume = tfidf.transform([extract_text(profile)])
    similarity = (tf_job @ tf_resume.T).A[0][0]

    total_projects = len(profile.get('projects', []))
    total_experiences = len(profile.get('experiences', []))

    return np.array([
        exp_years,
        edu_level,
        skill_match_count,
        similarity,
        total_projects,
        total_experiences
    ])

# ---------- Main Training ----------
def main():
    print("🚀 Generating mock data...")
    mock_profiles = generate_mock_profiles()
    job_description_str = "Looking for a backend engineer skilled in ML and Python."
    job_description_dict = {"role": "backend engineer", "skills": ["ML", "Python"]}

    # ---------- Screening TF-IDF ----------
    print("📊 Fitting screening TF-IDF vectorizer...")
    texts_screen = [extract_text(p) for p in mock_profiles] + [job_description_str]
    tfidf_screen = TfidfVectorizer(max_features=MAX_TFIDF_FEATURES)
    tfidf_screen.fit(texts_screen)

    print("🔍 Extracting screening features...")
    X_screen = np.array([extract_features(p, job_description_str, tfidf_screen) for p in mock_profiles])
    y = np.array([1 if p['experience_years'] > 2 else 0 for p in mock_profiles])

    print("📏 Scaling screening features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_screen)

    print("🤖 Training Logistic Regression...")
    log_model = LogisticRegression()
    log_model.fit(X_scaled, y)

    # ---------- Ranking TF-IDF ----------
    print("📊 Fitting ranking TF-IDF vectorizer...")
    texts_rank = [extract_text(p) for p in mock_profiles]
    tfidf_rank = TfidfVectorizer(max_features=MAX_TFIDF_FEATURES)
    tfidf_rank.fit(texts_rank)

    print("🔍 Extracting ranking features...")
    X_rank = np.array([
        extract_features_for_rank(p, job_description_dict, tfidf_rank) for p in mock_profiles
    ])

    print("📈 Training XGBoost Ranker...")
    group = [len(X_rank)]  # Single group
    rank_model = XGBRanker(objective='rank:pairwise', n_estimators=20)
    rank_model.fit(X_rank, y, group=group)

    # ---------- Save Everything ----------
    print("💾 Saving models...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(f'{MODEL_DIR}/tfidf_vectorizer.pkl', 'wb') as f:
        pickle.dump(tfidf_screen, f)
    with open(f'{MODEL_DIR}/feature_scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    with open(f'{MODEL_DIR}/logistic_model.pkl', 'wb') as f:
        pickle.dump(log_model, f)
    with open(f'{MODEL_DIR}/tfidf_rank.pkl', 'wb') as f:
        pickle.dump(tfidf_rank, f)
    with open(f'{MODEL_DIR}/ltr_model.pkl', 'wb') as f:
        pickle.dump(rank_model, f)

    print("✅ Training complete! All models saved to:", MODEL_DIR)

if __name__ == '__main__':
    main()
