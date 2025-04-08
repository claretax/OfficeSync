import React, { useState } from 'react';
import { uploadContacts } from '../api';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState({ message: '', inserted: 0, skipped: 0 });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult({ message: '', inserted: 0, skipped: 0 });
  };

  const handleUpload = async () => {
    if (!file) {
      setResult({ message: 'Please select a file', inserted: 0, skipped: 0 });
      return;
    }
    try {
      const res = await uploadContacts(file);
      setResult({
        message: res.data.message,
        inserted: res.data.inserted,
        skipped: res.data.skipped,
      });
      setFile(null);
      onUpload();
    } catch (err) {
      setResult({ message: err.response?.data?.error || 'Upload failed', inserted: 0, skipped: 0 });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      {result.message && (
        <p>
          {result.message} (Inserted: {result.inserted}, Skipped: {result.skipped})
        </p>
      )}
    </div>
  );
};

export default FileUpload;