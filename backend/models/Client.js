const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Client's full name or business name
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String }, // Single-line address
  companyName: { type: String }, // If different from 'name'
  contactPerson: { type: String }, // If there's a liaison
  industry: { type: String }, // e.g., IT, Healthcare, etc.
  taxId: { type: String }, // GSTIN, VAT, etc. if applicable
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  notes: { type: String }, // Extra details
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;