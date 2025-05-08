import { API_URL } from "@/constants";
import axios from "axios";

const getUsers = async () => {
  try {
    const response = await axios(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    return [];
  }
}
const getTeamLeaders = async () => {
  try {
    const response = await axios(`${API_URL}/users`);
    const teamLeaders = response.data.filter(user => user.role === 'project_lead');
    return teamLeaders;
  } catch (error) {
    return [];
  }
}
const getTeamMembers = async () => {
  
}

export { getUsers, getTeamLeaders };