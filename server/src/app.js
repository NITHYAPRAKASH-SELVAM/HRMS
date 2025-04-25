const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/api/auth');
const companiesRouter = require('./routes/api/companies');
const studentsRouter = require('./routes/api/students');
const jobsRouter = require('./routes/api/jobs');
const profileRouter = require('./routes/api/profile');

mongoose
  .connect('mongodb+srv://arjcrs:CJWeBLqmzlnAaUBh@arjcrs.vfpvp3w.mongodb.net/hrmsDB')
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error));
const app = express();
const appUrl = 'https://hrms-five-xi.vercel.app'

app.use(helmet());
app.use(logger('dev'));
app.use(cors(
  {
    origin: [appUrl],
    methods: ["POST", "GET","PUT"],
    credentials: true
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/user', authRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/students', studentsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/profile', profileRouter);
app.get('/', (req, res) => {
  res.send('🎉 Welcome to the HRMS API!');
});

app.use((req, res) => res.status(404).send('404 - Not Found'));

module.exports = app;
