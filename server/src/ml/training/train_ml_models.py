import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRanker
import random
import os

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

# ---------- Feature Extraction (6 features) ----------
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

# ---------- Main Training Script ----------
def main():
    print("🚀 Generating mock data...")
    mock_profiles = generate_mock_profiles()
    job_description = "Looking for a backend engineer skilled in ML and Python."

    print("📊 Fitting TF-IDF vectorizer...")
    texts = [extract_text(p) for p in mock_profiles] + [job_description]
    tfidf = TfidfVectorizer(max_features=MAX_TFIDF_FEATURES)
    tfidf.fit(texts)

    print("🔍 Extracting features...")
    X = np.array([extract_features(p, job_description, tfidf) for p in mock_profiles])
    y = np.array([1 if p['experience_years'] > 2 else 0 for p in mock_profiles])

    print("📏 Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("🤖 Training Logistic Regression...")
    log_model = LogisticRegression()
    log_model.fit(X_scaled, y)

    print("📈 Training XGBoost Ranker...")
    group = [len(X_scaled)]  # One group for all
    rank_model = XGBRanker(objective='rank:pairwise', n_estimators=20)
    rank_model.fit(X_scaled, y, group=group)

    print("💾 Saving models...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(f'{MODEL_DIR}/tfidf_vectorizer.pkl', 'wb') as f:
        pickle.dump(tfidf, f)
    with open(f'{MODEL_DIR}/feature_scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    with open(f'{MODEL_DIR}/logistic_model.pkl', 'wb') as f:
        pickle.dump(log_model, f)
    with open(f'{MODEL_DIR}/ltr_model.pkl', 'wb') as f:
        pickle.dump(rank_model, f)

    print("✅ Training complete! Models saved to:", MODEL_DIR)

if __name__ == '__main__':
    main()
