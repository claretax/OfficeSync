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
    enum: ['team_leader', 'team_member', 'admin'],
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
  ruleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotificationRule',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
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
  channel: {
    type: String,
    enum: ['whatsapp'],
    default: 'whatsapp'
  },
  errorMessage: {
    type: String // Stores error details if status is 'failed'
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
notificationSchema.index({ status: 1 });
notificationSchema.index({ projectId: 1 });
notificationSchema.index({ recipientId: 1 });

// Update updatedAt on save
notificationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const NotificationRule = mongoose.model('NotificationRule', notificationRuleSchema);
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { NotificationRule, Notification };