const axios = require('axios');

/**
 * Rank applicants using Flask ML API
 * @param {Array} applicants - Array of applicant profile objects
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Array>} - Resolves with ranked applicants [{ studentId, score }]
 */
function rankApplicantsByJobId(jobId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!jobId || typeof jobId !== 'string') {
        return reject(new Error("jobId must be a non-empty string"));
      }

      const response = await axios.post('http://localhost:8000/rank', {
        jobId,
      }, {
        timeout: 90000,
      });

      const output = response.data;
      if (!Array.isArray(output) || !output.every(r => r.studentId && typeof r.score === 'number')) {
        throw new Error("Invalid response from Flask rank API");
      }

      resolve(output);
    } catch (err) {
      console.error("❌ Flask rank API failed:", err.message);
      reject(new Error("Failed to rank applicants via Flask API"));
    }
  });
}

module.exports = { rankApplicantsByJobId };
