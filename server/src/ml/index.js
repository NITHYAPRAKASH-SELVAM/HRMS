const { PythonShell } = require('python-shell');
const path = require('path');

/**
 * Rank applicants using Python ML model via rank_api.py
 * @param {Array} applicants - Array of applicant profile objects
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Array>} - Resolves with ranked applicants [{ studentId, score }]
 */
function rankApplicants(applicants, jobDescription) {
  return new Promise((resolve, reject) => {
    // Input validation
    if (!Array.isArray(applicants) || applicants.length === 0) {
      return reject(new Error("Applicants must be a non-empty array"));
    }
    if (typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return reject(new Error("Job description must be a non-empty string"));
    }

    // Logging for debug
    console.log(`🔍 Launching Python ranker with ${applicants.length} applicants...`);

    const options = {
      mode: 'json',
      pythonOptions: ['-u'], // unbuffered output
      scriptPath: path.join(__dirname), // directory of rank_api.py
      args: [JSON.stringify(applicants), jobDescription],
    };

    let isResolved = false;

    // Safety timeout
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        console.error('⏱ Timeout: Python script took too long.');
        reject(new Error('Python ranking timed out'));
      }
    }, 90000); // 90 seconds

    // Execute Python script
    PythonShell.run('rank_api.py', options, function (err, results) {
      if (isResolved) return; // prevent double resolution
      clearTimeout(timeout);

      if (err) {
        console.error('🐍 PythonShell stderr:', err);

        // Check for known Python validation errors
        const msg = err.message || '';
        let userFriendlyError = 'Python execution error';

        if (msg.includes('Applicants must')) {
          userFriendlyError = 'Invalid input: applicants must be a non-empty array';
        } else if (msg.includes('Job description')) {
          userFriendlyError = 'Invalid input: job description must be a non-empty string';
        } else if (msg.includes('Unhandled Exception')) {
          userFriendlyError = 'Internal error in Python script';
        }

        isResolved = true;
        return reject(new Error(userFriendlyError));
      }

      try {
        const output = results?.[0];

        // Validate output is as expected
        if (!Array.isArray(output) || !output.every(r => r.studentId && typeof r.score === 'number')) {
          throw new Error("Invalid or malformed output from Python");
        }

        isResolved = true;
        resolve(output);
      } catch (parseErr) {
        console.error('❌ Failed to parse Python output:', parseErr);
        reject(new Error('Failed to parse Python output'));
      }
    });
  });
}

module.exports = { rankApplicants };
