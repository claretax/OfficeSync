import React from 'react';

function ProjectDetails({ project }) {
  if (!project) {
    return <p className="p-4 text-gray-600">Select a project from the list.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      <p className="mb-4">{project.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
        <p><strong>Team Leader:</strong> {project.team.teamLeader.name}</p>
        <p><strong>Client:</strong> {project.client.name}</p>
        <p><strong>Priority:</strong> {project.priority}</p>
        <p className="col-span-2"><strong>Tags:</strong> {project.tags ? project.tags.join(', ') : 'None'}</p>
      </div>
      {/* Add more project details as needed */}
    </div>
  );
}

export default ProjectDetails;