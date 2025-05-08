import { API_URL } from "@/constants";
import axios from "axios";
const token = localStorage.getItem('token')
const getTeams = async () => {
    const teams = await axios.get(`${API_URL}/teams`, {headers : {
        'x-auth-token':token,
    }})
}

export {getTeams}