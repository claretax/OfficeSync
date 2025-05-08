import { API_URL } from "@/constants";
import axios from "axios";
import { toast } from "react-toastify";

const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    if (response.status === 201) {
      toast.success('User added successfully');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.error);
      return error.response.data;
    }
    return { error: 'Something went wrong' };
  }
};


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