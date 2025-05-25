# server/src/ml/screen_api.py

import sys
import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml.features import extract_features
from ml.logistic_model import predict_fit

def main():
    try:
        # Read input JSON from Node.js
        raw = sys.stdin.read()
        data = json.loads(raw)

        profile = data.get("profile")
        job_description = data.get("job_description")

        if not profile or not job_description:
            print(json.dumps({"error": "Missing data"}))
            return

        prob = predict_fit(profile, job_description)
        print(json.dumps({"fit_score": prob}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    main()
