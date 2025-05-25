import sys
import json
from ltr_model import rank_applicants

if __name__ == '__main__':
    applicants = json.loads(sys.argv[1])
    job_description = sys.argv[2]
    
    result = rank_applicants(applicants, job_description)
    output = [{'studentId': r[0]['_id'], 'score': float(r[1])} for r in result]
    
    print(json.dumps(output))
