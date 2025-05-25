const { PythonShell } = require('python-shell');
const path = require('path');

function rankApplicants(applicants, jobDescription) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(applicants) || applicants.length === 0 || !jobDescription) {
      return reject(new Error("Applicants and job description must be provided"));
    }

    const options = {
      mode: 'json',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname),
      args: [JSON.stringify(applicants), jobDescription],
    };

    let isResolved = false;

    // Timeout to reject after 10 seconds
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        reject(new Error('Python ranking timed out'));
      }
    }, 30000);

    PythonShell.run('rank_api.py', options, function (err, results) {
      if (isResolved) return;  // Prevent multiple resolves
      clearTimeout(timeout);

      if (err) {
        console.error('PythonShell error:', err);
        isResolved = true;
        return reject(err);
      }

      try {
        isResolved = true;
        resolve(results[0]);
      } catch (parseErr) {
        console.error('Failed to parse Python output:', parseErr);
        reject(new Error('Failed to parse Python output'));
      }
    });
  });
}

module.exports = { rankApplicants };
