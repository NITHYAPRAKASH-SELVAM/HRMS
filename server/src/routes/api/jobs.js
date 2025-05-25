const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // ✅ Needed for ObjectId conversion
const authorization = require('../../middlewares/authorization');
const Job = require('../../models/Job');
const { screenApplicant } = require('../../ml/screen_wrapper'); // Correct path to screen_wrapper.js
const { rankApplicants } = require('../../ml/index');           // Correct path to index.js (where rankApplicants is exported)

const { STUDENT, COMPANY } = require('../../constants/roles');

// ✅ Updated: GET Jobs applied by the logged-in student (returns only student's own applicant info)
router.get('/applied/me', authorization, async (req, res) => {
  const { _id, role } = req.user;

  if (role !== STUDENT) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  try {
    const appliedJobs = await Job.find(
      { 'applicants.studentId': _id },
      '_id title description applicants'
    );

    const filteredJobs = appliedJobs.map(job => {
      const applicant = job.applicants.find(app =>
        app?.studentId?.toString() === _id?.toString()
      );

      console.log('🔍 Matched applicant for job', job._id, ':', applicant); // ✅ Debug

      return {
        _id: job._id,
        title: job.title,
        description: job.description,
        applicant, // only current student’s application
      };
    });

    res.status(200).send(filteredJobs); // ✅ correct place for response
  } catch (error) {
    console.error('❌ Fetch Applied Jobs Error:', error);
    res.status(400).send({ message: error.message });
  }
});


// ✅ POST: Create a new job (company only)
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
    console.error('❌ Create Job Error:', error);
    res.status(400).send({ message: error.message });
  }
});

// ✅ GET: Single job with applicant details
router.get('/:id', authorization, async (req, res) => {
  const { _id, role } = req.user;

  try {
    const query = role === COMPANY
      ? { _id: req.params.id, _companyId: _id }
      : { _id: req.params.id };

    const job = await Job.findOne(query).populate('applicants.studentId');

    if (!job) return res.status(404).send({ message: 'Job not found.' });

    res.status(200).send(job);
  } catch (error) {
    console.error('❌ Get Job Error:', error);
    res.status(400).send({ message: error.message });
  }
});

// ✅ PATCH: Apply to a job (student only)
router.patch('/:id/apply', authorization, async (req, res) => {
  const { _id: studentId, role } = req.user;

  if (role !== STUDENT) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).send({ message: 'Job not found.' });

    const alreadyApplied = job.applicants.some(app =>
      app?.studentId?.toString() === studentId.toString()
    );
    

    if (alreadyApplied) {
      return res.status(400).send({ message: 'Already applied to this job.' });
    }

    job.applicants.push({
      studentId: new mongoose.Types.ObjectId(studentId),
      status: 'pending',
    });

    await job.save();
    res.status(200).send({ message: 'Applied successfully.' });
  } catch (error) {
    console.error('❌ Apply Error:', error);
    res.status(400).send({ message: error.message });
  }
});

// ✅ PATCH: Update applicant status (company only)
router.patch('/:jobId/status', authorization, async (req, res) => {
  const { _id, role } = req.user;
  const { jobId } = req.params;
  const { studentId, status } = req.body;

  if (role !== COMPANY) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  if (!['pending', 'accept', 'reject'].includes(status)) {
    return res.status(400).send({ message: 'Invalid status.' });
  }

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).send({ message: 'Job not found.' });
    }

    const applicant = job.applicants.find(
      app => app.studentId.toString() === studentId.toString()
    );

    if (!applicant) {
      return res.status(404).send({ message: 'Applicant not found.' });
    }

    applicant.status = status;

    await job.save();
    res.status(200).send({ message: 'Applicant status updated successfully.' });
  } catch (error) {
    console.error('❌ Status Update Error:', error);
    res.status(400).send({ message: error.message });
  }
});

// ✅ DELETE: Remove job (company or admin)
router.delete('/:id', authorization, async (req, res) => {
  const { _id, role } = req.user;

  try {
    const deleteFilter = role === COMPANY
      ? { _id: req.params.id, _companyId: _id }
      : { _id: req.params.id };

    const result = await Job.deleteOne(deleteFilter);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Job not found or access denied.' });
    }

    res.status(200).send({ message: 'Job deleted successfully.' });
  } catch (error) {
    console.error('❌ Delete Job Error:', error);
    res.status(400).send({ message: error.message });
  }
});
router.get('/', authorization, async (req, res) => {
  const { _id, role } = req.user;

  try {
    const query = role === COMPANY ? { _companyId: _id } : {};
    const jobs = await Job.find(query);
    res.status(200).send(jobs);
  } catch (error) {
    console.error('❌ Fetch Jobs Error:', error);
    res.status(400).send({ message: error.message });
  }
});
router.get('/:id/ranked-applicants', async (req, res) => {
  const job = await Job.findById(req.params.id).populate('applicants.studentId');
  const jobDesc = job.description;
  const applicants = job.applicants.map(a => a.studentId);

  const ranked = await rankApplicants(applicants, jobDesc); // call Python or internal method
  res.json(ranked);
});

module.exports = router;
