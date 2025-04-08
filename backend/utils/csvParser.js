const fs = require('fs');
const { parse } = require('csv-parse');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => {
        const contact = {
          name: row.name,
          phone_number: row.phone_number,
          email: row.email || '',
          whatsapp_number: row.whatsapp_number || '',
          address: row.address || '',
          additional_info: {},
        };
        // Capture any extra fields dynamically
        for (const key in row) {
          if (!['name', 'phone_number', 'email', 'whatsapp_number', 'address'].includes(key)) {
            contact.additional_info[key] = row[key];
          }
        }
        results.push(contact);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

module.exports = { parseCSV };