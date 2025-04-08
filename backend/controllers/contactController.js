const Contact = require('../models/Contact');
const { parseCSV } = require('../utils/csvParser');
const fs = require('fs');

const uploadContacts = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const contacts = await parseCSV(req.file.path);
    console.log(`Parsed ${contacts.length} contacts from CSV`);

    // Check for existing phone numbers
    const phoneNumbers = contacts.map(c => c.phone_number);
    const existingContacts = await Contact.find({ phone_number: { $in: phoneNumbers } });
    const existingPhoneNumbers = new Set(existingContacts.map(c => c.phone_number));

    // Filter out duplicates
    const newContacts = contacts.filter(c => !existingPhoneNumbers.has(c.phone_number));
    const skippedCount = contacts.length - newContacts.length;

    let insertedCount = 0;
    if (newContacts.length > 0) {
      const result = await Contact.insertMany(newContacts, { ordered: false });
      insertedCount = result.length;
    }

    fs.unlinkSync(req.file.path); // Clean up

    res.status(200).json({
      message: 'Contacts processed successfully',
      inserted: insertedCount,
      skipped: skippedCount,
    });
  } catch (err) {
    console.error('Error in uploadContacts:', err);
    fs.unlinkSync(req.file.path); // Clean up
    res.status(500).json({ error: err.message || 'Failed to process upload' });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error in getContacts:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadContacts, getContacts };