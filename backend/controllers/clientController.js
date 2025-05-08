const Client = require('../models/Client');

// Create a new client
const createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Get all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('projects');
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single client by ID
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('projects');
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a client by ID
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Delete a client by ID
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
};