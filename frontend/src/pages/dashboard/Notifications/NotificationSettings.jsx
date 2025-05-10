import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dummy data for notification rules
const dummyRules = [
  {
    _id: '1',
    name: 'Project Creation',
    condition: 'project_created',
    recipientRoles: ['team_leader', 'team_member'],
    messageTemplate: 'New project {0} assigned to you',
    channel: 'whatsapp'
  },
  {
    _id: '2',
    name: 'Daily Reminder',
    condition: 'days_remaining_team < 5',
    recipientRoles: ['admin'],
    messageTemplate: 'Project {0} has {1} days remaining',
    channel: 'whatsapp'
  },
  {
    _id: '3',
    name: 'Payment Status',
    condition: 'payment_status = pending',
    recipientRoles: ['admin'],
    messageTemplate: 'Payment for project {0} is pending',
    channel: 'whatsapp'
  }
];

// AddNotificationRuleDialog Component (reused from previous implementation)
const AddNotificationRuleDialog = ({ open, onOpenChange, onAddNotificationRule, token }) => {
  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    recipientRoles: [],
    recipientUserIds: [],
    messageTemplate: '',
    channel: 'whatsapp'
  });
  const [users] = useState([
    { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
    { _id: 'user2', name: 'Jane Smith', email: 'jane@example.com' }
  ]); // Static dummy users

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRule((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role, checked) => {
    setNewRule((prev) => ({
      ...prev,
      recipientRoles: checked
        ? [...prev.recipientRoles, role]
        : prev.recipientRoles.filter((r) => r !== role)
    }));
  };

  const handleUserChange = (userId) => {
    setNewRule((prev) => ({
      ...prev,
      recipientUserIds: prev.recipientUserIds.includes(userId)
        ? prev.recipientUserIds.filter((id) => id !== userId)
        : [...prev.recipientUserIds, userId]
    }));
  };

  const handleSubmit = async () => {
    // Simulate API call for static version
    console.log('New rule:', newRule);
    onAddNotificationRule(newRule);
    setNewRule({
      name: '',
      condition: '',
      recipientRoles: [],
      recipientUserIds: [],
      messageTemplate: '',
      channel: 'whatsapp'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Add New Notification Rule</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={newRule.name}
              onChange={handleChange}
              required
              placeholder="e.g., Project Creation"
            />
          </div>
          <div>
            <Label>Condition</Label>
            <Input
              name="condition"
              value={newRule.condition}
              onChange={handleChange}
              required
              placeholder="e.g., project_created or days_remaining_team < 5"
            />
          </div>
          <div>
            <Label>Recipient Roles</Label>
            <div className="flex flex-col gap-2">
              {['team_leader', 'team_member', 'admin'].map((role) => (
                <div key={role} className="flex items-center gap-2">
                  <Checkbox
                    id={role}
                    checked={newRule.recipientRoles.includes(role)}
                    onCheckedChange={(checked) => handleRoleChange(role, checked)}
                  />
                  <Label htmlFor={role}>{role.replace('_', ' ')}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Recipient Users (Optional)</Label>
            <Select
              onValueChange={handleUserChange}
              multiple
            >
              <SelectTrigger>
                <SelectValue placeholder="Select users" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Message Template</Label>
            <Input
              name="messageTemplate"
              value={newRule.messageTemplate}
              onChange={handleChange}
              required
              placeholder="e.g., New project {0} assigned to you"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use {`{0}, {1}, ...`} for placeholders (WhatsApp template format).
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// NotificationSettings Component (Homepage)
const NotificationSettings = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddNotificationRule = (rule) => {
    console.log('New rule added:', rule);
    // In a dynamic version, update state or refetch rules
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
          {dummyRules.map((rule) => (
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