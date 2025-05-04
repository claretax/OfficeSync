import React, {useState} from 'react';

function ProjectDetails({ project }) {
  const [startDate, setStartDate] = useState(
    project ? new Date(project.startDate).toISOString().split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState(
    project ? new Date(project.endDate).toISOString().split('T')[0] : ''
  );
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    // Optionally, notify parent component or update backend here
    // e.g., onUpdateProject({ ...project, startDate: e.target.value });
  };
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    // Optionally, notify parent component or update backend here
    // e.g., onUpdateProject({ ...project, endDate: e.target.value });
  };

  if (!project) {
    return <p className="p-4 text-gray-600">Select a project from the list.</p>;
  }

  return (
    <div>
      <div className=''>
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      {project.description &&(<p className="mb-4 border-b-2 border-blue-300">{project.description}</p>)}
      <div className="flex flex-wrap justify-between items-center gap-2">
      <p><strong>Team Leader:</strong> {project.team.teamLeader.name}</p>
      <div className='flex flex-row gap-2 justify-between items-center'>
          <label className="block text-sm font-medium text-gray-700">
            <strong>Start Date:</strong>
          </label>
      <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="mt-1 max-w-60 p-2 text-gray-500 focus:outline-0 focus:shadow-lg"
            disabled
          />
          </div>
          <div className='flex flex-row gap-2 justify-between items-center'>
          <label className="block text-sm font-medium text-gray-700">
            <strong>Start Date:</strong>
          </label>
        <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="mt-1 max-w-60 p-2 text-gray-500 focus:outline-0 focus:shadow-lg"
          />
          </div>
        <p><strong>Client:</strong> {project.client.name}</p>
        <p><strong>Priority:</strong> {project.priority}</p>
        <p className="col-span-2"><strong>Tags:</strong> {project.tags ? project.tags.join(', ') : 'None'}</p>
      </div>
      </div>
      {/* Add more project details as needed */}
    </div>  
  );
}

export default ProjectDetails;