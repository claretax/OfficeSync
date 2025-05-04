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
router.post('/', auth,
  async (req, res) => {
    const {
      projectId,
      newDeadline,
      reason,
      category
    } = req.body;
  try {
    const newDeadlineDate = new Date(newDeadline);
    if (isNaN(newDeadlineDate.getTime())) {
      return res.status(400).json({ msg: 'Invalid newDeadline date' });
    }

    const project = await Project.findById(req.body.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to request extension for this task' });
    }

    const newExtension = new DeadlineExtension({
      project: projectId,
      requestedBy: req.user.id,
      oldDeadline: project.endDate,
       newDeadline: newDeadlineDate,
      reason,
      category
    });
    project.endDate = newDeadlineDate;
    await Promise.all([newExtension.save(), project.save()]);

    res.status(200).json({
      extension: newExtension,
      project: {
        _id: project._id,
        endDate: project.endDate,
      },
    });
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