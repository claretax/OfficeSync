const express = require('express');
  const router = express.Router();
  const { body, validationResult } = require('express-validator');
  const auth = require('../middleware/auth');
  const Project = require('../models/Project');
  const User = require('../models/User');
  const Team = require('../models/Team');
  const {Notification, NotificationRule} = require('../models/Notification');
const { enrichNotificationRules } = require('../utils/notificationUtils');

  // @route   GET api/projects
  // @desc    Get all projects
  // @access  Private
  router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      let projects;

      if (user.role === 'admin') {
        projects = await Project.find()
          .populate({
            path: 'team',
            populate: [
              { path: 'teamLeader', select: 'name email' },
              { path: 'teamMembers', select: 'name email' }
            ]
          })
          .populate('clients', 'name email');
      } else if (user.role === 'manager') {
        projects = await Project.find()
          .populate({
            path: 'team',
            match: { teamLeader: req.user.id },
            populate: [
              { path: 'teamLeader', select: 'name email' },
              { path: 'teamMembers', select: 'name email' }
            ]
          })
          .populate('clients', 'name email');
      } else {
        projects = await Project.find()
          .populate({
            path: 'team',
            match: { teamMembers: req.user.id },
            populate: [
              { path: 'teamLeader', select: 'name email' },
              { path: 'teamMembers', select: 'name email' }
            ]
          })
          .populate('clients', 'name email');
      }

      res.json(projects);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });


  // @route   POST api/projects
  // @desc    Create a project
  // @access  Private (Admin/Manager)
  router.post('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin' && user.role !== 'manager') {
        return res.status(403).json({ msg: 'Not authorized to create projects' });
      }

      const {
        name,
        description,
        startDate,
        endDateTeam,
        endDateClient,
        team,
        clients,
        priority,
        tags,
        notificationRules = []
      } = req.body;
      notificationRules.push(await NotificationRule.findOne({condition: 'project_created'}))

      const newProject = new Project({
        name,
        description,
        startDate,
        endDateTeam,
        endDateClient,
        team,
        clients,
        priority,
        tags,
        createdBy: req.user.id
      });
      const project = await newProject.save();

      const existingTeam = await Team.findById(team);
      if (!existingTeam) {
        return res.status(404).json({ msg: 'Team not found' });
      }

      // In the POST route for creating a project, update the notification handling:
      
      if(notificationRules && Array.isArray(notificationRules) && notificationRules.length > 0) {
        const rules = await Promise.all(notificationRules.map(id => enrichNotificationRules(id, project._id)));
        // Create notification
        const newNotification = new Notification({
          projectId: project._id,
          rules: rules
        });
        const savedNotification = await newNotification.save();
        
        // Update project with notification reference
        project.notification = savedNotification._id;
        await project.save();
      }

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  // @route   PUT api/projects/:id
  // @desc    Update a project
  // @access  Private (Admin/Manager)
  router.put('/:id', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin' && user.role !== 'manager') {
        return res.status(403).json({ msg: 'Not authorized to update projects' });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      // Check if user is the manager of the project
      if (user.role === 'manager' && project.manager.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to update this project' });
      }

      const {
        name,
        description,
        status,
        startDate,
        endDate,
        progress,
        teamMembers,
        client,
        budget,
        priority,
        customFields,
        tags
      } = req.body;

      // Update project fields
      if (name) project.name = name;
      if (description) project.description = description;
      if (status) project.status = status;
      if (startDate) project.startDate = startDate;
      if (endDate) project.endDate = endDate;
      if (progress) project.progress = progress;
      if (teamMembers) project.teamMembers = teamMembers;
      if (client) project.client = client;
      if (budget) project.budget = budget;
      if (priority) project.priority = priority;
      if (customFields) project.customFields = customFields;
      if (tags) project.tags = tags;

      await project.save();
      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  // @route   DELETE api/projects/:id
  // @desc    Delete a project
  // @access  Private (Admin/Manager)
  router.delete('/:id', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin' && user.role !== 'manager') {
        return res.status(403).json({ msg: 'Not authorized to delete projects' });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      // Check if user is the manager of the project
      if (user.role === 'manager' && project.manager.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to delete this project' });
      }

      await project.deleteOne();
      res.status(200).json({ msg: 'Project removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  // @route   GET api/projects/:id
  // @desc    Get project by ID
  // @access  Private
  router.get('/:id', auth, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate('manager', 'name email')
        .populate('teamMembers', 'name email')
        .populate('client', 'name email');

      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      // Check if user has access to the project
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin' && 
          project.manager.toString() !== req.user.id && 
          !project.teamMembers.includes(req.user.id)) {
        return res.status(403).json({ msg: 'Not authorized to view this project' });
      }

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  module.exports = router;