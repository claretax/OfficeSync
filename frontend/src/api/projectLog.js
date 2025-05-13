import { API_URL } from "@/constants";
import axios from "axios";

export const fetchProjectLogs = async (projectId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/logs/projectLogs/${projectId}`, {
    headers: { "x-auth-token": token },
  });
  return res.data;
};

export const createProjectLog = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/logs/projectLogs`, data, {
    headers: { "x-auth-token": token },
  });
  return res.data;
};