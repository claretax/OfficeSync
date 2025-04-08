import { useEffect, useState } from 'react';
import { API_URL } from '../constants';
import axios from 'axios';

function MessageTable({ dateRange }) {
  const [messages, setMessages] = useState([]);
  const [mobileId, setMobileId] = useState('');

  useEffect(() => {
    axios.get(API_URL+'/messages', {
      params: { ...dateRange, mobileId: mobileId || undefined },
    }).then((res) => setMessages(res.data.messages));
  }, [dateRange, mobileId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Message Logs</h2>
      <select
        value={mobileId}
        onChange={(e) => setMobileId(e.target.value)}
        className="mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Phones</option>
        {[...new Set(messages.map(m => m.mobile_id))].map(id => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">Contact Name</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Phone ID</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="border-t">
                <td className="p-3">{msg.contact_id?.name || 'N/A'}</td>
                <td className="p-3">{msg.contact_id?.phone_number || 'N/A'}</td>
                <td className="p-3">{msg.template_id?.content || 'N/A'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    msg.status === 'Sent' ? 'bg-green-100 text-green-700' :
                    msg.status === 'Failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {msg.status}
                  </span>
                </td>
                <td className="p-3">{msg.mobile_id}</td>
                <td className="p-3">{new Date(msg.datetime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MessageTable;