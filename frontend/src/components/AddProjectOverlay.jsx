import React, { useState, useEffect } from 'react';
import axios from 'axios';
const token = localStorage.getItem('token');
import Select from 'react-select';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import AddTeam from './forms/AddTeam';
import AddClient from './forms/AddClient';
import { getClients } from '@/api/clients';
import { getTeams } from '@/api/teams';
import { addProject } from '@/api/projects';

function AddProjectOverlay({ isOpen, onClose, onAddProject }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDateTeam: '',
    endDateClient: '',
    team: '',
    clients: [],
    priority: 'medium',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [clientInput, setClientInput] = useState('');
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openClientDialog, setOpenClientDialog] = useState(false);
  const [clients, setClients] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setClients(await getClients());
        setTeams(await getTeams());

      }catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchClients();
  }, [])

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearDate = nextYear.toISOString().split('T')[0];

      setFormData(prev => ({
        ...prev,
        startDate: today,
        endDateTeam: nextYearDate,
        endDateClient: nextYearDate
      }));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddTeam = (newTeam) => {
    // Update teams state
    setTeams(prev => [...prev, newTeam]);
    
    // Update form data with new team
    setFormData(prev => ({
      ...prev,
      team: newTeam._id
    }));
    
    setOpenTeamDialog(false);
  };

  const handleAddClient = (newClient) => {
    // Update clients state
    setClients(prev => [...prev, newClient]);

    // Update form data with new client
    setFormData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient._id]
    }));

    setOpenClientDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const projectData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDateTeam: new Date(formData.endDateTeam).toISOString(),
      endDateClient: new Date(formData.endDateClient).toISOString()
    };

    try {
      onAddProject(projectData);
      // Reset form
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDateTeam: '',
        endDateClient: '',
        team: '',
        clients: [],
        priority: 'medium',
        tags: []
      });
      setTagInput('');
      setClientInput('');
      onClose();
    } catch (error) {
      console.error('Error adding project:', error);
      // Handle error appropriately
    }
  };

  const clientOptions = clients.map(client => ({
    value: client._id,
    label: `${client.name} (${client.email})`
  }));


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date*
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* End Date Team */}
          <div>
            <label htmlFor="endDateTeam" className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Team)*
            </label>
            <input
              type="date"
              id="endDateTeam"
              name="endDateTeam"
              value={formData.endDateTeam}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* End Date Client */}
          <div>
            <label htmlFor="endDateClient" className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Client)*
            </label>
            <input
              type="date"
              id="endDateClient"
              name="endDateClient"
              value={formData.endDateClient}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Team */}
          <div>
            <Label>Team*</Label>
            <div className="flex gap-2">
              <select
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <Button type="button" onClick={() => setOpenTeamDialog(true)}>
                Add New
              </Button>
            </div>
          </div>

          {/* Clients */}
          <div className="md:col-span-2">
            <Label>Clients</Label>
            <div className="flex gap-2">
              <Select
                isMulti
                options={clientOptions}
                value={clientOptions.filter(option => formData.clients.includes(option.value))}
                onChange={(selectedOptions) => {
                  const selectedIds = selectedOptions.map(option => option.value);
                  setFormData(prev => ({
                    ...prev,
                    clients: selectedIds
                  }));
                }}
                className="react-select-container w-full"
                classNamePrefix="react-select"
                placeholder="Search and select clients..."
              />
              <Button type="button" onAddClient = {handleAddClient} onClick={() => setOpenClientDialog(true)}>
                Add New
              </Button>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            {/* Display tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
      {/* Add Team Dialog */
        openTeamDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <AddTeam onClose={() => setOpenTeamDialog(false)} onAddTeam={handleAddTeam} />
            </div>
          </div>
        )}
      {/* Add Team Dialog */
        openClientDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <AddClient onClose={() => setOpenClientDialog(false)} onAddClient = {handleAddClient} />
            </div>
          </div>
        )}
    </div>
  );
}

export default AddProjectOverlay;