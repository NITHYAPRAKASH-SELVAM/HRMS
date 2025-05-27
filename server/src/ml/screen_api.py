from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
import logging
from pymongo import MongoClient
from bson.objectid import ObjectId

# Add parent directory for import
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml.logistic_model import predict_fit

# Load environment variables
load_dotenv()

# Flask setup
app = Flask(__name__)
CORS(app)  # <-- This enables CORS for all routes and origins by default
logging.basicConfig(level=logging.DEBUG)

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    app.logger.error("MONGO_URI environment variable not set")
    raise RuntimeError("MONGO_URI environment variable not set")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client["hrmsDB"]
    jobs_collection = db["jobs"]
    students_collection = db["students"]

    # Confirm MongoDB connection
    client.server_info()
    app.logger.info("MongoDB connection established.")

except Exception as e:
    app.logger.error(f"Failed to connect to MongoDB: {e}")
    raise RuntimeError("MongoDB connection failed")

# Utility function: Validate and convert to ObjectId
def get_valid_objectid(id_str):
    return ObjectId(id_str) if ObjectId.is_valid(id_str) else None

# Utility function: Fetch a document by _id
def fetch_document_by_id(collection, id_str):
    obj_id = get_valid_objectid(id_str)
    if not obj_id:
        return None
    try:
        doc = collection.find_one({"_id": obj_id})
        if doc:
            doc["_id"] = str(doc["_id"])  # Convert ObjectId to string for JSON
        return doc
    except Exception as e:
        app.logger.error(f"Error fetching document with ID {id_str}: {e}")
        return None

# ML fit prediction API
@app.route('/predict-fit', methods=['POST'])
def predict_fit_api():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    try:
        data = request.get_json()
        app.logger.debug(f"Received request data: {data}")

        student_id = data.get("profile")
        job_id = data.get("job_description")

        if not student_id or not job_id:
            return jsonify({"error": "Both 'profile' and 'job_description' are required"}), 400

        student = fetch_document_by_id(students_collection, student_id)
        job = fetch_document_by_id(jobs_collection, job_id)

        if not student:
            return jsonify({"error": f"Student with ID '{student_id}' not found"}), 404
        if not job:
            return jsonify({"error": f"Job with ID '{job_id}' not found"}), 404

        fit_score = predict_fit(student, job)
        app.logger.info(f"Predicted fit score for student {student_id} and job {job_id}: {fit_score}")

        return jsonify({"fit_score": fit_score}), 200

    except Exception as e:
        app.logger.exception("Unhandled exception in /predict-fit")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

# Run server
if __name__ == '__main__':
    app.run(port=5001, debug=True, use_reloader=False)
