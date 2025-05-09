import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProjectOverlay from '../../../components/AddProjectOverlay';
import { getClients } from '@/api/clients';
import { deleteProject } from '@/api/projects';

function ProjectsList({ projects, onSelectProject, selectedProjectId, onAddProject, onDeleteProject }) {
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [clients, setClients] = useState([]);
  
  // Fetch teams and clients for the dropdown menus
  useEffect(() => {
    // Fetch teams
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/teams`);
        if (response.status === 200) {
          setTeams(response.data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    // Fetch clients
    const fetchClients = async () => {
      try {
          setClients(await getClients());
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    if (isAddOverlayOpen) {
      fetchTeams();
      fetchClients();
    }
  }, [isAddOverlayOpen]);
  
  const filteredProjects = projects?.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const handleAddProject = (newProject) => {
    if (onAddProject) {
      onAddProject(newProject);
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    
    // Add confirmation dialog
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        onDeleteProject(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };
  
  if (!projects || projects.length === 0) {
    return (
      <div className=''>
        <div className='flex justify-between bg-gray-200 p-2'>
          <div></div>
          <button 
            onClick={() => setIsAddOverlayOpen(true)}
            className='bg-blue-500 pt-1 pb-1 pr-4 pl-4 rounded-md text-white hover:bg-blue-300'
          >
            Add
          </button>
        </div>
        <p className="p-4">No projects found.</p>
        <AddProjectOverlay 
          isOpen={isAddOverlayOpen} 
          onClose={() => setIsAddOverlayOpen(false)} 
          onAddProject={handleAddProject}
          teams={teams}
          clients={clients}
        />
      </div>
    );
  }

  return (
    <div className=''>
      {/* List header */}
      <div className='flex justify-between bg-gray-200 p-2' >
        <input 
          type="text" 
          placeholder='Search Project' 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='bg-transparent p-1 rounded-md focus:outline-0 focus:bg-white'
        />
        <button 
          onClick={() => setIsAddOverlayOpen(true)}
          className='bg-blue-500 pt-1 pb-1 pr-4 pl-4 rounded-md text-white hover:bg-blue-300'
        >
          Add
        </button>
      </div>
      <ul>
        {filteredProjects.map(project => (
          <li
            key={project._id}
            className={`flex justify-between items-center p-3 cursor-pointer border-b hover:bg-blue-50 ${selectedProjectId === project._id ? 'bg-blue-100 font-semibold' : ''}`}
            onClick={() => onSelectProject(project._id)}
          >
            <span>{project.name}</span>
      <button
        onClick={(e) => handleDeleteProject(project._id, e)}
        className="text-red-500 hover:text-red-700 px-2 "
      >
        X
      </button>

          </li>
        ))}
      </ul>
      
      <AddProjectOverlay 
        isOpen={isAddOverlayOpen} 
        onClose={() => setIsAddOverlayOpen(false)} 
        onAddProject={handleAddProject}
        teams={teams}
        clients={clients}
      />
    </div>
  );
}

export default ProjectsList;