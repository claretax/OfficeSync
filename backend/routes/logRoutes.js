const routes = require('express').Router();
const { getProjectLogs, createProjectLog } = require('../controllers/projectLogController');
// project logs
routes.get('/projectLogs/:projectId', getProjectLogs);
routes.post('/projectLogs', createProjectLog);

module.exports = routes;
