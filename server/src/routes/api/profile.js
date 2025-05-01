const express = require('express');
const router = express.Router();
const authorization = require('../../middlewares/authorization');

const Admin = require('../../models/Admin');
const Company = require('../../models/Company');
const Student = require('../../models/Student');

const { ADMIN, COMPANY, STUDENT } = require('../../constants/roles');

router.patch('/', authorization, (req, res) => {  
  console.log('User Info:', req.user);
  console.log('Received Body:', req.body);

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
          skills, 
          certifications, 
          education, 
          experience, 
          projects,  
          references, 
        },
      }
    )
      .then(success => res.status(200).send(success.nModified))
      .catch(error => res.status(400).send({ message: error.message }));
});
router.get('/', authorization, async (req, res) => {
  const { _id, role } = req.user;

  try {
    let user;

    if (role === 'admin') {
      user = await Admin.findById(_id).select('-password');
    } else if (role === 'company') {
      user = await Company.findById(_id).select('-password');
    } else if (role === 'student') {
      user = await Student.findById(_id).select('-password');
    }

    if (!user) return res.status(404).send({ message: 'User not found.' });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// Get a profile by ID (used for viewing applicants)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let user;

    // Try to find the user in all possible roles
    user = await Student.findById(id).select('-password');
    if (user) return res.status(200).send(user);

    user = await Company.findById(id).select('-password');
    if (user) return res.status(200).send(user);

    user = await Admin.findById(id).select('-password');
    if (user) return res.status(200).send(user);

    return res.status(404).send({ message: 'Profile not found' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});


module.exports = router;
