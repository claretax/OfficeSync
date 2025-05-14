import { API_URL } from "@/constants";
import axios from "axios";
import { toast } from "react-toastify";

const getClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

const addClient = async (client) => {
  try {
    const response = await axios.post(`${API_URL}/clients`, client);
    toast.success("Client added successfully");
    console.log('thsi is the response',response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
    console.error("Error adding client:", error);
    return null;
  }
};

const deleteClient = async (clientId) => {
  try {
    const response = await axios.delete(`${API_URL}/clients/${clientId}`);
    toast.success("Client deleted successfully");
    return response.data;
  }
  catch (error) {
    toast.error(error.response.data.error);
    console.error("Error deleting client:", error);
    return null;
  }
}

export {getClients, addClient, deleteClient};