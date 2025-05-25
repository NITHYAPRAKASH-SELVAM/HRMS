const { PythonShell } = require('python-shell');
const path = require('path');

function rankApplicants(applicants, jobDescription) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname), // path to your .py file
      args: [JSON.stringify(applicants), jobDescription],
    };

    PythonShell.run('rank_api.py', options, function (err, results) {
      if (err) return reject(err);
      resolve(results[0]); // Output from Python
    });
  });
}

module.exports = { rankApplicants };
