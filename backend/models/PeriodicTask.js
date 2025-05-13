const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PeriodicTaskSchema = new Schema({
  taskName: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    required: [true, 'Frequency is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  executionTime: {
    type: String, // Stored as HH:mm:ss (e.g., "14:30:00")
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/ // Validates time format
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  status: {
    type: String,
    enum: ['Pending', 'InProgress', 'Completed', 'Overdue'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dependencies: {
    type: [String], // Array of task IDs or names
    default: []
  },
  reminderDays: {
    type: Number,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } // Automatically manage createdAt/updatedAt
});

// Index for efficient querying by startDate and frequency
PeriodicTaskSchema.index({ startDate: 1, frequency: 1 });

// Pre-save hook to ensure endDate is after startDate
PeriodicTaskSchema.pre('save', function(next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

module.exports = mongoose.model('PeriodicTask', PeriodicTaskSchema);