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

    PythonShell.run('rank_api.py', options, function (err, results) {
      if (err) {
        console.error('PythonShell error:', err);
        return reject(err);
      }

      try {
        resolve(results[0]);
      } catch (parseErr) {
        console.error('Failed to parse Python output:', parseErr);
        reject(new Error('Failed to parse Python output'));
      }
    });
  });
}

module.exports = { rankApplicants };
