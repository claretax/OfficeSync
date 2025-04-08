import axios from 'axios';
import { API_URL } from '../constants';

export const uploadContacts = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/contacts/upload`, formData);
};

export const fetchContacts = () => axios.get(`${API_URL}/contacts`);  