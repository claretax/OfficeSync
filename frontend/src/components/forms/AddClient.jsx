import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addClient } from '@/api/clients';
const token = localStorage.getItem('token');

const ClientForm = ({ onClose, onAddClient }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    companyName: '',  
    contactPerson: '',
    industry: '',
    taxId: '',
    status: 'active',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const client = await addClient(formData);
      onAddClient(client);
      onClose();
    } catch (error) {
      console.error('Client creation error:', error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-6 shadow-lg rounded-2xl">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Client</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <Label>Address</Label>
            <Input name="address" value={formData.address} onChange={handleChange} placeholder="Enter full address" />
          </div>
          <div>
            <Label>Company Name</Label>
            <Input name="companyName" value={formData.companyName} onChange={handleChange} />
          </div>
          {/* <div>
            <Label>Contact Person</Label>
            <Input name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
          </div> */}
          {/* <div>
            <Label>Industry</Label>
            <Input name="industry" value={formData.industry} onChange={handleChange} />
          </div> */}
          {/* <div>
            <Label>Tax ID</Label>
            <Input name="taxId" value={formData.taxId} onChange={handleChange} />
          </div> */}
          <div>
            <Label>Status</Label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded px-2 py-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea name="notes" value={formData.notes} onChange={handleChange} />
          </div>
          <Button type="submit" className="mt-4 w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientForm;