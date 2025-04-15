const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let tasks;

    if (user.role === 'admin') {
      tasks = await Task.find()
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('dependencies', 'name');
    } else if (user.role === 'manager') {
      const projects = await Project.find({ manager: req.user.id });
      const projectIds = projects.map(p => p._id);
      tasks = await Task.find({ project: { $in: projectIds } })
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('dependencies', 'name');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('dependencies', 'name');
    }

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private (Admin/Manager)
router.post('/', [
  auth,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('project', 'Project is required').not().isEmpty(),
    body('startDate', 'Start date is required').not().isEmpty(),
    body('deadline', 'Deadline is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized to create tasks' });
    }

    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user is the manager of the project
    if (user.role === 'manager' && project.manager.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to create tasks for this project' });
    }

    const {
      name,
      description,
      project: projectId,
      assignedTo,
      priority,
      startDate,
      deadline,
      estimatedHours,
      dependencies,
      customFields
    } = req.body;

    const newTask = new Task({
      name,
      description,
      project: projectId,
      assignedTo: assignedTo || [],
      priority,
      startDate,
      deadline,
      estimatedHours,
      dependencies: dependencies || [],
      customFields
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const user = await User.findById(req.user.id);
    const project = await Project.findById(task.project);

    // Check authorization
    if (user.role !== 'admin' && 
        project.manager.toString() !== req.user.id && 
        !task.assignedTo.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to update this task' });
    }

    const {
      name,
      description,
      status,
      priority,
      startDate,
      deadline,
      estimatedHours,
      actualHours,
      progress,
      assignedTo,
      dependencies,
      customFields
    } = req.body;

    // Update task fields
    if (name) task.name = name;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (startDate) task.startDate = startDate;
    if (deadline) task.deadline = deadline;
    if (estimatedHours) task.estimatedHours = estimatedHours;
    if (actualHours) task.actualHours = actualHours;
    if (progress) task.progress = progress;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dependencies) task.dependencies = dependencies;
    if (customFields) task.customFields = customFields;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private (Admin/Manager)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const user = await User.findById(req.user.id);
    const project = await Project.findById(task.project);

    if (user.role !== 'admin' && project.manager.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this task' });
    }

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('dependencies', 'name');

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const user = await User.findById(req.user.id);
    const project = await Project.findById(task.project);

    // Check authorization
    if (user.role !== 'admin' && 
        project.manager.toString() !== req.user.id && 
        !task.assignedTo.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tasks/:id/comments
// @desc    Add a comment to a task
// @access  Private
router.post('/:id/comments', [
  auth,
  body('text', 'Comment text is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const user = await User.findById(req.user.id);
    const project = await Project.findById(task.project);

    // Check authorization
    if (user.role !== 'admin' && 
        project.manager.toString() !== req.user.id && 
        !task.assignedTo.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to comment on this task' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    task.comments.unshift(newComment);
    await task.save();
    res.json(task.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 