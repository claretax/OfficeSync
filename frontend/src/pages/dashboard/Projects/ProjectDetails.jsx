import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import DeadlineExtension from "../../../components/forms/DeadlineExtension";
import Table from "../../../components/tables/Table";
import { formatDate } from "@/lib/utils";
import ProjectLog from "../../../components/forms/ProjectLog";
import { createProjectLog, fetchProjectLogs } from "@/api/projectLog";

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
  const [projectLogs, setProjectLogs] = useState([]);

  useEffect(() => {
    if (project) {
      setStartDate(formatDate(project.startDate));
      setEndDateTeam(formatDate(project.endDateTeam));
      setEndDateClient(formatDate(project.endDateClient));
      fetchExtensions();
      fetchLogs();
    }
  }, [project]);

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
  const handleExtensionAdded = (newExtension) => {
    fetchExtensions();
  };

  const fetchLogs = async () => {
    try {
      const logs = await fetchProjectLogs(project._id);
      setProjectLogs(logs);
    } catch (err) {
      console.error("Failed to fetch project logs:", err);
    }
  };

  const handleLogAdded = async (logData) => {
    await createProjectLog(logData);
    fetchLogs();
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
            {project?.team?.teamLeader?.name || "Not Assigned"}
          </p>
          <div className="flex flex-row gap-2 justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              <strong>Start Date:</strong>
            </label>
            <input
              type="text"
              value={formatDate(startDate, "dd mmm yy")}
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
              type="text"
              value={formatDate(endDateTeam, "dd mmm yy")}
              onChange={handleEndDateTeamChange}
              className="mt-1 max-w-60 p-2 text-gray-500 focus:outline-0 focus:shadow-lg"
            />
          </div>
          <div className="flex flex-row gap-2 justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              <strong>End Date(Client):</strong>
            </label>
            <input
              type="text"
              value={formatDate(endDateClient, "dd mmm yy")}
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
                  accessor: (row) =>
                    row.updatedAt ? formatDate(row.updatedAt, "dd mmm yy") : "",
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
      <div className="mt-8">
        <div className="p-2">
          <h3 className="text-xl font-semibold">Project Logs</h3>
        </div>
        <div className="overflow-x-auto max-h-96 shadow-lg">
          <Table
            columns={[
              { header: "Content", accessor: (row) => row.content },
              { header: "Created By", accessor: (row) => row.createdBy?.name || "-" },
              { header: "Created At", accessor: (row) => row.createdAt ? formatDate(row.createdAt, "dd mmm yy") : "" },
            ]}
            data={projectLogs}
            noDataMessage="No project logs found."
          />
        </div>
        <ProjectLog projectId={project._id} onLogAdded={handleLogAdded} />
      </div>
    </div>
  );
}

export default ProjectDetails;
