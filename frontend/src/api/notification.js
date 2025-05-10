import { API_URL } from "@/constants";
const token = localStorage.getItem('token');

const getNotifcationRules = async () => {
  const res = await fetch(`${API_URL}/notifications/rules`, {
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  return res.json();
};

const addNotificationRule = async (rule) => {
  const res = await fetch(`${API_URL}/notifications/rules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': `${token}`,
    },
    body: JSON.stringify(rule),
  });
  return res.json();
};

export { getNotifcationRules, addNotificationRule};