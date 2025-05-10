import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddNotificationRuleDialog from '@/components/dialogs/AddNotificationRuleDialog';
import { getNotifcationRules } from '@/api/notification';

// Dummy data for notification rules
// let dummyRules = [
//   {
//     _id: '1',
//     name: 'Project Creation',
//     condition: 'project_created',
//     recipientRoles: ['team_leader', 'team_member'],
//     messageTemplate: 'New project {0} assigned to you',
//     channel: 'whatsapp'
//   },
//   {
//     _id: '2',
//     name: 'Daily Reminder',
//     condition: 'days_remaining_team < 5',
//     recipientRoles: ['admin'],
//     messageTemplate: 'Project {0} has {1} days remaining',
//     channel: 'whatsapp'
//   },
//   {
//     _id: '3',
//     name: 'Payment Status',
//     condition: 'payment_status = pending',
//     recipientRoles: ['admin'],
//     messageTemplate: 'Payment for project {0} is pending',
//     channel: 'whatsapp'
//   }
// ];
// NotificationSettings Component (Homepage)
const NotificationSettings = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationRules, setNotificationRules] = useState([]);
  
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

  const handleAddNotificationRule = (rule) => {
    setNotificationRules([...notificationRules, rule]);
    setOpenDialog(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notification Settings</h1>
        <Button onClick={() => setOpenDialog(true)}>Add New Rule</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Recipient Roles</TableHead>
            <TableHead>Message Template</TableHead>
            <TableHead>Channel</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddNotificationRuleDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onAddNotificationRule={handleAddNotificationRule}
        token="dummy-token" // Placeholder for static version
      />
    </div>
  );
};

export default NotificationSettings;