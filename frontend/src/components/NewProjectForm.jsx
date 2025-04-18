import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_URL} from '../constants'

const NewProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'not_started',
    startDate: '',
    endDate: '',
    progress: 0,
    manager: '',
    teamMembers: '',
    client: '',
    budget: '',
    priority: 'medium',
    customFields: {
      techStack: '',
      location: '',
      deliveryMode: ''
    },
    tags: ''
  });

  const [managers, setManagers] = useState([]);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('customFields.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [key]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      teamMembers: formData.teamMembers.split(',').map(id => id.trim()),
      tags: formData.tags.split(',').map(tag => tag.trim())
    };

    try {
      await axios.post('/projects', finalData);
      alert('Project created successfully!');
    } catch (error) {
      console.error(error);
      alert('Error creating project.');
    }
  };

  const getManagers = async ()=>{
    const response = await axios.get(API_URL+'/auth/users/manager');
    setManagers(response.data);
    return response.data;
  }

  const getClients = async ()=>{
    const response = await axios.get(API_URL+'/auth/users/client');
    setClients(response.data);
    return response.data;
  }


  useEffect(() => {
    getManagers()
    getClients()
  }, [])

  return (
    <div className="bg-white p-8 rounded-lg shadow mt-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            type="number"
            name="progress"
            value={formData.progress}
            min="0"
            max="100"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Progress %"
          />
          <select
            name="manager"
            placeholder="Manager ID"
            value={formData.manager}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select Manager</option>
            {/* Assuming managers is an array of manager objects with id and name */}
            {managers.map(manager => (
              <option key={manager._id} value={manager._id}>
                {manager.name}
              </option>
            ))}
            </select>

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

        <input
          type="text"
          name="teamMembers"
          placeholder="Team Member IDs (comma separated)"
          value={formData.teamMembers}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default NewProjectForm;
