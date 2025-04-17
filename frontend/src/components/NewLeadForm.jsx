import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_URL} from '../constants'
import { useNavigate } from 'react-router-dom';

const NewLeadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    remark: '',
    client: '',
  });

  const [managers, setManagers] = useState([]);
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
  
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL+'/api/leads', formData);
      alert('Project created successfully!');
      
    } catch (error) {
      console.error(error);
      alert('Error creating project.');
    }
  };

  const getManagers = async ()=>{
    const response = await axios.get(API_URL+'/api/auth/users/manager');
    setManagers(response.data);
    return response.data;
  }

  const getClients = async ()=>{
    const response = await axios.get(API_URL+'/api/auth/users/client');
    setClients(response.data);
    return response.data;
  }


  useEffect(() => {
    getManagers()
    getClients()
  }, [])

  return (
    <div className="bg-white p-8 rounded-lg shadow mt-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Lead</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Lead Name"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <textarea
          name="remark"
          placeholder="Lead Description"
          value={formData.remark}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

<input
          type="text"
          name="requestedData"
          placeholder="requested Data"
          value={formData.requesetedData}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            type="text"
            name="client"
            placeholder="Client ID"
            value={formData.client}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Client</option>
            {/* Assuming clients is an array of client objects with id and name */}
            {clients.map(client => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
            </select>
        </div>
        {/* <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        /> */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Lead
        </button>
      </form>
    </div>
  );
};

export default NewLeadForm;
