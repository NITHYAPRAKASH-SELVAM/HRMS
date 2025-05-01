const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
  _companyId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Students', // or 'Students' if you used that model name
    },
  ],
  createdAt: {
    type: Date,
    default: Date,
  },
});

module.exports = mongoose.model('Jobs', JobSchema);
