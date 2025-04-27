require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const logger = require('morgan');
const cors = require('cors');

// Import routers
const authRouter = require('./src/routes/api/auth');
const companiesRouter = require('./src/routes/api/companies');
const studentsRouter = require('./src/routes/api/students');
const jobsRouter = require('./src/routes/api/jobs');
const profileRouter = require('./src/routes/api/profile');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to DB!'))
  .catch(error => console.error('❌ DB Connection Error:', error));

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(helmet());
app.use(logger('dev'));

// CORS
const allowedOrigins = [
  'http://localhost:3000',  // local frontend
  process.env.FRONTEND_URL  // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
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
