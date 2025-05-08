import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { addUser } from '@/api/users';
import { toast } from 'react-toastify';

const AddTeamLeaderDialog = ({ open, onOpenChange, onAddLeader }) => {
  const [newUser, setNewUser] = React.useState({
    name: '',
    phone: '',
    email: '',
    role: 'project_lead'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const user = await addUser(newUser);
      if (user) {
      onAddLeader(user);
      onOpenChange(false);
      toast.success('Team leader added successfully');
      }else{
        toast.error('Failed to add team leader');
      }
    } catch (error) {
      toast.error('Failed to add team leader');
      console.error('Network error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Team Leader</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={newUser.name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" value={newUser.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={newUser.email} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamLeaderDialog;