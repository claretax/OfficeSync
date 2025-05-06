import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import DeadlineExtension from "../../../components/ui/DeadlineExtension";

function ProjectDetails({ project }) {
  const [deadlineExtensions, setDeadlineExtensions] = useState([]);
  const [startDate, setStartDate] = useState(
    project ? new Date(project.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    project ? new Date(project.endDate).toISOString().split("T")[0] : ""
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

  const fetchExtensions = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/deadline-extensions/${project._id}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setDeadlineExtensions(response.data);
    } catch (error) {
      console.error("Failed to fetch deadline extensions:", error);
    }
  };
  

  useEffect(() => {
    if (project) {
      fetchExtensions();
    }
  }, [project, endDate]);

  const handleExtensionAdded = (newExtension) => {
    fetchExtensions();
      setEndDate(newExtension.newDeadline);
  };

  return (
    <div>
      <div className="">
        <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
        {project.description && (
          <p className="mb-4 border-b-2 border-blue-300">
            {project.description}
          </p>
        )}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <p>
            <strong>Team Leader:</strong> {project?.team.teamLeader.name}
          </p>
          <div className="flex flex-row gap-2 justify-between items-center">
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
          <div className="flex flex-row gap-2 justify-between items-center">
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
          <p>
            <strong>Client:</strong> {project.client.name}
          </p>
          <p>
            <strong>Priority:</strong> {project.priority}
          </p>
          <p className="col-span-2">
            <strong>Tags:</strong>{" "}
            {project.tags ? project.tags.join(", ") : "None"}
          </p>
        </div>
        <div className="mt-4">
          <div className="p-2">
            <h3 className="text-xl font-semibold">Timeline Extensions</h3>
          </div>

          <div className="overflow-x-auto h-96 shadow-lg">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-red-300 text-white">
                <tr>
                  <th className="text-left p-2 uppercase font-semibold">
                    Updated At
                  </th>
                  <th className="text-left p-2 uppercase font-semibold">
                    New Deadline
                  </th>
                  <th className="text-left p-2 uppercase font-semibold">
                    Reason
                  </th>
                  <th className="text-left p-2 uppercase font-semibold">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {deadlineExtensions.length > 0 ? (
                  deadlineExtensions.map((extension, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="p-2">
                        {extension.updatedAt.split("T")[0]}
                      </td>
                      <td className="p-2">
                        {extension.newDeadline.split("T")[0]}
                      </td>
                      <td className="p-2">{extension.reason}</td>
                      <td className="p-2">{extension.category}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-2 text-gray-500">
                      No deadline extensions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <DeadlineExtension projectId= {project._id} onExtensionAdded={handleExtensionAdded} />
          </div>
        </div>
      </div>
      {/* Add more project details as needed */}
    </div>
  );
}

export default ProjectDetails;
