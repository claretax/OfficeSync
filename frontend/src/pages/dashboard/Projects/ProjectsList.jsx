import React, { useState } from 'react';
import AddProjectOverlay from '../../../components/AddProjectOverlay';

function ProjectsList({ projects, onSelectProject, selectedProjectId, onAddProject }) {
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProjects = projects?.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const handleAddProject = (newProject) => {
    if (onAddProject) {
      onAddProject(newProject);
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
            className={`p-3 cursor-pointer border-b hover:bg-blue-50 ${selectedProjectId === project._id ? 'bg-blue-100 font-semibold' : ''}`}
            onClick={() => onSelectProject(project._id)}
          >
            {project.name}
          </li>
        ))}
      </ul>
      
      <AddProjectOverlay 
        isOpen={isAddOverlayOpen} 
        onClose={() => setIsAddOverlayOpen(false)} 
        onAddProject={handleAddProject}
      />
    </div>
  );
}

export default ProjectsList;