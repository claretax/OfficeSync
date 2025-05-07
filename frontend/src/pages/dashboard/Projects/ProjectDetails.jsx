import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import DeadlineExtension from "../../../components/ui/DeadlineExtension";
import Table from "../../../components/ui/Table";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const getDateDifferenceInDays = (date1, date2) => {
  return Math.round(
    (new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24)
  );
};

function ProjectDetails({ project }) {
  const [deadlineExtensions, setDeadlineExtensions] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(project?.startDate));
  const [endDateTeam, setEndDateTeam] = useState(
    formatDate(project?.endDateTeam)
  );
  const [endDateClient, setEndDateClient] = useState(
    formatDate(project?.endDateClient)
  );

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    // Optionally, notify parent component or update backend here
    // e.g., onUpdateProject({ ...project, startDate: e.target.value });
  };
  const handleEndDateTeamChange = (e) => {
    setEndDateTeam(e.target.value);
    // Optionally, notify parent component or update backend here
    // e.g., onUpdateProject({ ...project, endDate: e.target.value });
  };
  const handleEndDateClientChange = (e) => {
    setEndDateClient(e.target.value);
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
      setStartDate(formatDate(project.startDate));
      setEndDateTeam(formatDate(project.endDateTeam));
      setEndDateClient(formatDate(project.endDateClient));
      fetchExtensions();
    }
  }, [project]);

  const handleExtensionAdded = (newExtension) => {
    fetchExtensions();
  };

  return (
    <div>
      <div className="">
        <h2 className="text-2xl font-bold mb-4">{project?.name}</h2>
        {project.description && (
          <p className="mb-4 border-b-2 border-blue-300">
            {project.description}
          </p>
        )}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <p>
            <strong>Team Leader:</strong>{" "}
            {project?.team.teamLeader?.name || "Not Assigned"}
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
              <strong>End Date(Team):</strong>
            </label>
            <input
              type="date"
              value={endDateTeam}
              onChange={handleEndDateTeamChange}
              className="mt-1 max-w-60 p-2 text-gray-500 focus:outline-0 focus:shadow-lg"
            />
          </div>
          <div className="flex flex-row gap-2 justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              <strong>End Date(Client):</strong>
            </label>
            <input
              type="date"
              value={endDateClient}
              onChange={handleEndDateClientChange}
              className="mt-1 max-w-60 p-2 text-gray-500 focus:outline-0 focus:shadow-lg"
            />
          </div>
          <p>
            <strong>Clients:</strong>{" "}
            {project.clients.map((client, index) => (
              <span key={index}>
                {client?.name}-{client.email},{" "}
              </span>
            ))}
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

          <div className="overflow-x-auto max-h-96 shadow-lg">
            <Table
              columns={[
                {
                  header: "Updated At",
                  accessor: (row) => {
                    const date = new Date(row.updatedAt);
                    return isNaN(date.getTime())
                      ? ""
                      : date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        }).replace(/ /g, " ");
                  },
                },
                {
                  header: "Days",
                  accessor: (row) =>
                    `${getDateDifferenceInDays(
                      row.newDeadline,
                      row.oldDeadline
                    )}`,
                },
                { header: "Reason", accessor: (row) => row.reason },
              ]}
              data={deadlineExtensions}
              noDataMessage="No deadline extensions found."
            />
          </div>
          <DeadlineExtension
            projectId={project._id}
            onExtensionAdded={handleExtensionAdded}
          />
        </div>
      </div>
      {/* Add more project details as needed */}
    </div>
  );
}

export default ProjectDetails;
