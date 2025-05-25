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
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Students', required: true },
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
JobSchema.index({ _companyId: 1 });
JobSchema.index({ 'applicants.studentId': 1 });

module.exports = mongoose.model('Jobs', JobSchema);
