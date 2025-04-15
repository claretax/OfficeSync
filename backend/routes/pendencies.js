const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Pendency = require('../models/Pendency');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');

// @route   GET api/pendencies
// @desc    Get all pendencies
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let pendencies;

    if (user.role === 'admin') {
      pendencies = await Pendency.find()
        .populate('task', 'name project')
        .populate('reportedBy', 'name email');
    } else if (user.role === 'manager') {
      const tasks = await Task.find({ project: { $in: await getManagedProjects(req.user.id) } });
      const taskIds = tasks.map(t => t._id);
      pendencies = await Pendency.find({ task: { $in: taskIds } })
        .populate('task', 'name project')
        .populate('reportedBy', 'name email');
    } else {
      pendencies = await Pendency.find({ reportedBy: req.user.id })
        .populate('task', 'name project')
        .populate('reportedBy', 'name email');
    }

    res.json(pendencies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/pendencies
// @desc    Report a pendency
// @access  Private
router.post('/', [
  auth,
  [
    body('task', 'Task ID is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty(),
    body('reason', 'Reason is required').not().isEmpty(),
    body('subCategory', 'Sub-category is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = await Task.findById(req.body.task);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check if user is assigned to the task
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && !task.assignedTo.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to report pendency for this task' });
    }

    const {
      task: taskId,
      category,
      reason,
      subCategory,
      expectedResolutionDate,
      impact,
      attachments
    } = req.body;

    const newPendency = new Pendency({
      task: taskId,
      reportedBy: req.user.id,
      category,
      reason,
      subCategory,
      expectedResolutionDate,
      impact,
      attachments
    });

    const pendency = await newPendency.save();
    res.json(pendency);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/pendencies/:id/resolve
// @desc    Resolve a pendency
// @access  Private
router.put('/:id/resolve', [
  auth,
  body('resolutionNotes', 'Resolution notes are required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const pendency = await Pendency.findById(req.params.id);
    if (!pendency) {
      return res.status(404).json({ msg: 'Pendency not found' });
    }

    const user = await User.findById(req.user.id);
    const task = await Task.findById(pendency.task);
    const project = await Project.findById(task.project);

    // Check authorization
    if (user.role !== 'admin' && 
        project.manager.toString() !== req.user.id && 
        pendency.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to resolve this pendency' });
    }

    pendency.status = 'resolved';
    pendency.actualResolutionDate = Date.now();
    pendency.resolutionNotes = req.body.resolutionNotes;
    await pendency.save();

    res.json(pendency);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/pendencies/:id/comments
// @desc    Add a comment to a pendency
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
    const pendency = await Pendency.findById(req.params.id);
    if (!pendency) {
      return res.status(404).json({ msg: 'Pendency not found' });
    }

    const user = await User.findById(req.user.id);
    const task = await Task.findById(pendency.task);
    const project = await Project.findById(task.project);

    // Check authorization
    if (user.role !== 'admin' && 
        project.manager.toString() !== req.user.id && 
        pendency.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to comment on this pendency' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    pendency.comments.unshift(newComment);
    await pendency.save();
    res.json(pendency.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper function to get projects managed by a user
async function getManagedProjects(userId) {
  const projects = await Project.find({ manager: userId });
  return projects.map(p => p._id);
}

module.exports = router; 