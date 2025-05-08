import { API_URL } from "@/constants";
import axios from "axios";

const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    return null;
  }
}

const getUsers = async () => {
  try {
    const response = await axios(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    return [];
  }
}
const getUsersByRole = async (role) => {
  try {
    const response = await axios(`${API_URL}/users/${role}`);
    const users = response.data;
    return users;
  } catch (error) {
    return [];
  }
}

export { addUser, getUsers, getUsersByRole };