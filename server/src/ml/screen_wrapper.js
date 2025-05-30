const axios = require('axios');

async function screenApplicant(profile, jobDescription) {
  try {
    console.log("Sending to Flask API:", { profile, job_description: jobDescription });

    const response = await axios.post('http://localhost:5001/predict-fit', {
      profile,
      job_description: jobDescription,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { fit_score, fit } = response.data;

    if (typeof fit === "undefined" || typeof fit_score === "undefined") {
      throw new Error("Missing 'fit' or 'fit_score' in response from Flask API");
    }

    return { fit, fit_score };
  } catch (err) {
    console.error("🛑 Fit Score Error:", err.response?.data || err.message);
    throw new Error("Failed to get fit score from Flask API");
  }
}

module.exports = { screenApplicant };
