# server/src/ml/rank_api.py

from flask import Flask, request, jsonify
import traceback
import time
from ltr_model import rank_applicants

app = Flask(__name__)

def validate_inputs(applicants, job_description):
    if not isinstance(applicants, list) or len(applicants) == 0:
        raise ValueError("Applicants must be a non-empty list.")
    if not isinstance(job_description, str) or not job_description.strip():
        raise ValueError("Job description must be a non-empty string.")

@app.route('/rank', methods=['POST'])
def rank():
    try:
        data = request.get_json()
        applicants = data.get('applicants')
        job_description = data.get('jobDescription')

        validate_inputs(applicants, job_description)

        start_time = time.time()
        result = rank_applicants(applicants, job_description)
        output = [{'studentId': r[0]['_id'], 'score': float(r[1])} for r in result]

        return jsonify(output), 200

    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        print("❌ Unhandled Exception:", flush=True)
        traceback.print_exc()
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
