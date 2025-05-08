const express = require('express');
const router = express.Router();
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

// Create a new client
router.post('/', createClient);

// Get all clients
router.get('/', getAllClients);

// Get a single client by ID
router.get('/:id', getClientById);

// Update a client by ID
router.put('/:id', updateClient);

// Delete a client by ID
router.delete('/:id', deleteClient);

module.exports = router;