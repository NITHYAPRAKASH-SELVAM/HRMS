const express = require('express');
const router = express.Router();
const authorization = require('../../middlewares/authorization');
const Job = require('../../models/Job');
const { STUDENT, COMPANY } = require('../../constants/roles');

// Get all jobs for company or all jobs for others
router.get('/', authorization, async (req, res) => {
  const { _id, role } = req.user;

  try {
    const jobs = role === COMPANY
      ? await Job.find({ _companyId: _id }).populate('applicants.studentId')
      : await Job.find().populate('applicants.studentId');

    res.status(200).send(jobs);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Create a new job posting
router.post('/', authorization, async (req, res) => {
  const { _id, role } = req.user;
  const { title, description } = req.body;

  if (role !== COMPANY) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  try {
    const job = new Job({ _companyId: _id, title, description });
    const saved = await job.save();
    res.status(200).send(saved);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Get a single job with applicants' detailed info
router.get('/:id', authorization, async (req, res) => {
  const { _id, role } = req.user;

  try {
    const query = role === COMPANY
      ? { _id: req.params.id, _companyId: _id }
      : { _id: req.params.id };

    const job = await Job.findOne(query).populate('applicants.studentId');
    res.status(200).send(job);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Apply for a job (only for students)
router.patch('/:id/apply', authorization, async (req, res) => {
  const { _id: studentId, role } = req.user;

  if (role !== STUDENT) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).send({ message: 'Job not found.' });

    const alreadyApplied = job.applicants.some(app =>
      app.studentId.toString() === studentId
    );

    if (alreadyApplied) {
      return res.status(400).send({ message: 'Already applied to this job.' });
    }

    job.applicants.push({
      studentId: mongoose.Types.ObjectId(studentId),
      status: 'pending',
    });

    await job.save();
    res.status(200).send({ message: 'Applied successfully.' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Delete a job (only for companies or admins)
router.delete('/:id', authorization, async (req, res) => {
  const { _id, role } = req.user;

  try {
    const deleteFilter = role === COMPANY
      ? { _id: req.params.id, _companyId: _id }
      : { _id: req.params.id };

    const result = await Job.deleteOne(deleteFilter);
    res.status(200).send(result.deletedCount.toString());
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// Update applicant status (only for companies)
router.patch('/:jobId/status', authorization, async (req, res) => {
  const { _id, role } = req.user;
  const { jobId } = req.params;
  const { studentId, status } = req.body;

  if (role !== COMPANY) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  // Check if status is valid
  if (!['pending', 'accept', 'reject'].includes(status)) {
    return res.status(400).send({ message: 'Invalid status.' });
  }

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).send({ message: 'Job not found.' });
    }

    // Find the applicant and update their status
    const applicant = job.applicants.find(
      app => app.studentId.toString() === studentId
    );

    if (!applicant) {
      return res.status(404).send({ message: 'Applicant not found.' });
    }

    applicant.status = status;

    // Save the updated job document
    await job.save();
    res.status(200).send({ message: 'Applicant status updated successfully.' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
