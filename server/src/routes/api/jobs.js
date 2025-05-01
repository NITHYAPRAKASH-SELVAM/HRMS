const express = require('express');
const router = express.Router();
const authorization = require('../../middlewares/authorization');
const Job = require('../../models/Job');
const { STUDENT, COMPANY } = require('../../constants/roles');

// Get all jobs for company or all jobs for others
router.get('/', authorization, (req, res) => {
  const { _id, role } = req.user;

  if (role === COMPANY) {
    return Job.find({ _companyId: _id })
      .populate('applicants') // Populate applicants with detailed student info
      .then(jobs => res.status(200).send(jobs))
      .catch(error => res.status(400).send({ message: error.message }));
  }

  Job.find({})
    .populate('applicants') // Populate applicants with detailed student info
    .then(jobs => res.status(200).send(jobs))
    .catch(error => res.status(400).send({ message: error.message }));
});

// Create a new job posting
router.post('/', authorization, (req, res) => {
  const { _id, role } = req.user;
  const { title, description } = req.body;

  if (role !== COMPANY) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  const job = new Job({
    _companyId: _id,
    title,
    description,
  });

  job
    .save()
    .then(data => res.status(200).send(data))
    .catch(error => res.status(400).send({ message: error.message }));
});

// Get a single job with applicants' detailed info
router.get('/:id', authorization, (req, res) => {
  const { _id, role } = req.user;

  if (role === COMPANY) {
    return Job.find({ _id: req.params.id, _companyId: _id })
      .populate('applicants') // Populate applicants with detailed student info
      .then(job => res.status(200).send(job))
      .catch(error => res.status(400).send({ message: error.message }));
  }

  Job.findById(req.params.id)
    .populate('applicants') // Populate applicants with detailed student info
    .then(job => res.status(200).send(job))
    .catch(error => res.status(400).send({ message: error.message }));
});

// Apply for a job (only for students)
router.patch('/:id/apply', authorization, (req, res) => {
  const { _id, role } = req.user;

  if (role !== STUDENT) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  Job.findById(req.params.id)
    .then(job => {
      const applicants = job.applicants;
      if (!applicants.includes(_id)) {
        applicants.push(_id);
      }

      return Job.updateOne({ _id: req.params.id }, { $set: { applicants } });
    })
    .then(success => res.status(200).send(success.nModified ? 'Applied successfully' : 'Already applied'))
    .catch(error => res.status(400).send({ message: error.message }));
});

// Delete a job (only for companies)
router.delete('/:id', authorization, (req, res) => {
  const { _id, role } = req.user;

  if (role === STUDENT) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  if (role === COMPANY) {
    return Job.deleteOne({ _id: req.params.id, _companyId: _id })
      .then(success => res.status(200).send(success.deletedCount.toString()))
      .catch(error => res.status(400).send({ message: error.message }));
  }

  Job.deleteOne({ _id: req.params.id })
    .then(success => res.status(200).send(success.deletedCount.toString()))
    .catch(error => res.status(400).send({ message: error.message }));
});

module.exports = router;
