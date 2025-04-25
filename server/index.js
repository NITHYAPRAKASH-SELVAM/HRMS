const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Import routers
const authRouter = require('./src/routes/api/auth');
const companiesRouter = require('./src/routes/api/companies');
const studentsRouter = require('./src/routes/api/students');
const jobsRouter = require('./src/routes/api/jobs');
const profileRouter = require('./src/routes/api/profile');

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://arjcrs:CJWeBLqmzlnAaUBh@arjcrs.vfpvp3w.mongodb.net/hrmsDB')
  .then(() => console.log('✅ Connected to DB!'))
  .catch(error => console.error('❌ DB Connection Error:', error));

// Create Express app
const app = express();
const PORT = 5000;
const HOST = 'localhost';

// Middleware
app.use(helmet());
app.use(logger('dev'));
const appUrl = 'https://hrms-five-xi.vercel.app';

app.use(cors({
  origin: appUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS']
}));

app.options('*', cors({
  origin: appUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/user', authRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/students', studentsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/profile', profileRouter);

// Welcome route
app.get('/', (req, res) => {
  res.send('🎉 Welcome to the HRMS API!');
});

// 404 route
app.use((req, res) => res.status(404).send('404 - Not Found'));

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
