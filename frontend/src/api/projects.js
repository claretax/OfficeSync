import { API_URL } from "@/constants";
import axios from "axios";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

const addProject = async (project) => {
    try {
        const response = await axios.post(`${API_URL}/projects`, project, {
            headers: {
                "x-auth-token": `${token}`,
            },
        });
        toast.success(response.data?.message || "Project added successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.error || "Something went wrong");
        console.log(error.response?.data?.error || "Something went wrong");
        return response?.data;
    }
};

const deleteProject = async (projectId) => {
    try {
        const response = await axios.delete(`${API_URL}/projects/${projectId}`, {
            headers: {
                "x-auth-token": `${token}`,
            },
        });
        toast.success(response.data?.msg || "Project deleted successfully");
        return response.data;
    }
    catch (error) {
        toast.error(error.response?.data?.error || "Something went wrong");
        console.log(error.response?.data?.error || "Something went wrong");
        return response?.data;
    }
}

export {addProject, deleteProject}