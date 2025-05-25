import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRanker
import random

# ---------- Mock Data (Replace with real dataset in production) ----------
def generate_mock_profiles(n=50):
    edu_levels = ['bachelor', 'master', 'phd']
    skills_list = ['python', 'react', 'node', 'ml', 'java']
    profiles = []
    for _ in range(n):
        profile = {
            'experience_years': random.randint(0, 10),
            'education_level': random.choice(edu_levels),
            'skills': random.sample(skills_list, k=random.randint(1, 3)),
            'summary': 'Experienced software developer.',
            'experiences': [{'description': 'Worked on backend systems.'}],
            'projects': [{'description': 'Built a recommendation engine.'}]
        }
        profiles.append(profile)
    return profiles

def extract_text(profile):
    return " ".join([
        profile['summary'],
        " ".join(profile['skills']),
        " ".join(exp['description'] for exp in profile['experiences']),
        " ".join(proj['description'] for proj in profile['projects'])
    ])

# ---------- TF-IDF Vectorizer ----------
print("Fitting TF-IDF vectorizer...")
mock_profiles = generate_mock_profiles()
job_desc = "Looking for a backend engineer skilled in ML and Python."
all_texts = [extract_text(p) for p in mock_profiles] + [job_desc]
tfidf = TfidfVectorizer(max_features=100)
tfidf.fit(all_texts)

# ---------- Feature Extraction ----------
edu_map = {'bachelor': 0, 'master': 1, 'phd': 2}
def extract_features(profile, job_description):
    experience = profile['experience_years']
    edu = edu_map.get(profile['education_level'], 0)
    tf_job = tfidf.transform([job_description])
    tf_resume = tfidf.transform([extract_text(profile)])
    similarity = (tf_job @ tf_resume.T).A[0][0]
    return np.array([experience, edu, similarity])

X = np.array([extract_features(p, job_desc) for p in mock_profiles])
y = np.array([1 if p['experience_years'] > 2 else 0 for p in mock_profiles])

# ---------- Scale Features ----------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ---------- Train Logistic Regression ----------
print("Training Logistic Regression...")
log_model = LogisticRegression()
log_model.fit(X_scaled, y)

# ---------- Train XGBoost Ranker ----------
print("Training XGBoost Ranker...")
rank_model = XGBRanker(objective='rank:pairwise', n_estimators=20)
group = [len(X_scaled)]  # One group of all applicants
rank_model.fit(X_scaled, y, group=group)

# ---------- Save Models ----------
print("Saving models to ml/model_data...")
with open('server/src/ml/model_data/tfidf_vectorizer.pkl', 'wb') as f:
    pickle.dump(tfidf, f)

with open('server/src/ml/model_data/feature_scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

with open('server/src/ml/model_data/logistic_model.pkl', 'wb') as f:
    pickle.dump(log_model, f)

with open('server/src/ml/model_data/ltr_model.pkl', 'wb') as f:
    pickle.dump(rank_model, f)

print("✅ Training complete!")
