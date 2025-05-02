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
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Students' },
      status: {
        type: String,
        enum: ['pending', 'accept', 'reject'],  
        default: 'pending',
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Jobs', JobSchema);
