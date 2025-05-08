import { getClients } from "@/api/clients";
import { getUsers } from "@/api/users";
import React, { useState, useEffect } from "react";

function Users() {
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    
    useEffect(() => {
      const fetchUsers = async () => {
        const users = await getUsers();
        setUsers(users);
        const clients = await getClients()
        setClients(clients);
      }
      fetchUsers();
    }, []);

return (
  <div>
    <div>
    <h1>Users</h1>
    <ul>
      {users.map((user, index) => (
        <li key={index} className="bg-blue-100 m-1">
          <span className="font-bold">{user.name}</span>
          <span> {user.email}</span>
        </li>
      ))}
    </ul>
    </div>
    <div>
    <h1>clients</h1>
    <ul>
      {clients.map((user, index) => (
        <li key={index} className="bg-blue-100 m-1">
          <span className="font-bold">{user.name}</span>
          <span> {user.email}</span>
        </li>
      ))}
    </ul>
    </div>
  </div>
)};
export default Users;