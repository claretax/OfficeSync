const routes = require('express').Router();
const { getProjectLogs, createProjectLog, getProjectLogsByProjectId } = require('../controllers/projectLogController');
// project logs
routes.get('/projectLogs', getProjectLogs);
routes.post('/projectLogs', createProjectLog);
routes.get('/projectLogs/:projectId', getProjectLogsByProjectId);

module.exports = routes;
