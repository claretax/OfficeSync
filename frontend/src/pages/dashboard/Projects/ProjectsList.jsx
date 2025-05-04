import React from 'react';

function ProjectsList({ projects, onSelectProject, selectedProjectId }) {
  if (!projects || projects.length === 0) {
    return <p className="p-4">No projects found.</p>;
  }

  return (
    <div className=''>
      {/* List header */}
      <div className='flex justify-between bg-gray-200 p-2' >
      <input type="text" name="" placeholder='Search Project' id=""
        className='bg-transparent p-1 rounded-md focus:outline-0 focus:bg-white'
      />
      <button className='bg-blue-500 pt-1 pb-1 pr-4 pl-4 rounded-md text-white hover:bg-blue-300'>Add</button>
      </div>
      <ul>
      {projects.map(project => (
        <li
          key={project._id}
          className={`p-3 cursor-pointer border-b hover:bg-blue-50 ${selectedProjectId === project._id ? 'bg-blue-100 font-semibold' : ''}`}
          onClick={() => onSelectProject(project._id)}
        >
          {project.name}
        </li>
      ))}
    </ul>
    </div>
  );
}

export default ProjectsList;