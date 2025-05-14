import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import AddNotificationRuleDialog from '@/components/dialogs/AddNotificationRuleDialog';
import { deleteNotificationRule, getNotifcationRules, getNotifications, deleteNotification } from '@/api/notification';

// NotificationSettings Component (Homepage)
const NotificationSettings = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationRules, setNotificationRules] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch notification rules
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const newNotificationRules = await getNotifcationRules();
        setNotificationRules(newNotificationRules);
      }
      catch (error) {
        console.error('Error fetching notification rules:', error);
      }
    }
    fetchRules();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleAddNotificationRule = (rule) => {
    setNotificationRules([...notificationRules, rule]);
    setOpenDialog(false);
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await deleteNotificationRule(ruleId);
      setNotificationRules(prev => prev.filter(rule => rule._id !== ruleId));
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notification Settings</h1>
        <Button onClick={() => setOpenDialog(true)}>Add New Rule</Button>
      </div>
      {/* Notification Rules Table */}
      <h2 className="text-xl font-semibold mb-2">Notification Rules</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Recipient Roles</TableHead>
            <TableHead>Message Template</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notificationRules.map((rule) => (
            <TableRow key={rule._id}>
              <TableCell>{rule.name}</TableCell>
              <TableCell>{rule.condition}</TableCell>
              <TableCell>{rule.recipientRoles.join(', ')}</TableCell>
              <TableCell>{rule.messageTemplate}</TableCell>
              <TableCell>{rule.channel}</TableCell>
              <TableCell>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteRule(rule._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddNotificationRuleDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onAddNotificationRule={handleAddNotificationRule}
        token="dummy-token"
      />

      {/* Notifications Table */}
      <h2 className="text-xl font-semibold mt-10 mb-2">Notifications</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Rule</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) =>
            notification.rules.flatMap((rule) =>
              rule.notifications.map((notif, idx) => (
                <TableRow key={notif._id || `${notification._id}-${rule.ruleId}-${notif.recipientId}-${idx}`}>
                  <TableCell>{notification.projectId?.name || notification.projectId || '-'}</TableCell>
                  <TableCell>{rule.ruleId?.name || rule.ruleId || '-'}</TableCell>
                  <TableCell>
                    {notif.recipientId?.name || notif.recipientId || '-'}
                  </TableCell>
                  <TableCell>{notif.message}</TableCell>
                  <TableCell>{notif.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteNotification(notification._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotificationSettings;