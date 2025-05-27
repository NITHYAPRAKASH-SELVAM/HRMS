# server/src/ml/screen_flask_api.py

from flask import Flask, request, jsonify
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ml.logistic_model import predict_fit

app = Flask(__name__)

@app.route('/predict-fit', methods=['POST'])
def predict_fit_api():
    try:
        data = request.get_json()

        profile = data.get("profile")
        job_description = data.get("job_description")

        if not profile or not job_description:
            return jsonify({"error": "Missing profile or job_description"}), 400

        prob = predict_fit(profile, job_description)
        return jsonify({"fit_score": prob}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
