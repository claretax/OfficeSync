const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String },
  whatsapp_number: { type: String },
  address: { type: String },
  additional_info: { type: Map, of: String }, // Flexible field for extra CSV data
}, { timestamps: true });

// Ensure uniqueness on phone_number
contactSchema.index({ phone_number: 1 }, { unique: true });

module.exports = mongoose.model('Contact', contactSchema);