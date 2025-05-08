require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('./models/Contact');
require('./models/MessageTemplate');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://rdmodels:YFpB8St0asdssde@dssdds.s7wamg6.mongodb.net/', {})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/deadline-extensions', require('./routes/deadlineExtensions'));
app.use('/api/pendencies', require('./routes/pendencies'));
app.use('/api/teams', require('./routes/teamRoutes'))
app.use('/api/clients', require('./routes/clientRoutes'))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
