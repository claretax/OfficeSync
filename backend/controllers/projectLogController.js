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
      const { projectId } = req.params;
      const projectLogs = await ProjectLog.find();
      res.status(200).json(projectLogs);
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  module.exports = {
    createProjectLog,
    getProjectLogs
  }