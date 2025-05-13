const mongoose = require('mongoose');

// Notification Rule Schema
const notificationRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    required: true // e.g., "project_created", "days_remaining_team < 5", "payment_status = pending"
  },
  recipientRoles: [{
    type: String,
    enum: ['project_lead', 'project_member', 'admin', 'manager'],
    default: []
  }],
  frequency: {
    type: String,
    default: '1d'
  },
  recipientUserIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messageTemplate: {
    type: String,
    required: true // e.g., "New project {name} assigned to you"
  },
  channel: {
    type: String,
    enum: ['whatsapp'],
    default: 'whatsapp'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  rules: [{
    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NotificationRule',
      required: true
    },
    // In the notificationSchema, update the notifications array to better track status:
    
    notifications: [{
      recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      message: {
        type: String,
        required: true
      },
      frequency: {
        type: String,
        default: '1d'
      },
      status: {
        type: String,
        enum: ['pending', 'fetched', 'sent', 'failed', 'read'],  // Added 'read' status
        default: 'pending'
      },
      errorMessage: {
        type: String // Stores error details if status is 'failed'
      },
      sentAt: {
        type: Date
      },
      readAt: {
        type: Date  // Track when notification was read
      },
      deliveredAt: {
        type: Date  // Track when notification was delivered
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }],
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastSentAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
notificationSchema.index({ projectId: 1 }, {unique: true});
notificationSchema.index({ 'rules.ruleId': 1 });
notificationSchema.index({ 'rules.notifications.recipientId': 1 });
notificationSchema.index({ 'rules.notifications.status': 1 });

// Update updatedAt on save
notificationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const NotificationRule = mongoose.model('NotificationRule', notificationRuleSchema);
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { NotificationRule, Notification };