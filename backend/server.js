const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const contactRoutes = require('./routes/contactRoutes');
const templateRoutes = require('./routes/templateRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/messages', messageRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));