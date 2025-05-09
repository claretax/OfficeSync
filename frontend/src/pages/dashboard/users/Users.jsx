import { getUsers } from "@/api/users";
import React, { useState, useEffect } from "react";
import Table from "@/components/tables/Table";
import { getTeams } from "@/api/teams";
import { getClients } from "@/api/clients";

function Users() {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, clientsData, teamsData] = await Promise.all([
          getUsers(),
          getClients(),
          getTeams()
        ]);
        setUsers(usersData);
        setClients(clientsData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const userColumns = [
    { header: "Name", accessor: (user) => user.name },
    { header: "Email", accessor: (user) => user.email },
    { header: "Role", accessor: (user) => user.role },
  ];

  const clientColumns = [
    { header: "Client Name", accessor: (client) => client.name },
    { header: "Email", accessor: (client) => client.email },
    { header: "Company", accessor: (client) => client.companyName }
  ];

  const teamColumns = [
    { header: "Team Name", accessor: (team) => team.name },
    { header: "Leader", accessor: (team) => team.teamLeader?.name || "Not assigned" },
    { header: "Members", accessor: (team) => team?.teamMembers?.length || "0" }
  ];

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <Table
          columns={userColumns}
          data={users}
          noDataMessage="No users found"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Clients</h2>
        <Table
          columns={clientColumns}
          data={clients}
          noDataMessage="No clients found"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Teams</h2>
        <Table
          columns={teamColumns}
          data={teams}
          noDataMessage="No teams found"
        />
      </div>
    </div>
  );
}

export default Users;