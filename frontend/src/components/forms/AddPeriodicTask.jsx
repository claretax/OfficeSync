import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AddPeriodicTask = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      taskName: "",
      description: "",
      category: "",
      frequency: "",
      startDate: "",
      endDate: "",
      executionTime: "",
      assignee: null,
      status: "Pending",
      priority: "Medium",
      dependencies: "",
      reminderDays: 0,
      nextRun: ""
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert dependencies to array if not already
    const dataToSave = {
      ...formData,
      dependencies: typeof formData.dependencies === 'string' ? formData.dependencies.split(',').map(dep => dep.trim()).filter(Boolean) : formData.dependencies
    };
    onSave(dataToSave);
    onClose();
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-6 shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {initialData ? "Edit Periodic Task" : "Add Periodic Task"}
        </h2>
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
            <Label>Task Name</Label>
            <Input name="taskName" value={formData.taskName} onChange={handleChange} required />
          </div>
          <div>
            <Label>Description</Label>
            <Input name="description" value={formData.description} onChange={handleChange} />
          </div>
          {/* <div>
            <Label>Category</Label>
            <Input name="category" value={formData.category} onChange={handleChange} />
          </div> */}
          <div>
            <Label>Frequency</Label>
            <select name="frequency" value={formData.frequency} onChange={handleChange} required className="w-full border rounded px-2 py-1">
              <option value="">Select Frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div>
            <Label>Start Date</Label>
            <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div>
            <Label>End Date</Label>
            <Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
          </div>
          {/* <div>
            <Label>Execution Time</Label>
            <Input name="executionTime" type="time" value={formData.executionTime} onChange={handleChange} />
          </div> */}
          <div>
            <Label>Assignee (User ID)</Label>
            <Input name="assignee" value={formData.assignee} onChange={handleChange} />
          </div>
          <div>
            <Label>Status</Label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded px-2 py-1">
              <option value="Pending">Pending</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div>
            <Label>Priority</Label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border rounded px-2 py-1">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          {/* <div>
            <Label>Dependencies (comma separated)</Label>
            <Input name="dependencies" value={formData.dependencies} onChange={handleChange} placeholder="Task IDs or names, comma separated" />
          </div> */}
          <div>
            <Label>Reminder Days</Label>
            <Input name="reminderDays" type="number" min="0" value={formData.reminderDays} onChange={handleChange} />
          </div>
          {/* <div>
            <Label>Next Run</Label>
            <Input name="nextRun" type="date" value={formData.nextRun} onChange={handleChange} />
          </div> */}
          <Button type="submit" className="mt-4 w-full">
            {initialData ? "Update" : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPeriodicTask;