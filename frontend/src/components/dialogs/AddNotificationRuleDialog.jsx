import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddNotificationRuleDialog = ({ open, onOpenChange, onAddNotificationRule, token }) => {
  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    recipientRoles: [],
    recipientUserIds: [],
    messageTemplate: '',
    channel: 'whatsapp'
  });
  const [users, setUsers] = useState([]); // For recipientUserIds selection

  // Fetch users for recipientUserIds
  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/users', {
            headers: {
              'x-auth-token': token
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
          } else {
            console.error('Error fetching users:', await response.json());
          }
        } catch (error) {
          console.error('Network error:', error);
        }
      };
      fetchUsers();
    }
  }, [open, token]);

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
    try {
      const response = await fetch('http://localhost:5000/api/notification-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newRule)
      });
      if (response.ok) {
        const rule = await response.json();
        onAddNotificationRule(rule); // Pass new rule to parent
        setNewRule({
          name: '',
          condition: '',
          recipientRoles: [],
          recipientUserIds: [],
          messageTemplate: '',
          channel: 'whatsapp'
        });
        onOpenChange(false); // Close dialog
      } else {
        console.error('Error:', await response.json());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
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

export default AddNotificationRuleDialog;