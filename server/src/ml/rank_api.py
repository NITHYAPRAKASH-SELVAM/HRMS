import sys
import json
import time
import traceback
from ltr_model import rank_applicants

def log_debug(message):
    print(f"[DEBUG] {message}", file=sys.stderr, flush=True)

def validate_inputs(applicants, job_description):
    if not isinstance(applicants, list) or len(applicants) == 0:
        raise ValueError("Applicants must be a non-empty list.")
    if not isinstance(job_description, str) or not job_description.strip():
        raise ValueError("Job description must be a non-empty string.")

if __name__ == '__main__':
    try:
        start_total = time.time()

        # Load and validate inputs
        applicants = json.loads(sys.argv[1])
        job_description = sys.argv[2]

        validate_inputs(applicants, job_description)
        log_debug(f"✅ Loaded {len(applicants)} applicants")
        log_debug(f"🔍 Job Description: {job_description[:80]}...")

        # Rank applicants
        start_rank = time.time()
        result = rank_applicants(applicants, job_description)
        log_debug(f"⏱ Ranking completed in {time.time() - start_rank:.2f} seconds")

        # Format and print result
        output = [{'studentId': r[0]['_id'], 'score': float(r[1])} for r in result]
        print(json.dumps(output), flush=True)

        log_debug(f"✅ Done in {time.time() - start_total:.2f} seconds")

    except IndexError:
        print("Error: Missing input arguments", file=sys.stderr, flush=True)
        sys.exit(1)

    except ValueError as ve:
        print(f"ValueError: {ve}", file=sys.stderr, flush=True)
        sys.exit(1)

    except Exception as e:
        print("Unhandled Exception:", file=sys.stderr, flush=True)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
