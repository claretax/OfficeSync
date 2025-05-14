import { API_URL } from "@/constants";
import axios from "axios";
import { toast } from "react-toastify";
const token = localStorage.getItem('token')

const getTeams = async () => {
   try {
    const teams = await axios.get(`${API_URL}/teams`, {headers : {
        'x-auth-token':token,
    }})
    return teams.data
   } catch (error) {
    toast.error(error.response.data.error)
   }
}

const addTeam = async (team) => {
    try {
        const response = await axios.post(`${API_URL}/teams`, team, {headers : {
            'x-auth-token':token,
        }})
        if (response.status === 200 || response.status === 201) {
            toast.success("Team added successfully")    
        }else {
            toast.error(response.data.error)
        }
        return response.data
    } catch (error) {
        toast.error(error.response.data.error)
        return error.response.data
    }
}

const deleteTeam = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/teams/${id}`, {headers : {
            'x-auth-token':token,
        }})
        if (response.status === 200 || response.status === 201) {
            toast.success("Team deleted successfully")
        }
        return response.data
    }
    catch (error) {
        toast.error(error.response.data.error)
        return error.response.data
    }
}

export {getTeams, addTeam, deleteTeam}