import { API_URL } from "@/constants";
import { toast } from "react-toastify";
const token = localStorage.getItem('token');


const getNotifications = async () => {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  return res.json();
}
// delete notification
const deleteNotification = async (id) => {
  const res = await fetch(`${API_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  if (res.status === 200 || res.status === 204){
    toast.success("Notification Deleted Successfully");
  }
}

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
  toast.success("Notification Rule Added Successfully");
  return res;
};

const deleteNotificationRule = async (ruleId) => {
  const res = await fetch(`${API_URL}/notifications/rules/${ruleId}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  if (res.status === 200 || res.status === 204){
    toast.success("Notification Rule Deleted Successfully");
  } else {
    toast.error("Notification Rule Deletion Failed");
  }
  return res;
}

export {getNotifications, deleteNotification, getNotifcationRules, addNotificationRule, deleteNotificationRule};