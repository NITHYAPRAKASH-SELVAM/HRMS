// server/src/ml/screen_wrapper.js

const axios = require('axios');

async function screenApplicant(profile, jobDescription) {
  try {
    const response = await axios.post('http://localhost:5001/predict-fit', {
      profile,
      job_description: jobDescription
    });

    return response.data.fit_score;
  } catch (err) {
    console.error("Fit Score Error:", err.response?.data || err.message);
    throw new Error("Failed to get fit score from Flask API");
  }
}

module.exports = { screenApplicant };
