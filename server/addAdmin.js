// Import necessary modules
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin'); // Assuming your model is defined in this file

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://arjcrs:CJWeBLqmzlnAaUBh@arjcrs.vfpvp3w.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  // Create a new admin document
  const newAdmin = new Admin({
    "firstName": "Prakash",
    "lastName": "S",
    "email": "Prakash@example.com",
    "password": "123456",
    "role": "admin", 
    "createdAt": "2024-04-15T12:00:00.000Z"
  });

  // Save the admin document to the database
  return newAdmin.save();
})
.then(admin => {
  console.log('Admin created:', admin);
})
.catch(error => {
  console.error('Error connecting to MongoDB Atlas:', error);
});
