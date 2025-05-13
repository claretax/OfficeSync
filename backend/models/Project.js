const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'on_hold', 'completed', 'cancelled'],
    default: 'not_started'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDateTeam:{
    type:Date,
    required:true
  },
  endDateClient: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  team:{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Team'
  },
  clients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }
},
 {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ name: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
