import React, { useState, useEffect } from 'react';
import ListDetailsPane from '../../../layouts/ListDetailsPane';
import ProjectsList from './ProjectsList';
import ProjectDetails from './ProjectDetails';
import axios from 'axios';
const token = localStorage.getItem('token')

function ProjectsView() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {headers:{
            'x-auth-token': token
        }})
        setProjects(response.data);
        // Optionally select the first project by default
        if (response.data.length > 0) {
          setSelectedProjectId(response.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const selectedProject = projects.find(p => p._id === selectedProjectId);

  const handleAddProject = async (newProject) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/projects`, newProject, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
  
      const addedProject = response.data;
      setProjects([...projects, addedProject]);
      setSelectedProjectId(addedProject._id);
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };
  

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }


  return (
    <ListDetailsPane
      leftContent={
        <ProjectsList
          projects={projects}
          onSelectProject={setSelectedProjectId}
          selectedProjectId={selectedProjectId}
          onAddProject={handleAddProject}
        />
      }
      rightContent={
        <ProjectDetails
          project={selectedProject}
        />
      }
    />
  );
}

export default ProjectsView;