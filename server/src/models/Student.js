const mongoose = require('mongoose');
const { STUDENT } = require('../constants/roles');

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,

  // Resume-style fields
  objective: String,
  skills: [String],
  experience: [
    {
      company: String,
      title: String,
      from: String,
      to: String,
      description: String,
    },
  ],
  education: [
    {
      degree: String,
      institution: String,
      year: String,
      grade: String,
    },
  ],
  certifications: [String],
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      link: String,
    },
  ],
  references: [
    {
      name: String,
      position: String,
      company: String,
      contact: String,
    },
  ],

  password: { type: String, required: true },
  role: { type: String, default: STUDENT },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Students', StudentSchema);
