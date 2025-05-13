const PeriodicTask = require('../models/PeriodicTask');

// Get all periodic tasks
const getAllPeriodicTasks = async (req, res) => {
  try {
    const tasks = await PeriodicTask.find().populate('assignee', 'name email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a periodic task by ID
const getPeriodicTaskById = async (req, res) => {
  try {
    const task = await PeriodicTask.findById(req.params.id).populate('assignee', 'name email');
    if (!task) return res.status(404).json({ error: 'PeriodicTask not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new periodic task
const createPeriodicTask = async (req, res) => {
  try {
    const newTask = new PeriodicTask(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a periodic task
const updatePeriodicTask = async (req, res) => {
  try {
    const updatedTask = await PeriodicTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).json({ error: 'PeriodicTask not found' });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a periodic task
const deletePeriodicTask = async (req, res) => {
  try {
    const deletedTask = await PeriodicTask.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'PeriodicTask not found' });
    res.status(200).json({ message: 'PeriodicTask deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllPeriodicTasks,
  getPeriodicTaskById,
  createPeriodicTask,
  updatePeriodicTask,
  deletePeriodicTask
};