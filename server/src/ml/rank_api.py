import os
import sys
import time
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
import logging

# Add parent dir to path for imports if needed
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ltr_model import rank_applicants  # your ranking function

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins
logging.basicConfig(level=logging.DEBUG)


# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI environment variable not set")

client = MongoClient(MONGO_URI)
db = client["hrmsDB"]
jobs_collection = db["jobs"]
students_collection = db["students"]


def fetch_profiles_by_job_id(job_id):
    # Find the job by ObjectId
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise ValueError(f"Job with id {job_id} not found")

    # Extract student IDs from applicants list (skip if no studentId)
    student_ids = [
        ObjectId(entry["studentId"]) 
        for entry in job.get("applicants", []) 
        if "studentId" in entry
    ]

    if not student_ids:
        raise ValueError("No applicants found for this job")

    # Fetch full student profiles from the students collection
    profiles = list(students_collection.find({"_id": {"$in": student_ids}}))
    if not profiles:
        raise ValueError("No matching student profiles found")

    return profiles, job


@app.route('/rank', methods=['POST'])
def rank():
    try:
        data = request.get_json()
        job_id = data.get('jobId')

        if not job_id:
            return jsonify({"error": "jobId is required"}), 400

        # This fetches full student profiles (not just studentIds)
        full_profiles, job = fetch_profiles_by_job_id(job_id)

        # Build job description dict for features
        job_desc = {
            "title": job.get("title", ""),
            "description": job.get("description", "")
        }

        # Now rank applicants with full profiles
        ranked_results = rank_applicants(full_profiles, job_desc)

        # Return ranked student IDs and scores
        output = [
            {"studentId": str(profile["_id"]), "score": float(score)}
            for profile, score in ranked_results
        ]

        return jsonify(output), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logging.error(f"Exception during ranking: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == '__main__':
    app.run(port=8000, debug=True, use_reloader=False)
