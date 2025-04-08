import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ContactsTable from '../components/ContactsTable';
import { fetchContacts } from '../api'; // Only import what we need

const Home = () => {
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    try {
      const res = await fetchContacts();
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>SMS Management Dashboard</h1>
      <FileUpload onUpload={loadMessages} />
      <h2>Contacts</h2> {/* Updated heading to reflect data */}
      <ContactsTable messages={messages} />
    </div>
  );
};

export default Home;