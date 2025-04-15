const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const DeadlineExtension = require('../models/DeadlineExtension');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');

// @route   GET api/deadline-extensions
// @desc    Get all deadline extensions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let extensions;

    if (user.role === 'admin') {
      extensions = await DeadlineExtension.find()
        .populate('task', 'name project')
        .populate('requestedBy', 'name email')
        .populate('approvedBy', 'name email');
    } else if (user.role === 'manager') {
      const tasks = await Task.find({ project: { $in: await getManagedProjects(req.user.id) } });
      const taskIds = tasks.map(t => t._id);
      extensions = await DeadlineExtension.find({ task: { $in: taskIds } })
        .populate('task', 'name project')
        .populate('requestedBy', 'name email')
        .populate('approvedBy', 'name email');
    } else {
      extensions = await DeadlineExtension.find({ requestedBy: req.user.id })
        .populate('task', 'name project')
        .populate('requestedBy', 'name email')
        .populate('approvedBy', 'name email');
    }

    res.json(extensions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/deadline-extensions
// @desc    Request a deadline extension
// @access  Private
router.post('/', [
  auth,
  [
    body('task', 'Task ID is required').not().isEmpty(),
    body('newDeadline', 'New deadline is required').not().isEmpty(),
    body('reason', 'Reason is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty()
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
      return res.status(403).json({ msg: 'Not authorized to request extension for this task' });
    }

    const {
      task: taskId,
      newDeadline,
      reason,
      category
    } = req.body;

    const newExtension = new DeadlineExtension({
      task: taskId,
      requestedBy: req.user.id,
      oldDeadline: task.deadline,
      newDeadline,
      reason,
      category
    });

    const extension = await newExtension.save();
    res.json(extension);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/deadline-extensions/:id/approve
// @desc    Approve a deadline extension
// @access  Private (Admin/Manager)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const extension = await DeadlineExtension.findById(req.params.id);
    if (!extension) {
      return res.status(404).json({ msg: 'Extension request not found' });
    }

    const user = await User.findById(req.user.id);
    const task = await Task.findById(extension.task);
    const project = await Project.findById(task.project);

    if (user.role !== 'admin' && project.manager.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to approve this extension' });
    }

    extension.status = 'approved';
    extension.approvedBy = req.user.id;
    extension.approvalDate = Date.now();

    // Update task deadline
    task.deadline = extension.newDeadline;
    await task.save();
    await extension.save();

    res.json(extension);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/deadline-extensions/:id/reject
// @desc    Reject a deadline extension
// @access  Private (Admin/Manager)
router.put('/:id/reject', [
  auth,
  body('rejectionReason', 'Rejection reason is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const extension = await DeadlineExtension.findById(req.params.id);
    if (!extension) {
      return res.status(404).json({ msg: 'Extension request not found' });
    }

    const user = await User.findById(req.user.id);
    const task = await Task.findById(extension.task);
    const project = await Project.findById(task.project);

    if (user.role !== 'admin' && project.manager.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to reject this extension' });
    }

    extension.status = 'rejected';
    extension.rejectionReason = req.body.rejectionReason;
    await extension.save();

    res.json(extension);
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