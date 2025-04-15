const express = require('express');
const router = express.Router();
const authorization = require('../../middlewares/authorization');

const Admin = require('../../models/Admin');
const Company = require('../../models/Company');
const Student = require('../../models/Student');

const { ADMIN, COMPANY, STUDENT } = require('../../constants/roles');

router.patch('/', authorization, (req, res) => {
  const { _id, role } = req.user;
  const {
    firstName,
    lastName,
    companyName,
    companyEmail,
    companyPhone,
    phone,
    objective,
    skills,
    certifications,
    education,
    experience,
    projects,
    references,
  } = req.body;

  if (role === ADMIN)
    return Admin.updateOne({ _id }, { $set: { firstName, lastName } })
      .then(success => res.status(200).send(success.nModified))
      .catch(error => res.status(400).send({ message: error.message }));

  if (role === COMPANY)
    return Company.updateOne(
      { _id },
      { $set: { firstName, lastName, companyName, companyEmail, companyPhone } }
    )
      .then(success => res.status(200).send(success.nModified))
      .catch(error => res.status(400).send({ message: error.message }));

  if (role === STUDENT)
    return Student.updateOne(
      { _id },
      {
        $set: {
          firstName,
          lastName,
          phone,
          objective,
          skills, // Assuming this is an array of strings
          certifications, // Assuming this is an array of strings
          education, // Array of education objects
          experience, // Array of experience objects
          projects, // Array of project objects
          references, // Array of reference objects
        },
      }
    )
      .then(success => res.status(200).send(success.nModified))
      .catch(error => res.status(400).send({ message: error.message }));
});


module.exports = router;
