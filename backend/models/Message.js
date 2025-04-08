const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  contact_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  template_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageTemplate', required: true },
  mobile_id:{type:String, required: true},
  status: { type: String, default: 'Pending', enum: ['Pending', 'Sent', 'Failed'] },
  datetime: { type: Date, default: Date.now },
}, { timestamps: true });

// Unique index to prevent duplicate messages for the same contact and template
messageSchema.index({ contact_id: 1, template_id: 1 }, { unique: true });

module.exports = mongoose.model('Message', messageSchema);