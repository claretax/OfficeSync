import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AddTeamLeaderDialog from '@/components/dialogs/AddTeamLeaderDialog';
import AddTeamMemberDialog from '@/components/dialogs/AddTeamMemberDialog';
import { getUsersByRole } from '@/api/users';
import Select from 'react-select';
import { addTeam } from '@/api/teams';

const AddTeam = ({ onClose, onAddTeam }) => {
  const [formData, setFormData] = useState({
    name: 'New Team',
    teamLeader: '',
    teamMembers: []
  });
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [members, setMembers] = useState([]);
  const [openLeaderDialog, setOpenLeaderDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const leaders = await getUsersByRole('project_lead');
        const members = await getUsersByRole('employee');
        setTeamLeaders(leaders);
        setMembers(members);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamMembersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      teamMembers: selectedOptions
    }));
  };

  const handleAddLeader = (user) => {
    setTeamLeaders((prev) => [...prev, user]);
    setFormData((prev) => ({ ...prev, teamLeader: user._id }));
  };

  const handleAddMember = (user) => {
    setMembers((prev) => [...prev, user]);
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, user._id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      onAddTeam(await addTeam(formData));
      onClose();
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // Convert members to Select options
  const memberOptions = members.map(member => ({
    value: member._id,
    label: member.name
  }));

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-6 shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Create New Team</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Team Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter team name"
            />
          </div>
          <div>
            <Label>Team Leader</Label>
            <div className="flex gap-2">
              <select
                name="teamLeader"
                value={formData.teamLeader}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2"
              >
                <option value="">Select Team Leader</option>
                {teamLeaders.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <Button type="button" onClick={() => setOpenLeaderDialog(true)}>
                Add New
              </Button>
            </div>
          </div>
          <div>
            <Label>Team Members</Label>
            <div className="flex gap-2">
              <Select
                isMulti
                options={memberOptions}
                value={memberOptions.filter(option => 
                  formData.teamMembers.includes(option.value)
                )}
                onChange={(selectedOptions) => {
                  setFormData(prev => ({
                    ...prev,
                    teamMembers: selectedOptions.map(option => option.value)
                  }));
                }}
                className="react-select-container flex-grow"
                classNamePrefix="react-select"
                placeholder="Search and select team members..."
              />
              <Button type="button" onClick={() => setOpenMemberDialog(true)}>
                Add New
              </Button>
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full">Create Team</Button>
        </form>
      </CardContent>

      <AddTeamLeaderDialog
        open={openLeaderDialog}
        onOpenChange={setOpenLeaderDialog}
        onAddLeader={handleAddLeader}
      />
      <AddTeamMemberDialog
        open={openMemberDialog}
        onOpenChange={setOpenMemberDialog}
        onAddMember={handleAddMember}
      />
    </Card>
  );
};

export default AddTeam;