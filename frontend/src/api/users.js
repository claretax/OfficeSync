import { API_URL } from "@/constants";
import axios from "axios";
import { toast } from "react-toastify";

//add new user
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

//get al users
const getUsers = async () => {
  try {
    const response = await axios(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    return [];
  }
}

//get users by role
const getUsersByRole = async (role) => {
  try {
    const response = await axios(`${API_URL}/users/${role}`);
    const users = response.data;
    return users;
  } catch (error) {
    return [];
  }
}

//delete the user
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    if (response.status === 200) {
      toast.success('User deleted successfully');
    }
    return response.data;
  }
  catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.error);
      return error.response.data;
    }
    return { error: 'Something went wrong' };
  }
}

export { addUser, getUsers, getUsersByRole, deleteUser };