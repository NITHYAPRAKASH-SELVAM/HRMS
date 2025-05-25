import sys
import json
from ltr_model import rank_applicants

if __name__ == '__main__':
    try:
        # Load and validate inputs
        applicants = json.loads(sys.argv[1])
        job_description = sys.argv[2]

        if not applicants or not job_description:
            raise ValueError("Applicants and job description must be provided")

        # Call ML ranking function
        result = rank_applicants(applicants, job_description)

        # Format result
        output = [{'studentId': r[0]['_id'], 'score': float(r[1])} for r in result]
        print(json.dumps(output))

    except IndexError:
        print("Error: Missing input arguments", file=sys.stderr)
        sys.exit(1)

    except ValueError as ve:
        print(f"ValueError: {ve}", file=sys.stderr)
        sys.exit(1)

    except Exception as e:
        print(f"Unhandled Exception: {e}", file=sys.stderr)
        sys.exit(1)
