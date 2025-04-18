import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { API_URL } from '../constants';
import axios from 'axios';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLeads = async () => {
    const response = await axios.get(API_URL + '/api/leads');
    setLeads(response.data);
    return response.data;
  };

  useEffect(() => {
    getLeads();
  }, []);

  const statusCounts = (project) => {
    return project.requestedData.reduce((acc, data) => {
      const statusKey = data.isReceived ? 'Y' : 'N';
      if (!acc[statusKey]) {
        acc[statusKey] = 0;
      }
      acc[statusKey]++;
      return acc;
    }, {});
  };

  const hasPendingRequests = (project) => {
    return project.requestedData.some(data => !data.isReceived);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'At Risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/leads/${id}`);
      if (response.status === 200) {
        setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
        alert('Lead deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleStatusToggle = async (leadId, dataId, newStatus) => {
    try {
      const response = await axios.patch(`${API_URL}/api/leads/${leadId}/requestedData/${dataId}`, {
        isReceived: newStatus
      });
      if (response.status === 200) {
        setLeads(prevLeads => prevLeads.map(lead => {
          if (lead._id === leadId) {
            return {
              ...lead,
              requestedData: lead.requestedData.map(data => {
                if (data._id === dataId) {
                  return { ...data, isReceived: newStatus };
                }
                return data;
              })
            };
          }
          return lead;
        }));
        // Update selectedLead if it's the one being modified
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead({
            ...selectedLead,
            requestedData: selectedLead.requestedData.map(data => {
              if (data._id === dataId) {
                return { ...data, isReceived: newStatus };
              }
              return data;
            })
          });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openModal = (project) => {
    setSelectedLead(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLead(null);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
          <Link to="/leads/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Create New Lead
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remark
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {project.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {project.client.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.remark}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openModal(project)}
                        className={`px-3 py-1 rounded-full text-white ${
                          hasPendingRequests(project) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        View Requests
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(project._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{selectedLead.title} - Requested Data</h3>
              <div className="mt-2 space-y-4">
                {selectedLead.requestedData.map((data) => (
                  <div key={data._id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{data.name || 'Data Item'}</p>
                      <p className="text-sm text-gray-500">
                        Status: {data.isReceived ? 'Received' : 'Pending'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleStatusToggle(selectedLead._id, data._id, !data.isReceived)}
                      className={`px-2 py-1 rounded text-white ${
                        data.isReceived ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      Mark as {data.isReceived ? 'Pending' : 'Received'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Leads;