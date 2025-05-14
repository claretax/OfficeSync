import { API_URL } from "@/constants";
import axios from "axios";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

export const getPeriodicTasks = async () => {
  try {
    const res = await axios.get(`${API_URL}/periodic-tasks`, {
      headers: { "x-auth-token": token },
    });
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to fetch tasks");
    return [];
  }
};

export const addPeriodicTask = async (task) => {
  try {
    const res = await axios.post(`${API_URL}/periodic-tasks`, task, {
      headers: { "x-auth-token": token },
    });
    toast.success("Task added successfully");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to add task");
    return error.response?.data;
  }
};

export const updatePeriodicTask = async (id, task) => {
  try {
    const res = await axios.put(`${API_URL}/periodic-tasks/${id}`, task, {
      headers: { "x-auth-token": token },
    });
    toast.success("Task updated successfully");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to update task");
    return error.response?.data;
  }
};

export const deletePeriodicTask = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/periodic-tasks/${id}`, {
      headers: { "x-auth-token": token },
    });
    toast.success("Task deleted successfully");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to delete task");
    return error.response?.data;
  }
};