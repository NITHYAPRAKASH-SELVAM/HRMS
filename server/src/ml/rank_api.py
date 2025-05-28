# server/src/ml/rank_api.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
import traceback
import os
import sys
import logging
import time

from ltr_model import rank_applicants
# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # <-- This enables CORS for all routes and origins by default
logging.basicConfig(level=logging.DEBUG)

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set")

client = MongoClient(MONGO_URI)
db = client["hrmsDB"]
jobs_collection = db["jobs"]
students_collection = db["students"]

def fetch_profiles_by_job_id(job_id):
    """Fetch job → extract studentIds → fetch full profiles"""
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise ValueError(f"Job with id {job_id} not found")

    applicant_entries = job.get("applicants", [])
    student_ids = [ObjectId(entry["studentId"]) for entry in applicant_entries if "studentId" in entry]

    if not student_ids:
        raise ValueError("No applicants found in this job")

    profiles = list(students_collection.find({ "_id": { "$in": student_ids } }))
    if not profiles:
        raise ValueError("No matching student profiles found")

    return profiles, job.get("description", "")

@app.route('/rank', methods=['POST'])
def rank():
    try:
        data = request.get_json()
        job_id = data.get('jobId')

        if not job_id:
            raise ValueError("jobId is required")

        # 🔁 Get full student profiles and job description
        full_profiles, job_description = fetch_profiles_by_job_id(job_id)

        # ✅ Rank them
        result = rank_applicants(full_profiles, job_description)

        output = [{'studentId': str(r[0]['_id']), 'score': float(r[1])} for r in result]
        return jsonify(output), 200

    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception:
        traceback.print_exc()
        return jsonify({'error': 'Internal Server Error'}), 500
