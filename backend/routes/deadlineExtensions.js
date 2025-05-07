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
      days,
      reason,
    } = req.body;
  try {
    const daysToAdd = parseInt(days, 10);
        if (isNaN(daysToAdd)) {
            return res.status(400).json({ msg: 'Invalid number of days' });
        }

    const project = await Project.findById(req.body.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const currentDeadline = project.endDateClient || new Date();
    const extendedDeadline = new Date(currentDeadline);
    extendedDeadline.setDate(extendedDeadline.getDate() + daysToAdd);

    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to request extension for this task' });
    }

    const newExtension = new DeadlineExtension({
      project: projectId,
      requestedBy: req.user.id,
      oldDeadline: project.endDateClient,
       newDeadline: extendedDeadline,
      reason
    });
    project.endDateClient = extendedDeadline;
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

//get the deadline by project id
router.get('/:projectId',auth, async(req, res)=>{
    try{
      const projectId = req.params.projectId;
      const extesntions = await DeadlineExtension.find({project: projectId});
      res.status(200).json(extesntions);
    }catch(error){
      console.log(error.message)
      res.status(500).send('Server error');
    }
})

// Helper function to get projects managed by a user
async function getManagedProjects(userId) {
  const projects = await Project.find({ manager: userId });
  return projects.map(p => p._id);
}

module.exports = router; 