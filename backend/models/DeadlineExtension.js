const mongoose = require('mongoose');

const deadlineExtensionSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
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
  requestedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
deadlineExtensionSchema.index({ project: 1 });
deadlineExtensionSchema.index({ requestedBy: 1 });

const DeadlineExtension = mongoose.model('DeadlineExtension', deadlineExtensionSchema);

module.exports = DeadlineExtension; 