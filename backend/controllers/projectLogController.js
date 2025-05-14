const ProjectLog = require('../models/ProjectLog');

const createProjectLog = async (req, res) => {
    try {
      const { project, content } = req.body;
      const projectLog = new ProjectLog({ project, content});
      await projectLog.save();
      res.status(201).json(projectLog);
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
const getProjectLogs = async (req, res) => {
    try {
      const projectLogs = await ProjectLog.find();
      if (!projectLogs) {
        return res.status(404).json({ message: 'ProjectLogs not found' });
      }
      res.status(200).json(projectLogs);
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
//get project logs by projectId
const getProjectLogsByProjectId = async (req, res) => {
    try {
      const { projectId } = req.params;
      const projectLogs = await ProjectLog.find({ project: projectId });
      if (!projectLogs) {
        return res.status(404).json({ message: 'ProjectLogs not found' });
      }
      res.status(200).json(projectLogs);
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


  module.exports = {
    createProjectLog,
    getProjectLogs,
    getProjectLogsByProjectId
  }