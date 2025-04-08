import React from 'react';

const ContactsTable = ({ messages }) => {
  return (
    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>WhatsApp Number</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((contact) => (
          <tr key={contact._id}>
            <td>{contact.name}</td>
            <td>{contact.phone_number}</td>
            <td>{contact.email || '-'}</td>
            <td>{contact.whatsapp_number || '-'}</td>
            <td>{contact.address || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactsTable;