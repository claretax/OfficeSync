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
    enum: ['project_lead', 'employee', 'admin', 'manager'],
    default: []
  }],
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
    notifications: [{
      recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      message: {
        type: String,
        required: true // e.g., "New project Project X assigned to you"
      },
      status: {
        type: String,
        enum: ['pending', 'fetched', 'sent', 'failed'],
        default: 'pending'
      },
      errorMessage: {
        type: String // Stores error details if status is 'failed'
      },
      sentAt: {
        type: Date
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