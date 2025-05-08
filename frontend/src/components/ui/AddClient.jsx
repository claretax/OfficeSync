import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
const token = localStorage.getItem('token');

const ClientForm = () => {
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
    console.log('Form submitted:', formData);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/clients`,formData , {
        headers: {'x-auth-token': token},
      });
      if (response) {
        console.log('Client saved:', response.data);
        // Reset form
        setFormData({
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
      } else {
        console.error('Error:', await response.data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-6 shadow-lg rounded-2xl">
      <CardContent>
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