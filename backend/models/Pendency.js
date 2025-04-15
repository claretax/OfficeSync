const mongoose = require('mongoose');

const pendencySchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['client_side', 'our_side', 'third_party'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    enum: [
      'awaiting_client_feedback',
      'client_approval_pending',
      'resource_unavailability',
      'technical_issue',
      'scope_change',
      'vendor_delay',
      'other'
    ],
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expectedResolutionDate: {
    type: Date
  },
  actualResolutionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  },
  impact: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
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
  }],
  attachments: [{
    filename: String,
    path: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolutionNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
pendencySchema.index({ task: 1 });
pendencySchema.index({ reportedBy: 1 });
pendencySchema.index({ status: 1 });
pendencySchema.index({ category: 1 });
pendencySchema.index({ startDate: 1 });

const Pendency = mongoose.model('Pendency', pendencySchema);

module.exports = Pendency; 