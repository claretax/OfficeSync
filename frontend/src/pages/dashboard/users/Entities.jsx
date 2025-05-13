import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { getUsers } from "@/api/users";
import { getTeams } from "@/api/teams";
import { getClients } from "@/api/clients";

function Entities() {
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
        console.log(teamsData);
        setUsers(usersData);
        setClients(clientsData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? users.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2"><Edit size={16} /></Button>
                  <Button variant="destructive" size="sm"><Trash size={16} /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? clients.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.companyName}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2"><Edit size={16} /></Button>
                  <Button variant="destructive" size="sm"><Trash size={16} /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Leader</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length > 0 ? teams.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.teamLeader.name || 'N/A'}</TableCell>
                <TableCell>{user.teamMembers.length}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2"><Edit size={16} /></Button>
                  <Button variant="destructive" size="sm"><Trash size={16} /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Repeat similar structure for Clients and Teams, adding Actions column */}
    </div>
  );
}

export default Entities;