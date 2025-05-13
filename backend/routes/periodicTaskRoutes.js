const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllPeriodicTasks,
  getPeriodicTaskById,
  createPeriodicTask,
  updatePeriodicTask,
  deletePeriodicTask
} = require('../controllers/periodicTaskController');

// GET all periodic tasks
router.get('/', auth, getAllPeriodicTasks);
// GET a periodic task by ID
router.get('/:id', auth, getPeriodicTaskById);
// POST create a new periodic task
router.post('/', auth, createPeriodicTask);
// PUT update a periodic task
router.put('/:id', auth, updatePeriodicTask);
// DELETE a periodic task
router.delete('/:id', auth, deletePeriodicTask);

module.exports = router;