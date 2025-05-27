const axios = require('axios');

/**
 * Rank applicants using Flask ML API
 * @param {Array} applicants - Array of applicant profile objects
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Array>} - Resolves with ranked applicants [{ studentId, score }]
 */
function rankApplicants(applicants, jobDescription) {
  return new Promise(async (resolve, reject) => {
    try {
      // Input validation
      if (!Array.isArray(applicants) || applicants.length === 0) {
        return reject(new Error("Applicants must be a non-empty array"));
      }
      if (typeof jobDescription !== 'string' || !jobDescription.trim()) {
        return reject(new Error("Job description must be a non-empty string"));
      }

      const response = await axios.post('http://localhost:8000/rank', {
        applicants,
        jobDescription,
      }, {
        timeout: 90000, // 90 seconds
      });

      const output = response.data;
      if (!Array.isArray(output) || !output.every(r => r.studentId && typeof r.score === 'number')) {
        throw new Error("Invalid response from Python Flask API");
      }

      resolve(output);
    } catch (err) {
      console.error("❌ Flask rank API call failed:", err.message);
      reject(new Error("Failed to rank applicants via Flask API"));
    }
  });
}

module.exports = { rankApplicants };
