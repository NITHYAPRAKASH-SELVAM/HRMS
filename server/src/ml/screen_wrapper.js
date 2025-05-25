const { PythonShell } = require('python-shell');
const path = require('path');

function screenApplicant(profile, jobDescription) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname), // same folder as screen_api.py
      args: [], // input passed via stdin
    };

    const pyShell = new PythonShell('screen_api.py', options);

    pyShell.send(JSON.stringify({
      profile,
      job_description: jobDescription
    }));

    pyShell.on('message', (message) => {
      if (message.fit_score !== undefined) {
        resolve(message.fit_score);
      } else {
        reject(message.error || "Unexpected error from screen_api.py");
      }
    });

    pyShell.on('error', reject);
    pyShell.end((err) => {
      if (err) reject(err);
    });
  });
}

module.exports = { screenApplicant };
