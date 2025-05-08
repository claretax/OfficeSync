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


export { getUsers };