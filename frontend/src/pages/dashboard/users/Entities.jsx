import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { deleteUser, getUsers } from "@/api/users";
import { getTeams } from "@/api/teams";
import { getClients } from "@/api/clients";
import AddClient from "@/components/forms/AddClient";
import AddTeam from "@/components/forms/AddTeam";
import AddTeamMemberDialog from "@/components/dialogs/AddTeamMemberDialog";
import AddTeamLeaderDialog from "@/components/dialogs/AddTeamLeaderDialog";

function Entities() {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddTL, setShowAddTL] = useState(false);
  const [showAddMem, setShowAddMem] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false); // For AddTeamMemberDialog or AddTeamLeaderDialog

  // Handler examples
  const handleEditUser = (user) => {
    // Open edit dialog or navigate to edit page
    console.log('Edit user:', user);
  };  
  const handleDeleteUser = (user) => {
    const deletedUser = deleteUser(user._id)
    if(deletedUser._id){
      setUsers(users.filter((u) => u._id !== user._id))
    }
  };
  const handleEditClient = (client) => {
    // Open edit dialog or navigate to edit page
    console.log('Edit client:', client);
  };
  const handleDeleteClient = (client) => {
    const deletedClient = deleteClient(client._id)
    if(deletedClient._id){
      setClients(clients.filter((c) => c._id!== client._id))
    }
  }
  const handleEditTeam = (team) => {
    // Open edit dialog or navigate to edit page
    console.log('Edit team:', team);
  };
  const handleDeleteTeam = (team) => {
    const deletedTeam = deleteTeam(team._id)
    if(deletedTeam._id){
      setTeams(teams.filter((t) => t._id!== team._id))
    }
  }
  // Repeat similar handlers for clients and teams if needed
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

  return (
    <div className="p-4">
      {/* Users Section */}
      <div className="mb-8 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Users</h2>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddTL(true)}>Add TL</Button>
            <Button onClick={() => setShowAddMem(true)}>Add Mem</Button>
          </div>
        </div>
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
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditUser(user)}><Edit size={16} /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)}><Trash size={16} /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showAddTL && (
          <AddTeamLeaderDialog
            open={showAddTL}
            onOpenChange={setShowAddTL}
            onAddLeader={user => setUsers([...users, user])}
          />
        )}
        {showAddMem && (
          <AddTeamMemberDialog
            open={showAddMem}
            onOpenChange={setShowAddMem}
            onAddMember={user => setUsers([...users, user])}
          />
        )}
      </div>
      {/* Clients Section (already has Add Client) */}
      <div className="mb-8 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Clients</h2>
          <Button onClick={() => setShowAddClient(true)}>Add Client</Button>
        </div>
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
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClient(user)}><Edit size={16} /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(user)}><Trash size={16} /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showAddClient && (
          <AddClient
            onClose={() => setShowAddClient(false)}
            onAddClient={(client) => setClients([...clients, client])}
          />
        )}
      </div>
      {/* Teams Section */}
      <div className="mb-8 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Teams</h2>
          <Button onClick={() => setShowAddTeam(true)}>Add Team</Button>
        </div>
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
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditTeam(user)}><Edit size={16} /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTeam(user)}><Trash size={16} /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showAddTeam && (
          <AddTeam
            onClose={() => setShowAddTeam(false)}
            onAddTeam={team => setTeams([...teams, team])}
          />
        )}
      </div>
    </div>
  );
}

export default Entities;