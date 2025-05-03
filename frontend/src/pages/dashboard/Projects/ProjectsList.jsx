import React from 'react';

function ProjectsList({ projects, onSelectProject, selectedProjectId }) {
  if (!projects || projects.length === 0) {
    return <p className="p-4">No projects found.</p>;
  }

  return (
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
  );
}

export default ProjectsList;