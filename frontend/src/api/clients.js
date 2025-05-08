import { API_URL } from "@/constants";
import axios from "axios";

const getClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

export {getClients};