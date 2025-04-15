const mongoose = require('mongoose');

const deadlineExtensionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  oldDeadline: {
    type: Date,
    required: true
  },
  newDeadline: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['client_delay', 'resource_issue', 'scope_change', 'technical_issue', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
deadlineExtensionSchema.index({ task: 1 });
deadlineExtensionSchema.index({ requestedBy: 1 });
deadlineExtensionSchema.index({ status: 1 });

const DeadlineExtension = mongoose.model('DeadlineExtension', deadlineExtensionSchema);

module.exports = DeadlineExtension; 